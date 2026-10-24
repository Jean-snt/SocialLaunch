const componentsService = require("../services/components.service");

class ComponentsController {
  /**
   * GET /api/pages/:pageId/components
   * Lista todos los componentes de una página ordenados por order_index
   */
  async getComponents(req, res, next) {
    try {
      const { pageId } = req.params;
      const components = await componentsService.getComponentsByPage(pageId);
      return res.status(200).json({
        success: true,
        data: components,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pages/:pageId/components/:componentId
   * Obtiene un componente específico por su ID
   */
  async getComponentById(req, res, next) {
    try {
      const { componentId } = req.params;
      const component = await componentsService.getComponentById(componentId);
      return res.status(200).json({
        success: true,
        data: component,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/pages/:pageId/components
   * Inserta un nuevo bloque modular en la página
   */
  async createComponent(req, res, next) {
    try {
      const { pageId } = req.params;
      const newComponent = await componentsService.createComponent(pageId, req.body);
      return res.status(201).json({
        success: true,
        message: "Componente modular creado exitosamente",
        data: newComponent,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/pages/:pageId/components/reorder
   * Reordena los componentes de una página
   */
  async reorderComponents(req, res, next) {
    try {
      const { pageId } = req.params;
      const items = req.body.items || req.body;
      const reordered = await componentsService.reorderComponents(pageId, items);
      return res.status(200).json({
        success: true,
        message: "Componentes reordenados exitosamente",
        data: reordered,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/pages/:pageId/components/:componentId
   * Actualiza el contenido (JSONB), tipo u orden de un componente
   */
  async updateComponent(req, res, next) {
    try {
      const { componentId } = req.params;
      const updated = await componentsService.updateComponent(componentId, req.body);
      return res.status(200).json({
        success: true,
        message: "Componente actualizado exitosamente",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/pages/:pageId/components/:componentId
   * Elimina un componente de la página
   */
  async deleteComponent(req, res, next) {
    try {
      const { componentId } = req.params;
      const deleted = await componentsService.deleteComponent(componentId);
      return res.status(200).json({
        success: true,
        message: "Componente eliminado exitosamente",
        data: deleted,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ComponentsController();
