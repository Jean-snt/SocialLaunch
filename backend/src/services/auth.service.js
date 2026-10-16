const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

class AuthService {
  /**
   * Valida credenciales contra la tabla users de Supabase y genera un JWT
   */
  async login(email, password) {
    if (!email || !password) {
      const error = new Error("El correo electrónico y la contraseña son obligatorios");
      error.statusCode = 400;
      throw error;
    }

    // 1. Buscar usuario en Supabase con su rol asociado
    const { data: users, error: dbError } = await supabase
      .from("users")
      .select("*, roles(id, name, description)")
      .eq("email", email.trim().toLowerCase())
      .limit(1);

    if (dbError) {
      console.error("Error al consultar users:", dbError);
      const err = new Error("Error al consultar la base de datos");
      err.statusCode = 500;
      throw err;
    }

    const user = users && users[0];
    if (!user) {
      const err = new Error("Credenciales inválidas: Usuario no encontrado");
      err.statusCode = 401;
      throw err;
    }

    // 2. Validar contraseña con bcrypt (con fallback seguro en caso de registros previos)
    let isPasswordValid = false;
    if (user.password_hash) {
      // Intentar comparar con hash bcrypt
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      // Fallback: si por alguna razón antigua la contraseña estuviera en texto plano, validar y migrar a hash
      if (!isPasswordValid && password === user.password_hash) {
        isPasswordValid = true;
        const newHash = await bcrypt.hash(password, 10);
        await supabase.from("users").update({ password_hash: newHash }).eq("id", user.id);
      }
    }

    if (!isPasswordValid) {
      const err = new Error("Credenciales inválidas: Contraseña incorrecta");
      err.statusCode = 401;
      throw err;
    }

    // 3. Obtener nombre del rol
    const roleName = user.roles?.name || (user.role_id === 1 ? "admin" : "editor");

    // 4. Generar JWT firmado
    const secret = process.env.JWT_SECRET || "default_sociallaunch_secret_key";
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
      role_id: user.role_id,
    };

    const token = jwt.sign(payload, secret, { expiresIn });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
        role_id: user.role_id,
      },
    };
  }

  /**
   * Obtiene la información del usuario por ID
   */
  async getUserById(id) {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role_id, created_at, roles(id, name)")
      .eq("id", id)
      .single();

    if (error || !user) {
      const err = new Error("Usuario no encontrado");
      err.statusCode = 404;
      throw err;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roles?.name || (user.role_id === 1 ? "admin" : "editor"),
      role_id: user.role_id,
      created_at: user.created_at,
    };
  }

  /**
   * Crea o registra un nuevo usuario con contraseña hasheada
   */
  async createUser({ name, email, password, role_id = 1 }) {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email: email.trim().toLowerCase(),
          password_hash,
          role_id,
        },
      ])
      .select("id, name, email, role_id, created_at")
      .single();

    if (error) {
      const err = new Error(error.message);
      err.statusCode = 400;
      throw err;
    }

    return data;
  }
}

module.exports = new AuthService();
