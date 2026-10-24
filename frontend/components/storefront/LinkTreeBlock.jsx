"use client";

export default function LinkTreeBlock({ content = {} }) {
  const title = content.title || "Canales Oficiales & Hub de Enlaces";
  const subtitle =
    content.subtitle ||
    "Accede de inmediato a nuestras transmisiones, catálogos descargables y showroom presencial";

  const links = content.links || [
    {
      title: "TikTok Live en Directo",
      subtitle: "Preguntas y demostración de producto en tiempo real",
      url: "https://www.tiktok.com",
      badge: "LIVE EN VIVO",
      badgeType: "live",
      icon: "live_tv",
      highlight: true,
    },
    {
      title: "Catálogo Mayorista 2025 (PDF)",
      subtitle: "Descarga directa de lista de precios y stock garantizado",
      fileSize: "14 MB",
      url: "#descargar-catalogo",
      badge: "14 MB • PDF",
      badgeType: "download",
      icon: "picture_as_pdf",
      highlight: false,
    },
    {
      title: "Showroom Físico San Isidro",
      subtitle: "Av. Las Camelias 490, San Isidro (Lima) • Lun a Sáb 9am - 7pm",
      url: "https://maps.google.com/?q=San+Isidro+Lima+Peru",
      badge: "Google Maps / Waze",
      badgeType: "maps",
      icon: "storefront",
      highlight: false,
    },
    {
      title: "Canal Oficial de WhatsApp Ventas",
      subtitle: "Respuesta humana en menos de 2 minutos",
      url: "https://wa.me/+51991488770?text=Hola,%20deseo%20atencion%20personalizada",
      badge: "Online Ahora",
      badgeType: "chat",
      icon: "chat",
      highlight: false,
    },
  ];

  return (
    <section id="enlaces" className="w-full max-w-3xl mx-auto px-4 my-10 sm:my-14">
      <div className="text-center mb-8">
        <span className="text-xs font-extrabold uppercase tracking-widest text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full border border-slate-200">
          Hub de Tráfico Omnicanal
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface mt-2.5">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-3.5">
        {links.map((link, idx) => {
          const isHighlight = link.highlight;
          const isLive = link.badgeType === "live" || link.badge?.includes("LIVE");

          return (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl transition-all duration-200 border group ${
                isHighlight
                  ? "bg-secondary text-white border-slate-700 shadow-md hover:shadow-xl hover:translate-x-1"
                  : "bg-surface-container-lowest hover:bg-slate-50 text-on-surface border-slate-200/90 shadow-xs hover:shadow-md hover:translate-x-1 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isHighlight
                      ? "bg-primary text-white shadow-sm"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {link.icon || "arrow_forward"}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline font-bold text-sm sm:text-base truncate">
                      {link.title}
                    </span>
                    {link.badge && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                          isLive
                            ? "bg-red-500 text-white animate-pulse"
                            : isHighlight
                            ? "bg-white/20 text-white"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {link.subtitle && (
                    <span
                      className={`text-xs mt-0.5 leading-snug line-clamp-1 ${
                        isHighlight ? "text-slate-300" : "text-on-surface-variant"
                      }`}
                    >
                      {link.subtitle}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform group-hover:translate-x-1 ${
                    isHighlight ? "text-primary" : "text-slate-400 group-hover:text-primary"
                  }`}
                >
                  chevron_right
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
