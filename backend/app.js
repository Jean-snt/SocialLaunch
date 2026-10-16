require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const apiRoutes = require("./src/routes");
const errorHandler = require("./src/middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para permitir cookies httpOnly entre Frontend y Backend
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3001",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman o curl) o que estén en la lista
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // En desarrollo permitir orígenes
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Middlewares estándar de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir la carpeta de imágenes procesadas WebP de forma estática
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ruta raíz informativa
app.get("/", (req, res) => {
  res.json({
    nombre: "SocialLaunch CMS API",
    estado: "Activo",
    version: "2.4.0",
    docs: "/api/health",
  });
});

// Montar todas las rutas de la API bajo el prefijo /api
app.use("/api", apiRoutes);

// Middleware centralizado de errores
app.use(errorHandler);

// Iniciar servidor
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor SocialLaunch corriendo en http://localhost:${PORT}`);
    console.log(`📡 Rutas API disponibles en http://localhost:${PORT}/api`);
  });
}

module.exports = app;
