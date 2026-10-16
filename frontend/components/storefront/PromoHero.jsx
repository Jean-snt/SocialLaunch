"use client";

export default function PromoHero({ content = {} }) {
  const badge = content.badge || "Garantía 100% · Verificado Perú";
  const subBadge = content.subBadge || "Despliegue en 48 Horas";
  const headline = content.headline || "Multiplica tus Ventas y Conquista las Redes con";
  const highlightText = content.highlightText || "SocialLaunch Pro";
  const description =
    content.description ||
    "Infraestructura integral de alto rendimiento: sincroniza catálogo, links-in-bio ultra-optimizados y embudos dirigidos directamente a WhatsApp para capturar leads calificados con cero latencia.";
  const ctaText = content.ctaText || "Activar Oferta Cyber 2025";
  const ctaSubtext = content.ctaSubtext || "Cupón: PROMO2025 (-50% DCTO)";
  const ctaUrl =
    content.ctaUrl ||
    "https://wa.me/51999999999?text=Hola%20SocialLaunch%2C%20deseo%20activar%20la%20promocion%20Cyber2025";
  const demoText = content.demoText || "Ver Demostración en Vivo";
  const demoUrl = content.demoUrl || "https://wa.me/51999999999";

  return (
    <section id="hero" className="relative w-full px-4 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-20 overflow-hidden bg-gradient-to-b from-surface-container-low/50 via-surface to-surface">
      {/* Luces difusas decorativas */}
      <div className="absolute -top-24 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-4 w-60 sm:w-80 h-60 sm:h-80 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
        {/* Columna Izquierda: Copy & CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
          <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-sm w-fit border border-slate-100">
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified_user</span>
            <span className="text-xs font-bold text-on-surface">{badge}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
            <span className="text-xs font-semibold text-primary">{subBadge}</span>
          </div>

          <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface leading-[1.15] tracking-tight">
            {headline}{" "}
            <span className="text-primary underline decoration-tertiary decoration-4 underline-offset-4">
              {highlightText}
            </span>
          </h1>

          <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {description}
          </p>

          {/* Hub de Acciones Directas */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-tertiary hover:opacity-95 text-on-tertiary px-6 py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
              <div className="flex flex-col text-left">
                <span className="leading-tight font-bold text-base sm:text-lg">{ctaText}</span>
                <span className="text-xs opacity-90 font-mono font-medium">{ctaSubtext}</span>
              </div>
              <span className="material-symbols-outlined text-[20px] ml-auto sm:ml-2 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>

            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-slate-50 text-on-surface text-sm sm:text-base font-semibold px-5 py-4 rounded-xl shadow-sm border border-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-tertiary text-[20px]">play_circle</span>
              <span>{demoText}</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-semibold text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[18px]">speed</span>
              <span>Carga Ultrarrápida (0.3s)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
              <span>Integrado con Olva & Shalom</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[18px]">credit_card</span>
              <span>Yape, Plin y Tarjetas</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Cockpit de Rendimiento Visual */}
        <div className="lg:col-span-5 relative">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden p-4 sm:p-6 border border-slate-100">
            {/* Mockup Header */}
            <div className="flex items-center justify-between pb-3 mb-4 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs text-on-surface-variant font-mono ml-2">
                  app.sociallaunch.pe/live
                </span>
              </div>
              <span className="text-[11px] font-bold bg-tertiary text-on-tertiary px-2 py-0.5 rounded-full">
                ⚡ En Vivo
              </span>
            </div>

            {/* KPI Cockpit */}
            <div className="bg-secondary rounded-xl p-4 text-white shadow-inner mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Rendimiento en Vivo
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 font-bold">
                  +340% ROAS Promedio
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-[11px] text-slate-400 block">Clics Calificados</span>
                  <span className="text-lg sm:text-xl font-bold text-white flex items-center gap-1">
                    48.2k <span className="text-xs text-emerald-400">▲ 24%</span>
                  </span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-[11px] text-slate-400 block">Conversión WhatsApp</span>
                  <span className="text-lg sm:text-xl font-bold text-emerald-400 flex items-center gap-1">
                    28.6% <span className="text-xs text-white">⚡</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Testimonial Banner Strip */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary border-2 border-white">
                  AS
                </div>
                <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center font-bold text-xs text-tertiary border-2 border-white">
                  CP
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-xs text-amber-700 border-2 border-white">
                  JS
                </div>
              </div>
              <div className="text-xs">
                <span className="font-bold text-on-surface block">+4,820 emprendedores</span>
                <span className="text-on-surface-variant">activaron su campaña este mes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
