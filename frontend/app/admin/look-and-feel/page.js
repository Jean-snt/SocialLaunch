"use client";
import { useState, useEffect } from "react";
import { authFetch } from "../../../lib/api";

const FAVICON_SVGS = {
  rocket: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🚀</text></svg>`,
  flash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>`,
  store: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🛍️</text></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⭐</text></svg>`,
};

function updateTabFavicon(glyph) {
  if (typeof document === "undefined") return;
  const svg = FAVICON_SVGS[glyph] || FAVICON_SVGS.rocket;
  const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "shortcut icon";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  link.type = "image/svg+xml";
  link.href = dataUri;
}

export default function LookAndFeelGeneratorPage() {
  const [siteName, setSiteName] = useState("SocialLaunch Campañas");
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [secondaryColor, setSecondaryColor] = useState("#0F172A");
  const [accentColor, setAccentColor] = useState("#10B981");
  const [bgSurface, setBgSurface] = useState("#F8FAFC");
  const [bgDark, setBgDark] = useState("#1E293B");
  const [fontFamily, setFontFamily] = useState("'Plus Jakarta Sans', sans-serif");
  const [faviconGlyph, setFaviconGlyph] = useState("rocket");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  // Cargar configuración actual desde la API
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await authFetch("/config");
        if (res.ok && res.data?.data) {
          const cfg = res.data.data;
          setSiteName(cfg.site_name || "SocialLaunch Campañas");
          setPrimaryColor(cfg.primary_color || "#2563EB");
          setSecondaryColor(cfg.secondary_color || "#0F172A");
          if (cfg.accent_color) setAccentColor(cfg.accent_color);
          if (cfg.bg_surface) setBgSurface(cfg.bg_surface);
          if (cfg.bg_dark) setBgDark(cfg.bg_dark);
          setLogoUrl(cfg.logo_url || "");
          if (cfg.favicon_url) {
            setFaviconGlyph(cfg.favicon_url);
            updateTabFavicon(cfg.favicon_url);
          }
        }
      } catch (err) {
        console.warn("Aviso al cargar configuración:", err);
      }
    }
    fetchConfig();
  }, []);

  // HU-LNF-002: Inyección de Variables CSS al DOM en Caliente
  const applyLiveCssVariables = (pColor, sColor, aColor, surface, dark) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--primary-color", pColor || primaryColor);
      document.documentElement.style.setProperty("--secondary-color", sColor || secondaryColor);
      document.documentElement.style.setProperty("--accent-color", aColor || accentColor);
      document.documentElement.style.setProperty("--bg-surface", surface || bgSurface);
      document.documentElement.style.setProperty("--bg-dark", dark || bgDark);
    }
  };

  const flashMsg = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  // HU-LNF-001: Inyección de Paletas Predefinidas en 1-Clic
  const presets = [
    {
      id: "cyber-blue",
      name: "Cyber Blue",
      niche: "Enfoque Tech & Conversión General",
      primary: "#2563EB",
      secondary: "#0F172A",
      accent: "#10B981",
      surface: "#F8FAFC",
      dark: "#1E293B",
    },
    {
      id: "emerald-sale",
      name: "Emerald Sale",
      niche: "Enfoque WhatsApp Leads Directos",
      primary: "#059669",
      secondary: "#064E3B",
      accent: "#10B981",
      surface: "#F0FDF4",
      dark: "#022C22",
    },
    {
      id: "dark-neon",
      name: "Dark Neon VIP",
      niche: "Enfoque High-Ticket & Infoproductos",
      primary: "#8B5CF6",
      secondary: "#0B0F19",
      accent: "#06B6D4",
      surface: "#F5F3FF",
      dark: "#0F172A",
    },
    {
      id: "sunset-punch",
      name: "Sunset Punch",
      niche: "Enfoque Flash Sales & Urgencia Total",
      primary: "#F97316",
      secondary: "#18181B",
      accent: "#EF4444",
      surface: "#FFF7ED",
      dark: "#18181B",
    },
  ];

  const handleApplyPreset = (preset) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
    setBgSurface(preset.surface);
    setBgDark(preset.dark);
    applyLiveCssVariables(preset.primary, preset.secondary, preset.accent, preset.surface, preset.dark);
    flashMsg(`Paleta '${preset.name}' inyectada en caliente 🎨`);
  };

  // HU-LNF-003: Subir logo con Sharp mediante authFetch
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("El archivo excede el límite de 2MB");
      return;
    }

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await authFetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok || !res.data?.success) throw new Error(res.data?.message || "Error al subir imagen");

      const fullUrl = res.data.data.url.startsWith("http")
        ? res.data.data.url
        : `${backendUrl}${res.data.data.url}`;

      setLogoUrl(fullUrl);
      setUploadedInfo(res.data.data);
      flashMsg("Logo optimizado a WebP exitosamente con Sharp ✨");
    } catch (err) {
      alert("Error al procesar logo: " + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  // HU-LNF-003: Cambiar Favicon dinámicamente
  const handleSelectFavicon = (glyphId) => {
    setFaviconGlyph(glyphId);
    updateTabFavicon(glyphId);
    flashMsg(`Favicon actualizado en la pestaña del navegador (${glyphId})`);
  };

  // Guardar configuración en la base de datos
  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const res = await authFetch("/config", {
        method: "PUT",
        body: JSON.stringify({
          site_name: siteName,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          accent_color: accentColor,
          bg_surface: bgSurface,
          bg_dark: bgDark,
          font_family: fontFamily,
          logo_url: logoUrl,
          favicon_url: faviconGlyph,
        }),
      });

      if (!res.ok || !res.data?.success) throw new Error(res.data?.message || "Error al guardar");

      applyLiveCssVariables(primaryColor, secondaryColor, accentColor, bgSurface, bgDark);
      updateTabFavicon(faviconGlyph);
      flashMsg("¡Tokens de diseño guardados y persistidos con éxito! 🚀");
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // HU-LNF-004: Código CSS Generado para exportar
  const cssTokenCode = `:root {
  /* SocialLaunch High-Velocity Campaign Studio Tokens */
  --primary-color: ${primaryColor};     /* Botones principales y badges */
  --secondary-color: ${secondaryColor};   /* Tipografías base y fondos dark */
  --accent-color: ${accentColor};      /* CTAs de WhatsApp y conversión */
  --bg-surface: ${bgSurface};        /* Fondo del canvas de vitrina */
  --bg-dark: ${bgDark};           /* Superficies oscuras del dashboard */
  --font-family: ${fontFamily};
}`;

  const handleCopyCss = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(cssTokenCode);
      setCopiedCode(true);
      flashMsg("Tokens :root copiados al portapapeles 📋");
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto w-full flex flex-col gap-6">
      {/* Toast Notificación */}
      {statusMsg && (
        <div className="fixed top-5 right-5 z-50 bg-secondary text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Header del Módulo */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
              Design System & Token Engine
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-on-surface-variant font-medium">
              Payload CSS: <strong className="text-tertiary">~280 Bytes (0 KB Runtime Overhead)</strong>
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
            Look & Feel Generator (Tokens :root)
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSaveConfig}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-on-primary font-headline font-extrabold text-sm shadow-md hover:opacity-95 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">
            {saving ? "hourglass_empty" : "save"}
          </span>
          <span>{saving ? "Guardando..." : "Guardar Identidad 🚀"}</span>
        </button>
      </section>

      {/* HU-LNF-001: Paletas Predefinidas en 1-Clic */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
        <h2 className="font-headline text-lg font-bold text-on-surface mb-1">
          Paletas de Alta Conversión en 1-Clic
        </h2>
        <p className="text-xs text-on-surface-variant mb-4">
          Selecciona un esquema probado según el nicho comercial de tu campaña publicitaria
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presets.map((p) => (
            <div
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-primary/60 cursor-pointer bg-surface-container-low/50 hover:bg-slate-50 transition-all hover:scale-[1.01] flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-headline font-bold text-sm text-on-surface group-hover:text-primary">
                    {p.name}
                  </span>
                  <div className="flex -space-x-1.5">
                    <span
                      className="w-5 h-5 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: p.primary }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: p.secondary }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: p.accent }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">{p.niche}</p>
              </div>

              <span className="text-[11px] font-bold text-primary mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Aplicar Paleta →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Grid: Editor Granular + Brand Assets & Live Mirror */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: HU-LNF-002 Editor Granular de Variables CSS */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
            <h3 className="font-headline text-base font-extrabold text-on-surface mb-1">
              Editor Granular de Variables CSS (:root)
            </h3>
            <p className="text-xs text-on-surface-variant mb-5">
              Personaliza los códigos hexadecimales directos con sincronización en el DOM
            </p>

            <div className="space-y-4">
              {/* 1. Primary Color */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      applyLiveCssVariables(e.target.value, secondaryColor, accentColor, bgSurface, bgDark);
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <div>
                    <span className="text-xs font-headline font-bold text-on-surface block">
                      --primary-color
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Botones principales, badges y enlaces clave
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => {
                    setPrimaryColor(e.target.value);
                    if (/^#([A-Fa-f0-9]{6})$/.test(e.target.value)) {
                      applyLiveCssVariables(e.target.value, secondaryColor, accentColor, bgSurface, bgDark);
                    }
                  }}
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-center focus:outline-primary"
                />
              </div>

              {/* 2. Secondary Color */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => {
                      setSecondaryColor(e.target.value);
                      applyLiveCssVariables(primaryColor, e.target.value, accentColor, bgSurface, bgDark);
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <div>
                    <span className="text-xs font-headline font-bold text-on-surface block">
                      --secondary-color
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Tipografía base, encabezados y superficies oscuras
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => {
                    setSecondaryColor(e.target.value);
                    if (/^#([A-Fa-f0-9]{6})$/.test(e.target.value)) {
                      applyLiveCssVariables(primaryColor, e.target.value, accentColor, bgSurface, bgDark);
                    }
                  }}
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-center focus:outline-primary"
                />
              </div>

              {/* 3. Accent Color (WhatsApp) */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => {
                      setAccentColor(e.target.value);
                      applyLiveCssVariables(primaryColor, secondaryColor, e.target.value, bgSurface, bgDark);
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <div>
                    <span className="text-xs font-headline font-bold text-on-surface block">
                      --accent-color (WhatsApp Gatillo)
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Gatillo comercial esmeralda (+28% CTR)
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => {
                    setAccentColor(e.target.value);
                    if (/^#([A-Fa-f0-9]{6})$/.test(e.target.value)) {
                      applyLiveCssVariables(primaryColor, secondaryColor, e.target.value, bgSurface, bgDark);
                    }
                  }}
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-center focus:outline-primary text-tertiary"
                />
              </div>

              {/* 4. Canvas Surface */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgSurface}
                    onChange={(e) => {
                      setBgSurface(e.target.value);
                      applyLiveCssVariables(primaryColor, secondaryColor, accentColor, e.target.value, bgDark);
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <div>
                    <span className="text-xs font-headline font-bold text-on-surface block">
                      --bg-surface
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Fondo general del canvas de la vitrina
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  value={bgSurface}
                  onChange={(e) => {
                    setBgSurface(e.target.value);
                    if (/^#([A-Fa-f0-9]{6})$/.test(e.target.value)) {
                      applyLiveCssVariables(primaryColor, secondaryColor, accentColor, e.target.value, bgDark);
                    }
                  }}
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-center focus:outline-primary"
                />
              </div>
            </div>
          </div>

          {/* HU-LNF-003: Brand Assets (Logo y Favicon) */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
            <h3 className="font-headline text-base font-extrabold text-on-surface mb-1">
              Gestor de Brand Assets (Logo & Favicon)
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Subida con pipeline de compresión automática Sharp WebP (máx. 2MB)
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">
                  Nombre de Marca
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-primary"
                />
              </div>

              {/* Upload Drag & Drop */}
              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">
                  Logotipo Corporativo (SVG / PNG / WebP)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-primary/60 rounded-2xl p-4 sm:p-6 text-center cursor-pointer relative bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {uploadingLogo
                        ? "Procesando con Sharp..."
                        : "Arrastra tu logo aquí o haz clic para subir"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Compresión WebP automática al 80% • Cero latencia
                    </span>
                  </div>
                </div>

                {logoUrl && (
                  <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
                      <span className="text-xs font-bold text-emerald-800">
                        CDN Activo • WebP Optimizado
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                      check_circle
                    </span>
                  </div>
                )}
              </div>

              {/* Selector de Favicon con renderizado inmediato */}
              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1.5">
                  Icono Favicon Predefinido
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    { id: "rocket", icon: "rocket_launch", label: "Cohete" },
                    { id: "flash", icon: "bolt", label: "Rayo" },
                    { id: "store", icon: "shopping_bag", label: "Bolsa" },
                    { id: "star", icon: "star", label: "Estrella" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleSelectFavicon(g.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                        faviconGlyph === g.id
                          ? "bg-primary text-on-primary border-primary shadow-xs"
                          : "bg-surface-container-low text-on-surface border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{g.icon}</span>
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: HU-LNF-004 Inspector de Componentes & CSS Token Exporter */}
        <div className="lg:col-span-6 flex flex-col gap-6 sticky top-6">
          {/* Inspector de Componentes Interactivos */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
            <h3 className="font-headline text-base font-extrabold text-on-surface mb-1">
              Live CSS Mirror & Inspector de Componentes
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Previsualización instantánea de los tokens en los componentes clave
            </p>

            <div className="space-y-4 bg-surface p-5 rounded-2xl border border-slate-200/70">
              {/* Botón Primario */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Botón Primario:</span>
                <button
                  type="button"
                  style={{ backgroundColor: primaryColor }}
                  className="px-4 py-2 rounded-xl text-white font-headline font-bold text-xs shadow-sm hover:opacity-95"
                >
                  Acción Principal
                </button>
              </div>

              {/* Botón WhatsApp Express */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Botón WhatsApp Express:</span>
                <button
                  type="button"
                  style={{ backgroundColor: accentColor }}
                  className="px-4 py-2 rounded-xl text-white font-headline font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp 50% DCTO</span>
                </button>
              </div>

              {/* Botón Secundario */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Botón Secundario Dark:</span>
                <button
                  type="button"
                  style={{ backgroundColor: secondaryColor }}
                  className="px-4 py-2 rounded-xl text-white font-headline font-bold text-xs shadow-sm"
                >
                  Ver Catálogo
                </button>
              </div>

              {/* Badge de Urgencia */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Badge de Urgencia:</span>
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-extrabold text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  Solo quedan 6 cupos al 50%
                </span>
              </div>
            </div>
          </div>

          {/* HU-LNF-004: Exportador de CSS Tokens :root */}
          <div className="bg-secondary rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  CSS Inyectable :root
                </span>
                <h4 className="font-headline text-sm font-bold text-white">
                  Tokens Exportables para Next.js / Tailwind
                </h4>
              </div>
              <button
                type="button"
                onClick={handleCopyCss}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedCode ? "done" : "content_copy"}
                </span>
                <span>{copiedCode ? "¡Copiado!" : "Copiar :root"}</span>
              </button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-2xl text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800">
              <code>{cssTokenCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
