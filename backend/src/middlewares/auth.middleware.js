const jwt = require("jsonwebtoken");

/**
 * Middleware para validar el JWT almacenado en cookie httpOnly o cabecera Authorization
 */
const verifyAuth = (req, res, next) => {
  try {
    // 1. Intentar obtener el token desde la cookie segura httpOnly
    let token = req.cookies?.token;

    // 2. Fallback: Permitir Bearer Token en headers (útil para pruebas de API)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No autenticado: Se requiere una sesión válida o token JWT",
      });
    }

    const secret = process.env.JWT_SECRET || "default_sociallaunch_secret_key";
    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado. Por favor inicia sesión nuevamente.",
      error: error.message,
    });
  }
};

/**
 * Middleware para validar el rol del usuario (ej: ['admin'])
 * @param {string[]} allowedRoles - Lista de nombres de rol permitidos
 */
const verifyRole = (allowedRoles = ["admin"]) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autenticado: Sesión no encontrada",
      });
    }

    const userRole = req.user.role || (req.user.role_id === 1 ? "admin" : "user");

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acceso restringido: Se requiere uno de los roles [${allowedRoles.join(", ")}]. Tu rol actual es '${userRole}'`,
      });
    }

    next();
  };
};

module.exports = {
  verifyAuth,
  verifyRole,
};
