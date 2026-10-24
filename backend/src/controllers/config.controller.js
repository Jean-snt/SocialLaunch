const configService = require("../services/config.service");

class ConfigController {
  /**
   * GET /api/config
   * Obtiene la configuración del sitio (colores HEX y logo)
   */
  async getConfig(req, res, next) {
    try {
      const config = await configService.getConfig();
      return res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/config
   * Actualiza la tabla site_config (colores HEX y logo)
   */
  async updateConfig(req, res, next) {
    try {
      const updated = await configService.updateConfig(req.body);
      return res.status(200).json({
        success: true,
        message: "Configuración visual actualizada correctamente",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConfigController();
