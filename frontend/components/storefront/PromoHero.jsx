"use client";
import { useState } from "react";

export default function PromoHero({ content = {} }) {
  const badge = content.badge_text || content.badge || "Garantía 100% • Verificado Perú • Despliegue en 48 Horas";
  const headline = content.headline_h1 || content.headline || "Multiplica tus Ventas y Conquista las Redes con";
  const highlightText = content.highlightText || "SocialLaunch Pro";
  const description =
    content.subheadline ||
    content.description ||
    "Infraestructura integral de alto rendimiento: sincroniza catálogo, links-in-bio ultra-optimizados y embudos dirigidos directamente a WhatsApp para capturar leads calificados con cero latencia.";
  const ctaText = content.cta_text || content.ctaText || "Reclamar 50% Dcto. por WhatsApp";
  const ctaCoupon = content.cta_coupon || content.ctaSubtext || "PROMO2025 (-50% DCTO)";
  const whatsappNumber = content.whatsapp_number || "+51991488770";
  const ctaUrl =
    content.cta_url ||
    content.ctaUrl ||
    `https://wa.me/+51991488770?text=${encodeURIComponent(
      `¡Hola! Vengo de la campaña oficial y deseo activar mi cupón ${ctaCoupon}. ¿Podrían brindarme información y asesoría?`
    )}`;
  const demoText = content.demoText || "Ver Demostración en Vivo";
  const demoUrl = content.demoUrl || ctaUrl;

  const metricsCard = content.metrics_card || {
    roas: "+340% Promedio",
    billed_amount: "S/ 48,250.00",
    qualified_clicks: "12.4k",
    cr_whatsapp: "28.6%",
  };

  const [clicked, setClicked] = useState(false);

  const handleCtaClick = () => {
    setClicked(true);
    // Disparar evento de lead hacia el backend de telemetría de forma asíncrona
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      fetch(`${apiUrl}/dashboard/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "Hero CTA Principal",
          campaign: headline.slice(0, 30),
          value: "S/ 389.00",
        }),
      }).catch(() => {});
    } catch (e) {}
  };

  return (
    <section id="hero" className="relative w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 sm:pb-20 overflow-hidden">
      {/* Luces y texturas de fondo diferenciales */}
      <div className="absolute -top-32 -right-20 w-[420px] h-[420px] bg-primary/15 rounded-full blur-[90px] pointer-events-none"></div>
      <div className="absolute top-1/3 -left-20 w-[380px] h-[380px] bg-tertiary/15 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Columna Izquierda: Copywriting de Conversión */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6 text-left">
          {/* Badge de Verificación y Confianza */}
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-sm w-fit">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-xs font-bold text-on-surface tracking-tight">{badge}</span>
          </div>

          {/* Titular H1 de Alto Impacto */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-on-surface leading-[1.12] tracking-tight">
            {headline}{" "}
            <span className="text-primary underline decoration-tertiary decoration-4 underline-offset-6">
              {highlightText}
            </span>
          </h1>

          {/* Subtítulo Descriptivo */}
          <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {description}
          </p>

          {/* CTAs de Conversión Directa */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center gap-3 bg-tertiary hover:opacity-95 text-on-tertiary px-6 py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] group font-headline"
            >
              <span className="material-symbols-outlined text-[24px]">chat</span>
              <div className="flex flex-col text-left">
                <span className="leading-tight font-extrabold text-base sm:text-lg">{ctaText}</span>
                <span className="text-xs opacity-90 font-mono font-medium tracking-wide">
                  Cupón: {ctaCoupon}
                </span>
              </div>
              <span className="material-symbols-outlined text-[20px] ml-auto sm:ml-2 group-hover:translate-x-1.5 transition-transform">
                arrow_forward
              </span>
            </a>

            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-slate-50 text-on-surface text-sm sm:text-base font-bold px-5 py-4 rounded-2xl border border-slate-200/90 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">smart_display</span>
              <span>{demoText}</span>
            </a>
          </div>

          {/* Sellos de Confianza Nacional */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-xs font-semibold text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[18px]">bolt</span>
              <span>LCP &lt; 0.8s en 4G</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span>Envíos Olva & Shalom</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[18px]">lock</span>
              <span>Pagos Seguros SSL</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Cockpit de Rendimiento ROAS */}
        <div className="lg:col-span-5 relative">
          <div className="bg-surface-container-lowest rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-200/80 p-5 sm:p-7 relative overflow-hidden">
            {/* Header de Simulación de Tráfico */}
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs text-on-surface-variant font-mono font-medium ml-1">
                  sociallaunch.bio/live
                </span>
              </div>
              <span className="text-[11px] font-extrabold bg-tertiary/15 text-tertiary px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                Tráfico Activo
              </span>
            </div>

            {/* Tarjeta Dark con ROAS */}
            <div className="bg-secondary rounded-2xl p-5 text-white shadow-inner mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Cockpit de Conversión
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                  {metricsCard.roas || "+340% ROAS Promedio"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Facturación 30D</span>
                  <span className="font-headline text-lg sm:text-xl font-extrabold text-white">
                    {metricsCard.billed_amount || "S/ 48,250.00"}
                  </span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[11px] text-slate-400 block mb-0.5">CR WhatsApp</span>
                  <span className="font-headline text-lg sm:text-xl font-extrabold text-emerald-400">
                    {metricsCard.cr_whatsapp || "28.6%"}
                  </span>
                </div>
              </div>
            </div>

            {/* Prueba de entrega de encomiendas */}
            <div className="bg-surface-container-low p-3.5 rounded-2xl flex items-center justify-between border border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Despachos Olva / Shalom</span>
                  <span className="text-[11px] text-on-surface-variant">+1,450 Marcas en Perú</span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-tertiary bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">
                99.8% Entregados
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
