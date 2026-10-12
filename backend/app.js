const express = require("express");
const supabase = require("./supabaseClient");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "¡Hola! El servidor está funcionando correctamente" });
});

app.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase.from("pages").select("*");

    if (error) {
      return res.status(400).json({
        conexion: "Falló",
        error: error.message,
      });
    }
    res.json({
      conexion: "¡Exitoso",
      datosDePrueba: data,
    });
  } catch (err) {
    res.status(500).json({
      conexion: "Error de servidor",
      error: err.message,
    });
  }
});

app.post("/create-user", async (req, res) => {
  try {
    const { name, email, password_hash, role_id } = req.body;

    if (!name || !email || !password_hash || !role_id) {
      return res.status(400).json({
        error:
          "Faltan campos obligatorios: name, email, password_hash y role_id",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: name,
          email: email,
          password_hash: password_hash,
          role_id: role_id,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({
        mensaje: "Hubo un error al insertar el dato",
        error: error.message,
      });
    }

    res.status(201).json({
      mensaje: "¡Dato insertado con éxito!",
      usuarioCreado: data,
    });
  } catch (err) {
    res.status(500).json({
      mensaje: "Error interno del servidor",
      error: err.message,
    });
  }
});

app.put("/edit-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password_hash, role_id } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update([
        {
          name: name,
          email: email,
          password_hash: password_hash,
          role_id: role_id,
        },
      ])
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({
        mensaje: "Hubo un error al actualizar el dato",
        error: error.message,
      });
    }

    res.status(201).json({
      mensaje: "¡Dato actualizado con éxito!",
      usuarioCreado: data,
    });
  } catch (err) {
    res.status(500).json({
      mensaje: "Error interno del servidor",
      error: err.message,
    });
  }
});

app.delete("/delete-user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({
        mensaje: "Hubo un error al eliminar el registro",
        error: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontró ningún usuario con ese ID",
      });
    }

    res.json({
      mensaje: "¡Registro eliminado con éxito!",
      usuarioEliminado: data,
    });
  } catch (err) {
    res.status(500).json({
      mensaje: "Error interno del servidor",
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
