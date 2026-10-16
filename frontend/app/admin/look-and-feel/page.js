"use client";
import { useState, useEffect } from "react";

export default function LookAndFeelGeneratorPage() {
  const [siteName, setSiteName] = useState("SocialLaunch Campañas");
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [secondaryColor, setSecondaryColor] = useState("#0F172A");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  // Cargar configuración actual desde la API
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`${apiUrl}/config`, {
          cache: "no-store",
          credentials: "include",
        });
        const json = await res.json();
        if (json.success && json.data) {
          setSiteName(json.data.site_name || "SocialLaunch Campañas");
          setPrimaryColor(json.data.primary_color || "#2563EB");
          setSecondaryColor(json.data.secondary_color || "#0F172A");
          setLogoUrl(json.data.logo_url || "");
        }
      } catch (err) {
        console.error("Error al cargar configuración:", err);
      }
    }
    fetchConfig();
  }, [apiUrl]);

  // Aplicar variables CSS en el DOM al instante (Previsualización en tiempo real)
  const applyLiveCssVariables = (pColor, sColor) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--primary-color", pColor);
      document.documentElement.style.setProperty("--secondary-color", sColor);
    }
  };

  const handlePrimaryChange = (color) => {
    setPrimaryColor(color);
    applyLiveCssVariables(color, secondaryColor);
  };

  const handleSecondaryChange = (color) => {
    setSecondaryColor(color);
    applyLiveCssVariables(primaryColor, color);
  };

  // Paletas 1-Clic
  const handleApplyPreset = (pColor, sColor) => {
    setPrimaryColor(pColor);
    setSecondaryColor(sColor);
    applyLiveCssVariables(pColor, sColor);
    flashMsg("Paleta aplicada en vista previa");
  };

  // Subir logo con Sharp y Multer (conversión obligatoria a WebP)
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setUploadedInfo(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Error al subir y procesar imagen con Sharp");
      }

      const fullUrl = json.data.url.startsWith("http")
        ? json.data.url
        : `${backendUrl}${json.data.url}`;

      setLogoUrl(fullUrl);
      setUploadedInfo(json.data);
      flashMsg("Logo procesado a WebP exitosamente con Sharp ✨");
    } catch (err) {
      alert("Error de subida: " + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Guardar configuración en la base de datos (PUT /api/config)
  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          site_name: siteName,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          logo_url: logoUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Error al guardar en la base de datos");
      }

      applyLiveCssVariables(primaryColor, secondaryColor);
      flashMsg("¡Configuración global guardada en Supabase y persistida! 🚀");
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const flashMsg = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto w-full flex flex-col gap-6">
      {/* Header del Módulo */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[18px]">palette</span>
            </span>
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              Design Engine • Runtime CSS v3.4
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Personalización Visual & Brand Identity
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Controla el tema mediante CSS Variables globales en tiempo real con inyección
            instantánea al runtime de Next.js y procesamiento WebP con Sharp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {statusMsg && (
            <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-3 py-1.5 rounded-xl border border-tertiary/20">
              ✓ {statusMsg}
            </span>
          )}

          <button
            type="button"
            onClick={handleSaveConfig}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:opacity-95 text-on-primary text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
            <span>{saving ? "Guardando..." : "Guardar Tema Global"}</span>
          </button>
        </div>
      </section>

      {/* Grid en 2 Columnas: Controles (Izquierda) + Simulador en Vivo (Derecha) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Controles y Paletas (6 Cols) */}
        <div className="xl:col-span-6 flex flex-col gap-6">
          {/* Paletas en 1-Clic */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  auto_fix_high
                </span>
                <h2 className="font-headline text-base font-bold text-on-surface">
                  Paletas en 1-Clic
                </h2>
              </div>
              <span className="text-[10px] font-bold bg-tertiary/15 text-tertiary px-2 py-0.5 rounded-full">
                Recomendadas
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: "cyber",
                  name: "Cyber Blue",
                  sub: "Default SaaS",
                  primary: "#2563EB",
                  secondary: "#0F172A",
                  dots: ["#2563EB", "#0F172A", "#10B981"],
                },
                {
                  id: "emerald",
                  name: "Emerald Sale",
                  sub: "WhatsApp Focus",
                  primary: "#006242",
                  secondary: "#131b2e",
                  dots: ["#006242", "#131b2e", "#25D366"],
                },
                {
                  id: "darkneon",
                  name: "Dark Neon VIP",
                  sub: "Luxury Drops",
                  primary: "#7C3AED",
                  secondary: "#090D16",
                  dots: ["#7C3AED", "#090D16", "#F43F5E"],
                },
                {
                  id: "sunset",
                  name: "Sunset Punch",
                  sub: "Urgencia Flash",
                  primary: "#EA580C",
                  secondary: "#18181B",
                  dots: ["#EA580C", "#18181B", "#FACC15"],
                },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p.primary, p.secondary)}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-all border border-slate-100 hover:border-primary/40 group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    {p.dots.map((c, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full shadow-xs"
                        style={{ backgroundColor: c }}
                      ></span>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-on-surface">{p.name}</div>
                  <div className="text-[10px] text-on-surface-variant">{p.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Editor Detallado de Variables CSS */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  colorize
                </span>
                <h2 className="font-headline text-base font-bold text-on-surface">
                  Editor de Variables :root
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">site_config sync</span>
            </div>

            {/* Nombre del Sitio */}
            <div className="p-3.5 rounded-xl bg-slate-50 flex flex-col gap-1.5 border border-slate-100">
              <label className="text-xs font-bold text-on-surface">Nombre de la Plataforma</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-white text-xs font-semibold p-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="SocialLaunch Campañas"
              />
            </div>

            {/* Color Primario */}
            <div className="p-3.5 rounded-xl bg-slate-50 flex flex-col gap-2 border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface">Color Primario (--primary-color)</span>
                <span className="text-slate-400 text-[11px]">Brand CTA & Títulos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-slate-200 flex-shrink-0">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => handlePrimaryChange(e.target.value)}
                    className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer opacity-0"
                  />
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                </div>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => handlePrimaryChange(e.target.value)}
                  className="w-32 bg-white font-mono text-xs text-on-surface px-3 py-2 rounded-lg border border-slate-200 uppercase font-bold"
                />
                <span className="text-xs text-slate-400">
                  Afecta botones y acentos en toda la web
                </span>
              </div>
            </div>

            {/* Color Secundario */}
            <div className="p-3.5 rounded-xl bg-slate-50 flex flex-col gap-2 border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface">
                  Color Secundario (--secondary-color)
                </span>
                <span className="text-slate-400 text-[11px]">Cockpit y Superficies</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-slate-200 flex-shrink-0">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => handleSecondaryChange(e.target.value)}
                    className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer opacity-0"
                  />
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                </div>
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => handleSecondaryChange(e.target.value)}
                  className="w-32 bg-white font-mono text-xs text-on-surface px-3 py-2 rounded-lg border border-slate-200 uppercase font-bold"
                />
                <span className="text-xs text-slate-400">
                  Afecta tarjetas analíticas y cajas oscuras
                </span>
              </div>
            </div>

            {/* Subida y Procesamiento de Logo con Sharp (WebP) */}
            <div className="p-3.5 rounded-xl bg-slate-50 flex flex-col gap-2 border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">
                    image
                  </span>
                  Logo del Sitio (Procesado a WebP con Sharp)
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Optimización WebP
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-on-surface cursor-pointer shadow-xs transition-colors">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    upload_file
                  </span>
                  <span>{uploadingLogo ? "Procesando con Sharp..." : "Subir Nuevo Logo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>

                {logoUrl && (
                  <div className="flex items-center gap-3">
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="h-10 w-auto object-contain bg-white p-1 rounded-lg border border-slate-200"
                    />
                    <div className="text-[11px] text-slate-500">
                      <span className="font-bold text-emerald-600 block">Formato: .webp</span>
                      {uploadedInfo && (
                        <span>
                          {uploadedInfo.width}x{uploadedInfo.height} px ({Math.round(uploadedInfo.size / 1024)} KB)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Previsualización Dinámica del Look & Feel (6 Cols) */}
        <div className="xl:col-span-6 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-base text-on-surface">
                Vista Previa Dinámica del Tema
              </span>
              <span className="text-xs text-slate-400">
                Cambia en tiempo real con las CSS variables
              </span>
            </div>

            {/* Tarjeta de Demostración con los colores actuales */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-md">
              {/* Top Banner de Demostración */}
              <div
                className="p-3 text-white text-xs font-bold flex items-center justify-between"
                style={{ backgroundColor: primaryColor }}
              >
                <span>🔥 OFERTA FLASH SOCIAL LAUNCH</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Activo</span>
              </div>

              {/* Contenido de Demostración */}
              <div className="p-6 bg-white flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      SL
                    </div>
                  )}
                  <div>
                    <h3 className="font-headline text-lg font-bold text-slate-900 leading-tight">
                      {siteName}
                    </h3>
                    <span className="text-xs text-slate-400">Identidad de Marca Sincronizada</span>
                  </div>
                </div>

                <div
                  className="rounded-xl p-4 text-white shadow-inner"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block mb-1">
                    Superficie Secundaria
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold">+340% Conversión</span>
                    <span className="text-xs font-bold text-emerald-400">ROAS Validado</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex-1 py-3 px-4 rounded-xl text-white text-xs font-bold shadow-md text-center transition-all"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Botón Primario (--primary-color)
                  </button>

                  <button
                    type="button"
                    className="flex-1 py-3 px-4 rounded-xl text-white text-xs font-bold shadow-md text-center bg-tertiary"
                  >
                    Botón WhatsApp (Conversión)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
