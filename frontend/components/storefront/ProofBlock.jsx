"use client";

export default function ProofBlock({ content = {} }) {
  const title = content.title || "Validado por Emprendedores en Perú";
  const testimonials = content.testimonials || [
    {
      name: "Renzo Valdivia",
      business: "E-commerce Calzados Lima",
      rating: 5,
      review:
        "Incrementamos un 380% nuestras ventas por WhatsApp desde la primera semana. La velocidad de carga y el diseño responsivo en TikTok Ads fue brutal.",
      avatar: "RV",
    },
    {
      name: "Mariana Huamán",
      business: "Boutique Moda Chic",
      rating: 5,
      review:
        "Cero complicaciones técnicas. Los clientes hacen clic y en 2 segundos ya me están enviando el mensaje con el producto exacto seleccionado.",
      avatar: "MH",
    },
    {
      name: "Carlos Pina",
      business: "Agencia Growth Ads",
      rating: 5,
      review:
        "Es la mejor solución para optimizar el ROAS en Meta Ads. Nuestros clientes pasaron de un rebote del 65% a solo un 24%.",
      avatar: "CP",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 my-12">
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-tertiary bg-tertiary/10 px-3 py-1 rounded-full">
          Prueba Social Verificada
        </span>
        <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-on-surface mt-2">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]">
                    star
                  </span>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed mb-4">
                "{t.review}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                {t.avatar}
              </div>
              <div>
                <span className="text-sm font-bold text-on-surface block">{t.name}</span>
                <span className="text-xs text-on-surface-variant">{t.business}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
