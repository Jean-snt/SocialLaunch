import StorefrontHeader from "../components/storefront/StorefrontHeader";
import PromoHero from "../components/storefront/PromoHero";
import CountdownBlock from "../components/storefront/CountdownBlock";
import LinkTreeBlock from "../components/storefront/LinkTreeBlock";
import SocialGridBlock from "../components/storefront/SocialGridBlock";
import ProofBlock from "../components/storefront/ProofBlock";

/**
 * SSR Fetch para componentes modulares de la página principal (page_id: 1)
 */
async function getPageData() {
  const apiUrl =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000/api";

  try {
    const [componentsRes, configRes] = await Promise.all([
      fetch(`${apiUrl}/pages/1/components`, { cache: "no-store" }),
      fetch(`${apiUrl}/config`, { cache: "no-store" }),
    ]);

    const components = componentsRes.ok ? (await componentsRes.json()).data : [];
    const config = configRes.ok ? (await configRes.json()).data : null;

    return { components: components || [], config };
  } catch (err) {
    console.warn("Error en SSR getPageData:", err.message);
    return { components: [], config: null };
  }
}

export default async function StorefrontPage() {
  const { components, config } = await getPageData();

  return (
    <div className="flex flex-col min-h-screen bg-surface overflow-x-hidden pb-20 sm:pb-8">
      {/* Navbar y Banner Dinámico */}
      <StorefrontHeader siteConfig={config} />

      {/* Renderizado Dinámico de Bloques Modulares desde page_components */}
      <main className="flex-1 w-full flex flex-col">
        {components.length > 0 ? (
          components.map((comp) => {
            switch (comp.component_type) {
              case "promo_hero":
                return <PromoHero key={comp.id} content={comp.content} />;
              case "countdown":
                return <CountdownBlock key={comp.id} content={comp.content} />;
              case "link_tree":
                return <LinkTreeBlock key={comp.id} content={comp.content} />;
              case "social_grid":
                return <SocialGridBlock key={comp.id} content={comp.content} />;
              case "proof":
                return <ProofBlock key={comp.id} content={comp.content} />;
              default:
                return null;
            }
          })
        ) : (
          // Componentes por defecto si la base de datos está vacía
          <>
            <PromoHero />
            <CountdownBlock />
            <LinkTreeBlock />
            <SocialGridBlock />
            <ProofBlock />
          </>
        )}
      </main>

      {/* Footer Minimalista */}
      <footer className="w-full bg-surface-container-low border-t border-slate-200 py-8 px-4 text-center text-xs text-on-surface-variant">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface">{config?.site_name || "SocialLaunch"}</span>
            <span>• Infraestructura de Campañas Digitales</span>
          </div>
          <span>© 2026 SocialLaunch. Todos los derechos reservados.</span>
        </div>
      </footer>

      {/* Barra de Conversión Pegajosa Inferior (Mobile-First Sticky Bar) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md p-3 border-t border-slate-200/80 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <a
          href="https://wa.me/51999999999?text=Hola%20SocialLaunch%2C%20quiero%20activar%20mi%20descuento%20Cyber2025"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-xl bg-tertiary text-on-tertiary font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>⚡ Activar 50% DCTO por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
