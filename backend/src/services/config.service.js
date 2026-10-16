const supabase = require("../config/supabase");

class ConfigService {
  /**
   * Obtiene la configuración del sitio (colores HEX y logo)
   */
  async getConfig() {
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .order("id", { ascending: true })
      .limit(1);

    if (error) {
      const err = new Error("Error al obtener la configuración del sitio: " + error.message);
      err.statusCode = 500;
      throw err;
    }

    // Si aún no existe registro, devolver la configuración por defecto
    if (!data || data.length === 0) {
      return {
        id: 1,
        site_name: "SocialLaunch Campañas",
        logo_url: null,
        primary_color: "#2563EB",
        secondary_color: "#0F172A",
      };
    }

    return data[0];
  }

  /**
   * Actualiza la tabla site_config con los nuevos colores o logo
   */
  async updateConfig(updates) {
    const { primary_color, secondary_color, logo_url, site_name } = updates;

    const payload = {
      updated_at: new Date().toISOString(),
    };

    if (primary_color !== undefined) payload.primary_color = primary_color;
    if (secondary_color !== undefined) payload.secondary_color = secondary_color;
    if (logo_url !== undefined) payload.logo_url = logo_url;
    if (site_name !== undefined) payload.site_name = site_name;

    // Verificar si existe al menos 1 fila
    const { data: existing } = await supabase
      .from("site_config")
      .select("id")
      .limit(1);

    let result;
    if (existing && existing.length > 0) {
      const idToUpdate = existing[0].id;
      const { data, error } = await supabase
        .from("site_config")
        .update(payload)
        .eq("id", idToUpdate)
        .select()
        .single();

      if (error) {
        const err = new Error("Error al actualizar la configuración: " + error.message);
        err.statusCode = 500;
        throw err;
      }
      result = data;
    } else {
      // Si no existe, insertar nueva fila
      const { data, error } = await supabase
        .from("site_config")
        .insert([{ id: 1, ...payload }])
        .select()
        .single();

      if (error) {
        const err = new Error("Error al crear la configuración inicial: " + error.message);
        err.statusCode = 500;
        throw err;
      }
      result = data;
    }

    return result;
  }
}

module.exports = new ConfigService();
