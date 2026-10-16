"use client";

export default function LinkTreeBlock({ content = {} }) {
  const title = content.title || "Enlaces Directos de Tráfico y Ventas";
  const links = content.links || [
    {
      title: "Canal Oficial de WhatsApp Ventas",
      url: "https://wa.me/51999999999",
      badge: "Respuesta Inmediata",
      icon: "chat",
      highlight: true,
    },
    {
      title: "Catálogo Digital de Ofertas Cyber",
      url: "#catalogo",
      badge: "50+ Modelos",
      icon: "storefront",
      highlight: false,
    },
    {
      title: "Comunidad VIP de Emprendedores",
      url: "https://t.me/sociallaunch",
      badge: "+4.8k Miembros",
      icon: "groups",
      highlight: false,
    },
  ];

  return (
    <section id="enlaces" className="w-full max-w-2xl mx-auto px-4 my-8">
      <div className="text-center mb-6">
        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
          {title}
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Accede directamente a los canales prioritarios de atención y compra
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {links.map((link, idx) => {
          const isHighlight = link.highlight;

          return (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 shadow-sm border group ${
                isHighlight
                  ? "bg-gradient-to-r from-primary to-primary-container text-on-primary border-primary hover:shadow-lg hover:scale-[1.01]"
                  : "bg-surface-container-lowest hover:bg-slate-50 text-on-surface border-slate-200/80 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isHighlight
                      ? "bg-white/20 text-white"
                      : "bg-primary/10 text-primary group-hover:scale-105 transition-transform"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {link.icon || "arrow_forward"}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 text-left">
                  <span className="font-semibold text-sm sm:text-base truncate group-hover:underline">
                    {link.title}
                  </span>
                  {link.badge && (
                    <span
                      className={`text-[11px] font-medium ${
                        isHighlight ? "text-white/80" : "text-on-surface-variant"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`material-symbols-outlined text-[20px] ml-2 flex-shrink-0 group-hover:translate-x-1 transition-transform ${
                  isHighlight ? "text-white" : "text-slate-400 group-hover:text-primary"
                }`}
              >
                chevron_right
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
