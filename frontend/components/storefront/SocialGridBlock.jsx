"use client";

export default function SocialGridBlock({ content = {} }) {
  const title = content.title || "Productos Destacados & Feed de Campaña";
  const items = content.items || [
    {
      title: "Pack Emprendedor Digital 2025",
      price: "S/ 149.00",
      originalPrice: "S/ 299.00",
      tag: "50% DCTO",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx7eg4UBqcf1MpYIO-2G5Lwfe2Qw8NPry2Eob3NMa-nfNEQnBG5YOSIO7S_4kAI2XF29z7A_7i4VicFfEp0lNrLN5uvmlqg0nIBEd94fIg-IR6QRRokPcviD8uHptL89saWuvtRRMiqYwebnZPlxuUKQx82UuG0AFQckI1NKTQZJYSPluokYPPENbaX20_DWSdNFQpWh2JFWkup71rj9id4neH_u5yE3stdk-mDo7wmJaMYwVJHrNe",
    },
    {
      title: "Consultoría 1 a 1 de Conversión",
      price: "S/ 99.00",
      originalPrice: "S/ 180.00",
      tag: "CUPOS LIMITADOS",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeAMjjV5sIrRF5adiIi0WThgnP3kg-bYdNLUJv_wpXiJyVabZyBUp6i0tBiNd_MhwzwXO9XOjmfDH2eVdyecL5lBE7a7E2E0bjNhzlI_R_3OiynaqWhAWAJtd25jVDpgFi8RlgKyB7riNDDbGlO026TmKr9ZNJtl1BpWcVc2aOTsgUGqU-39vCl7bON5PYcCeF5haN2v3NWMEQyAM_LBNxqZAOqymxYnnD-Mv0hR-ZQVgU84Qa0v5l",
    },
  ];

  return (
    <section id="catalogo" className="w-full max-w-5xl mx-auto px-4 my-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            {title}
          </h2>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Pide directamente por WhatsApp con descuento automático aplicado
          </p>
        </div>
        <span className="hidden sm:inline-flex text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
          ⚡ Entrega Express
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow group"
          >
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-md shadow-sm">
                {item.tag}
              </span>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface mb-2">
                  {item.title}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-headline text-2xl font-extrabold text-primary">
                    {item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {item.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <a
                href={`https://wa.me/51999999999?text=Hola,%20deseo%20comprar%20el%20${encodeURIComponent(
                  item.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-tertiary hover:opacity-95 text-on-tertiary font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Pedir por WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
