const path = require("path");
// Cargar .env de forma resiliente
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const apiRoutes = require("./src/routes");
const errorHandler = require("./src/middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Cabeceras de Seguridad Enterprise con Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Permitir inyección dinámica de estilos y preview
  })
);

// 2. Limitador de Tasa (DDoS & Brute Force Prevention)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // 500 peticiones por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Demasiadas peticiones desde esta IP. Intenta nuevamente en 15 minutos.",
  },
});
app.use("/api", generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 intentos de login cada 15 min
  message: {
    success: false,
    message: "Demasiados intentos de acceso. Espera 15 minutos para volver a intentar.",
  },
});
app.use("/api/auth/login", authLimiter);

// 3. Configuración dinámica de CORS para Vercel, Render y Desarrollo Local
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (SSR, curl, postman)
      if (!origin) return callback(null, true);

      // Permitir dominios explícitos o cualquier subdominio de vista previa de Vercel (*.vercel.app)
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production";

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback permisivo para no bloquear campañas
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// 4. Middlewares de parsing con límites de carga
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// 5. Servir la carpeta de imágenes procesadas WebP
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 6. Ruta raíz informativa
app.get("/", (req, res) => {
  res.json({
    nombre: "SocialLaunch Enterprise CMS API",
    estado: "Activo",
    version: "3.8.4 Enterprise",
    engine: "PostgreSQL JSONB + Node.js Sharp + Next.js Dynamic Tokens",
    docs: "/api/health",
  });
});

// 7. Montar rutas bajo el prefijo /api
app.use("/api", apiRoutes);

// 8. Middleware centralizado de errores
app.use(errorHandler);

// 9. Iniciar servidor
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor SocialLaunch corriendo en http://localhost:${PORT}`);
    console.log(`📡 Rutas API disponibles en http://localhost:${PORT}/api`);
  });
}

module.exports = app;
