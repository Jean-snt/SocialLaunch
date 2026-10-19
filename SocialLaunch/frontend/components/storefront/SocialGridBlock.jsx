"use client";

export default function SocialGridBlock({ content = {} }) {
  const sectionTitle =
    content.section_title || content.title || "Planes de Escalamiento Inmediato";
  const currency = content.currency || "PEN";
  const currencySymbol = currency === "PEN" ? "S/" : "$";

  // Planes comerciales definidos según la especificación HU-VIT-003 y JSONB estándar
  const plans = content.plans || [
    {
      id: "plan_starter",
      name: "Pack Viral Starter",
      price: 149,
      original_price: 299,
      discount: "-50%",
      is_featured: false,
      badge: "INICIO RÁPIDO",
      features: [
        "Bio Link Pro con hasta 15 productos destacados",
        "Enrutador automatizado a 1 número WhatsApp",
        "Integración con Píxel de TikTok y Meta Ads",
        "Certificado SSL Seguro y hosting ultra rápido",
      ],
    },
    {
      id: "plan_master",
      name: "Ecosystem Scale Master",
      price: 389,
      original_price: 780,
      discount: "-50%",
      is_featured: true,
      badge: "MÁS VENDIDO",
      features: [
        "Catálogo ilimitado con carrito de pre-compra",
        "Distribuidor inteligente rotativo (Hasta 4 WhatsApps)",
        "Módulo de Pedidos con cálculo de flete Olva/Shalom",
        "Generador automático de Catálogo PDF Mayorista",
        "Soporte prioritario 24/7 vía canal privado VIP",
      ],
    },
    {
      id: "plan_enterprise",
      name: "Enterprise Custom Ads",
      price: 690,
      original_price: 1380,
      discount: "-50%",
      is_featured: false,
      badge: "MARCA LÍDER",
      features: [
        "Dominio .pe propio con CDN Edge ultra veloz",
        "API Conversiones CAPI servidor directo",
        "CRM y Webhooks automatizados a Google Sheets",
        "Onboarding 1 a 1 con especialista de pauta",
      ],
    },
  ];

  return (
    <section id="planes" className="w-full max-w-6xl mx-auto px-4 my-10 sm:my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
          Inversión de Alto Rendimiento
        </span>
        <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-on-surface mt-3 tracking-tight">
          {sectionTitle}
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
          Compara los paquetes comerciales con descuento del 50% y cierre directo vía WhatsApp.
        </p>
      </div>

      {/* Grid Responsivo: 3 Columnas en Desktop, Apilado Vertical en Móvil */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map((plan) => {
          const isFeatured = plan.is_featured;
          const discountPct = plan.discount || "-50%";

          return (
            <div
              key={plan.id || plan.name}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                isFeatured
                  ? "bg-surface-container-lowest border-2 border-primary shadow-[0_15px_40px_rgba(37,99,235,0.12)] scale-[1.02] z-10"
                  : "bg-surface-container-lowest border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300"
              }`}
            >
              {/* Badge Superior */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                      isFeatured
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant border border-slate-200"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-headline text-xl font-extrabold text-on-surface mb-2">
                  {plan.name}
                </h3>

                {/* Precios y Descuento */}
                <div className="flex items-baseline gap-2.5 my-4">
                  <span className="font-headline text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
                    {currencySymbol} {plan.price}
                  </span>
                  {plan.original_price && (
                    <span className="text-base text-slate-400 line-through font-medium">
                      {currencySymbol} {plan.original_price}
                    </span>
                  )}
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                    {discountPct}
                  </span>
                </div>

                <div className="w-full h-px bg-slate-100 my-5"></div>

                {/* Lista de Beneficios con Checkmarks Verdes */}
                <ul className="space-y-3.5 mb-8 text-left">
                  {plan.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-tertiary text-[18px] flex-shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón CTA hacia WhatsApp con mensaje específico del plan */}
              <a
                href={`https://wa.me/51999999999?text=${encodeURIComponent(
                  `¡Hola! Deseo contratar el paquete "${plan.name}" con la promoción de ${currencySymbol} ${plan.price} (${discountPct} DCTO). ¿Cuáles son los siguientes pasos?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3.5 px-4 rounded-2xl font-headline font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${
                  isFeatured
                    ? "bg-primary hover:opacity-95 text-on-primary shadow-md"
                    : "bg-tertiary hover:opacity-95 text-on-tertiary"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Elegir {plan.name}</span>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
