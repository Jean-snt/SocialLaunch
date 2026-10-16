const authService = require("../services/auth.service");

class AuthController {
  /**
   * Endpoint POST /api/auth/login
   * Valida credenciales contra la tabla users de Supabase, genera un JWT
   * y lo firma dentro de una cookie segura httpOnly.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const { token, user } = await authService.login(email, password);

      // Configuración de cookie segura
      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
        path: "/",
      };

      // Firmar y guardar en la cookie segura
      res.cookie("token", token, cookieOptions);

      return res.status(200).json({
        success: true,
        message: "¡Autenticación exitosa!",
        user,
        token, // También se devuelve el token para flexibilidad en clientes headless
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint POST /api/auth/logout
   * Limpia la cookie de sesión
   */
  async logout(req, res) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  }

  /**
   * Endpoint GET /api/auth/me
   * Retorna los datos del usuario autenticado actual
   */
  async me(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
