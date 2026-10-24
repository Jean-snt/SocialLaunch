const dashboardService = require("../services/dashboard.service");

class DashboardController {
  /**
   * GET /api/dashboard/stats
   * KPIs en tiempo real y estado general
   */
  async getStats(req, res, next) {
    try {
      const { timeRange } = req.query;
      const stats = await dashboardService.getStats(timeRange);
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/dashboard/traffic-toggle
   * Alterna el Master Kill-Switch
   */
  async toggleTraffic(req, res, next) {
    try {
      const user = req.user || "Admin";
      const { state } = req.body;
      const result = await dashboardService.toggleTraffic(user, state);
      return res.status(200).json({
        success: true,
        message: result.trafficActive
          ? "Tráfico activado: Redirigiendo a Vitrina Pública"
          : "Tráfico pausado: Modo Mantenimiento / Espera activo",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/leads
   * Lista de leads ofuscados con paginación
   */
  async getLeads(req, res, next) {
    try {
      const { search, page, limit } = req.query;
      const data = await dashboardService.getLeads({ search, page, limit });
      return res.status(200).json({
        success: true,
        data: data.leads,
        pagination: data.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/leads
   * Registrar evento de clic o lead entrante (público)
   */
  async recordLead(req, res, next) {
    try {
      const { source, phone, campaign, value } = req.body;
      const lead = await dashboardService.recordLead({ source, phone, campaign, value });
      return res.status(201).json({
        success: true,
        message: "Evento de conversión registrado con éxito",
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/integrations
   * Píxeles CAPI, Webhooks y Google Sheets
   */
  async getIntegrations(req, res, next) {
    try {
      const data = await dashboardService.getIntegrations();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/dashboard/visit
   * Registra una visita a la vitrina o landing page
   */
  async recordVisit(req, res, next) {
    try {
      const { slug, device } = req.body;
      const result = await dashboardService.recordVisit({ slug, device });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/export-csv
   * Descarga el reporte de leads real en CSV
   */
  async exportLeadsCsv(req, res, next) {
    try {
      const csv = await dashboardService.getLeadsCsv();
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="sociallaunch_reporte_leads_${Date.now()}.csv"`
      );
      return res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/media
   * Almacén SSD y banners optimizados con Sharp
   */
  async getMediaStats(req, res, next) {
    try {
      const data = await dashboardService.getMediaStats();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
