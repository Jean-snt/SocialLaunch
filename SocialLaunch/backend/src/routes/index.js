const { Router } = require("express");
const authRoutes = require("./auth.routes");
const configRoutes = require("./config.routes");
const pagesRoutes = require("./pages.routes");
const dashboardRoutes = require("./dashboard.routes");
const uploadRoutes = require("./upload.routes");

const router = Router();

// 1. Rutas de autenticación segura (JWT httpOnly)
router.use("/auth", authRoutes);

// 2. Rutas de configuración visual y tokens CSS :root
router.use("/config", configRoutes);

// 3. Rutas de campañas/páginas y componentes modulares JSONB
router.use("/pages", pagesRoutes);

// 4. Rutas de telemetría, KPIs, leads ofuscados y DevOps
router.use("/dashboard", dashboardRoutes);

// Alias directo para leads
router.get("/leads", (req, res, next) => {
  req.url = "/leads" + (req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "");
  dashboardRoutes(req, res, next);
});
router.post("/leads", (req, res, next) => {
  req.url = "/leads";
  dashboardRoutes(req, res, next);
});

// 5. Rutas de procesamiento multimedia con Sharp a WebP
router.use("/upload", uploadRoutes);

// 6. Endpoint de Healthcheck para Render y monitoreo continuo
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "SocialLaunch Enterprise CMS API",
    version: "3.8.4",
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
  });
});

module.exports = router;
