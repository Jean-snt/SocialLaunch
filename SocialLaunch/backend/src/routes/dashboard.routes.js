const { Router } = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { verifyAuth, verifyRole } = require("../middlewares/auth.middleware");

const router = Router();

// GET /api/dashboard/stats: Telemetría y KPIs en vivo
router.get("/stats", dashboardController.getStats);

// POST /api/dashboard/traffic-toggle: Alternar Master Switch de tráfico
router.post("/traffic-toggle", verifyAuth, verifyRole(["admin"]), dashboardController.toggleTraffic);

// GET /api/dashboard/leads: Consulta de capturas de leads con ofuscación
router.get("/leads", verifyAuth, verifyRole(["admin"]), dashboardController.getLeads);

// POST /api/dashboard/leads: Evento de lead / clic WhatsApp (público)
router.post("/leads", dashboardController.recordLead);

// GET /api/dashboard/integrations: Estado de CAPI, Sheets y Webhooks HMAC
router.get("/integrations", verifyAuth, verifyRole(["admin"]), dashboardController.getIntegrations);

// GET /api/dashboard/media: Medidor SSD y banners WebP
router.get("/media", verifyAuth, verifyRole(["admin"]), dashboardController.getMediaStats);

module.exports = router;
