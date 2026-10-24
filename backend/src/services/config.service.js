const supabase = require("../config/supabase");

// Cache en memoria para tokens extendidos de diseño
let extendedTokens = {
  accent_color: "#10B981",
  bg_surface: "#F8FAFC",
  bg_dark: "#1E293B",
  font_family: "'Plus Jakarta Sans', sans-serif",
  favicon_url: "rocket",
};

class ConfigService {
  /**
   * Obtiene la configuración completa del sitio (tokens :root y brand assets)
   */
  async getConfig() {
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .order("id", { ascending: true })
      .limit(1);

    if (error) {
      console.warn("Aviso al obtener site_config desde Supabase:", error.message);
    }

    const row = data && data.length > 0 ? data[0] : {};

    return {
      id: row.id || 1,
      site_name: row.site_name || "SocialLaunch Campañas",
      logo_url: row.logo_url || null,
      primary_color: row.primary_color || "#2563EB",
      secondary_color: row.secondary_color || "#0F172A",
      accent_color: extendedTokens.accent_color,
      bg_surface: extendedTokens.bg_surface,
      bg_dark: extendedTokens.bg_dark,
      font_family: extendedTokens.font_family,
      favicon_url: extendedTokens.favicon_url,
      updated_at: row.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Actualiza la configuración de colores HEX, logo y tokens de diseño
   */
  async updateConfig(updates) {
    const {
      primary_color,
      secondary_color,
      logo_url,
      site_name,
      accent_color,
      bg_surface,
      bg_dark,
      font_family,
      favicon_url,
    } = updates;

    // Actualizar tokens extendidos en memoria
    if (accent_color) extendedTokens.accent_color = accent_color;
    if (bg_surface) extendedTokens.bg_surface = bg_surface;
    if (bg_dark) extendedTokens.bg_dark = bg_dark;
    if (font_family) extendedTokens.font_family = font_family;
    if (favicon_url) extendedTokens.favicon_url = favicon_url;

    // Payload para columnas persistentes en PostgreSQL
    const dbPayload = {
      updated_at: new Date().toISOString(),
    };

    if (primary_color !== undefined) dbPayload.primary_color = primary_color;
    if (secondary_color !== undefined) dbPayload.secondary_color = secondary_color;
    if (logo_url !== undefined) dbPayload.logo_url = logo_url;
    if (site_name !== undefined) dbPayload.site_name = site_name;

    const { data: existing } = await supabase
      .from("site_config")
      .select("id")
      .limit(1);

    let savedRow;
    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from("site_config")
        .update(dbPayload)
        .eq("id", existing[0].id)
        .select()
        .single();

      if (error) {
        throw new Error("Error al actualizar configuración: " + error.message);
      }
      savedRow = data;
    } else {
      const { data, error } = await supabase
        .from("site_config")
        .insert([{ id: 1, ...dbPayload }])
        .select()
        .single();

      if (error) {
        throw new Error("Error al crear configuración: " + error.message);
      }
      savedRow = data;
    }

    return {
      ...savedRow,
      accent_color: extendedTokens.accent_color,
      bg_surface: extendedTokens.bg_surface,
      bg_dark: extendedTokens.bg_dark,
      font_family: extendedTokens.font_family,
      favicon_url: extendedTokens.favicon_url,
    };
  }
}

module.exports = new ConfigService();
