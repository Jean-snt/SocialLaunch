const pagesService = require("../services/pages.service");

class PagesController {
  /**
   * GET /api/pages
   * Lista todas las páginas/campañas
   */
  async getAllPages(req, res, next) {
    try {
      const pages = await pagesService.getAllPages();
      return res.status(200).json({
        success: true,
        data: pages,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pages/:identifier
   * Obtiene una página por su ID o Slug
   */
  async getPage(req, res, next) {
    try {
      const { identifier } = req.params;
      const page = await pagesService.getPageByIdOrSlug(identifier);
      return res.status(200).json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/pages
   * Crea una nueva página de campaña
   */
  async createPage(req, res, next) {
    try {
      const newPage = await pagesService.createPage(req.body);
      return res.status(201).json({
        success: true,
        message: "Campaña creada exitosamente con bloques iniciales",
        data: newPage,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/pages/:id
   * Actualiza título, slug o publicación
   */
  async updatePage(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await pagesService.updatePage(id, req.body);
      return res.status(200).json({
        success: true,
        message: "Campaña actualizada exitosamente",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/pages/:id/duplicate
   * Duplica una campaña con todos sus componentes
   */
  async duplicatePage(req, res, next) {
    try {
      const { id } = req.params;
      const duplicated = await pagesService.duplicatePage(id);
      return res.status(201).json({
        success: true,
        message: "Campaña duplicada exitosamente",
        data: duplicated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/pages/:id
   * Elimina una campaña y sus componentes
   */
  async deletePage(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await pagesService.deletePage(id);
      return res.status(200).json({
        success: true,
        message: "Campaña eliminada correctamente",
        data: deleted,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PagesController();
