"use client";

export default function ProofBlock({ content = {} }) {
  const title = content.title || "Validado por Emprendedores y Marcas en Todo el Perú";
  const overallScore = content.overallScore || "4.9 / 5.0";
  const brandsCount = content.brandsCount || "+1,450 Marcas en Perú";

  const testimonials = content.testimonials || [
    {
      name: "Renzo Valdivia",
      business: "E-commerce Calzados Lima",
      rating: 5,
      isVerified: true,
      courierBadge: "Olva Courier • Verificado",
      metricSuccess: "S/ 34,200.00 facturados en 2 semanas",
      review:
        "Incrementamos un 380% nuestras ventas por WhatsApp desde la primera semana. La velocidad de carga instantánea en TikTok Ads redujo nuestro costo por lead a la mitad.",
      avatar: "RV",
    },
    {
      name: "Mariana Huamán",
      business: "Boutique Moda Chic (Arequipa)",
      rating: 5,
      isVerified: true,
      courierBadge: "Shalom Express • Entregado",
      metricSuccess: "+520% Leads Calificados",
      review:
        "Cero complicaciones técnicas. Los clientes hacen clic en nuestro link-in-bio y en 2 segundos ya me están enviando el mensaje con el paquete exacto seleccionado.",
      avatar: "MH",
    },
    {
      name: "Carlos Pina",
      business: "Agencia Growth Ads & Media",
      rating: 5,
      isVerified: true,
      courierBadge: "Meta & TikTok CAPI Sync",
      metricSuccess: "ROAS 5.2x Escalado",
      review:
        "Es la mejor solución para optimizar el ROAS en pauta publicitaria. Pasamos de una tasa de rebote del 65% a solo un 24%, recuperando la inversión el primer día.",
      avatar: "CP",
    },
  ];

  return (
    <section id="testimonios" className="w-full max-w-6xl mx-auto px-4 my-12 sm:my-20">
      {/* Header con Puntuación 4.9 y Badge Nacional */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 mb-3 shadow-2xs">
          <div className="flex items-center gap-0.5 text-amber-500">
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="font-headline font-black text-sm text-on-surface">{overallScore}</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-bold text-on-surface">{brandsCount}</span>
        </div>

        <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant mt-2">
          Historias reales de negocios locales que multiplicaron sus ventas directas por mensajería.
        </p>
      </div>

      {/* Grid de Testimonios Validados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all duration-200 group"
          >
            <div>
              {/* Badges de Verificación y Logística */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px]">
                      star
                    </span>
                  ))}
                </div>
                {t.courierBadge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant border border-slate-200">
                    {t.courierBadge}
                  </span>
                )}
              </div>

              {/* Métrica de Éxito Destacada */}
              {t.metricSuccess && (
                <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl font-headline font-bold text-xs mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>{t.metricSuccess}</span>
                </div>
              )}

              {/* Review Text */}
              <p className="text-sm text-on-surface-variant leading-relaxed italic mb-6">
                "{t.review}"
              </p>
            </div>

            {/* Perfil del Cliente */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-secondary text-white font-headline font-black flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                {t.avatar}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-headline font-bold text-on-surface truncate">
                    {t.name}
                  </span>
                  {t.isVerified && (
                    <span
                      className="material-symbols-outlined text-tertiary text-[16px]"
                      title="Cliente Verificado"
                    >
                      verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-on-surface-variant truncate">{t.business}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
