const { createClient } = require("@supabase/supabase-js");
const WebSocket = require("ws");

const SUPABASE_URL = "https://obpjvomzlwrhnuckgfmr.supabase.co/";
const SUPABASE_KEY = "sb_publishable_sc1RMhDDGYazS91ceqidJA_v2IzgXWp";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  realtime: {
    transport: WebSocket,
  },
});

module.exports = supabase;
