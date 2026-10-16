require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ ERROR: Faltan las variables de entorno SUPABASE_URL o SUPABASE_KEY en el archivo .env");
}

const supabase = createClient(SUPABASE_URL || "", SUPABASE_KEY || "", {
  auth: { persistSession: false },
});

module.exports = supabase;
