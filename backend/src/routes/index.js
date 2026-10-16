const { Router } = require("express");
const authRoutes = require("./auth.routes");
const configRoutes = require("./config.routes");
const componentsRoutes = require("./components.routes");
const uploadRoutes = require("./upload.routes");
const supabase = require("../config/supabase");

const router = Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de configuración visual (site_config)
router.use("/config", configRoutes);

// Rutas de componentes modular por página
router.use("/pages/:pageId/components", componentsRoutes);

// Rutas de procesamiento y subida de imágenes con Sharp
router.use("/upload", uploadRoutes);

// Endpoint utilitario para listar páginas
router.get("/pages", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("pages").select("*").order("id", { ascending: true });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    next(err);
  }
});

// Endpoint de healthcheck
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "SocialLaunch API",
  });
});

module.exports = router;
