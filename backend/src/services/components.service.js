const supabase = require("../config/supabase");

class ComponentsService {
  /**
   * Obtiene todos los componentes de una página ordenados por order_index
   * Acepta tanto un ID numérico como un slug de campaña (ej: 'promo-2025' o '/bio')
   */
  async getComponentsByPage(pageIdentifier) {
    let numericPageId;

    if (!isNaN(Number(pageIdentifier))) {
      numericPageId = parseInt(pageIdentifier, 10);
    } else {
      // Buscar ID de página a través del slug
      const cleanSlug = pageIdentifier.startsWith("/") ? pageIdentifier : `/${pageIdentifier}`;
      const { data: pageData } = await supabase
        .from("pages")
        .select("id")
        .or(`slug.eq.${cleanSlug},slug.eq.${pageIdentifier}`)
        .limit(1);

      if (pageData && pageData.length > 0) {
        numericPageId = pageData[0].id;
      } else {
        numericPageId = 1; // Fallback a la campaña principal
      }
    }

    const { data, error } = await supabase
      .from("page_components")
      .select("*")
      .eq("page_id", numericPageId)
      .order("order_index", { ascending: true });

    if (error) {
      const err = new Error("Error al consultar componentes de la página: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return data || [];
  }

  /**
   * Obtiene un componente específico por su ID
   */
  async getComponentById(componentId) {
    const { data, error } = await supabase
      .from("page_components")
      .select("*")
      .eq("id", parseInt(componentId, 10))
      .single();

    if (error || !data) {
      const err = new Error("Componente no encontrado con ID " + componentId);
      err.statusCode = 404;
      throw err;
    }

    return data;
  }

  /**
   * Inserta un nuevo componente en una página con soporte JSONB
   */
  async createComponent(pageId, { component_type, content = {}, order_index }) {
    let numericPageId;

    if (!isNaN(Number(pageId))) {
      numericPageId = parseInt(pageId, 10);
    } else {
      const cleanSlug = pageId.startsWith("/") ? pageId : `/${pageId}`;
      const { data: pageData } = await supabase
        .from("pages")
        .select("id")
        .or(`slug.eq.${cleanSlug},slug.eq.${pageId}`)
        .limit(1);

      numericPageId = pageData && pageData.length > 0 ? pageData[0].id : 1;
    }

    if (!component_type) {
      const err = new Error("El campo component_type es obligatorio");
      err.statusCode = 400;
      throw err;
    }

    // Asegurar que el contenido tenga isActive = true por defecto
    const parsedContent = typeof content === "string" ? JSON.parse(content) : { ...content };
    if (parsedContent.isActive === undefined) {
      parsedContent.isActive = true;
    }

    // Si no se especifica order_index, calcular el siguiente índice
    let finalOrderIndex = order_index;
    if (finalOrderIndex === undefined || finalOrderIndex === null) {
      const { data: existing } = await supabase
        .from("page_components")
        .select("order_index")
        .eq("page_id", numericPageId)
        .order("order_index", { ascending: false })
        .limit(1);

      finalOrderIndex = existing && existing.length > 0 ? existing[0].order_index + 1 : 1;
    }

    const { data, error } = await supabase
      .from("page_components")
      .insert([
        {
          page_id: numericPageId,
          component_type,
          content: parsedContent,
          order_index: finalOrderIndex,
        },
      ])
      .select()
      .single();

    if (error) {
      const err = new Error("Error al crear el componente: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return data;
  }

  /**
   * Actualiza el contenido (JSONB), tipo u orden de un componente
   */
  async updateComponent(componentId, { component_type, content, order_index }) {
    const numericId = parseInt(componentId, 10);

    const payload = {};
    if (component_type !== undefined) payload.component_type = component_type;
    if (content !== undefined) {
      payload.content = typeof content === "string" ? JSON.parse(content) : content;
    }
    if (order_index !== undefined) payload.order_index = parseInt(order_index, 10);

    const { data, error } = await supabase
      .from("page_components")
      .update(payload)
      .eq("id", numericId)
      .select()
      .single();

    if (error) {
      const err = new Error("Error al actualizar el componente: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return data;
  }

  /**
   * Reordena los componentes de una página en lote
   */
  async reorderComponents(pageId, items) {
    let numericPageId;

    if (!isNaN(Number(pageId))) {
      numericPageId = parseInt(pageId, 10);
    } else {
      const cleanSlug = pageId.startsWith("/") ? pageId : `/${pageId}`;
      const { data: pageData } = await supabase
        .from("pages")
        .select("id")
        .or(`slug.eq.${cleanSlug},slug.eq.${pageId}`)
        .limit(1);

      numericPageId = pageData && pageData.length > 0 ? pageData[0].id : 1;
    }

    if (!Array.isArray(items) || items.length === 0) {
      const err = new Error("La lista de elementos para reordenar no es válida");
      err.statusCode = 400;
      throw err;
    }

    // Actualizar cada componente con su nuevo order_index
    const updatePromises = items.map((item, idx) => {
      const componentId = typeof item === "object" ? item.id : item;
      const newOrder = typeof item === "object" && item.order_index !== undefined ? item.order_index : idx + 1;

      return supabase
        .from("page_components")
        .update({ order_index: newOrder })
        .eq("id", componentId)
        .eq("page_id", numericPageId);
    });

    await Promise.all(updatePromises);

    return this.getComponentsByPage(numericPageId);
  }

  /**
   * Elimina un componente por ID
   */
  async deleteComponent(componentId) {
    const numericId = parseInt(componentId, 10);

    const { data, error } = await supabase
      .from("page_components")
      .delete()
      .eq("id", numericId)
      .select();

    if (error) {
      const err = new Error("Error al eliminar el componente: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    return data && data.length > 0 ? data[0] : { id: numericId, deleted: true };
  }
}

module.exports = new ComponentsService();
