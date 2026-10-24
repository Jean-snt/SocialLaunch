import StorefrontHeader from "../../components/storefront/StorefrontHeader";
import PromoHero from "../../components/storefront/PromoHero";
import CountdownBlock from "../../components/storefront/CountdownBlock";
import LinkTreeBlock from "../../components/storefront/LinkTreeBlock";
import SocialGridBlock from "../../components/storefront/SocialGridBlock";
import ProofBlock from "../../components/storefront/ProofBlock";
import VisitTracker from "../../components/storefront/VisitTracker";
import { OFFICIAL_WHATSAPP_URL } from "../../lib/api";

export const dynamic = "force-dynamic";

/**
 * SSR Fetch para componentes modulares de una campaña por su slug
 */
async function getCampaignData(slug) {
  const apiUrl =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000/api";

  try {
    const [pageRes, componentsRes, configRes, statsRes] = await Promise.all([
      fetch(`${apiUrl}/pages/${slug}`, { cache: "no-store" }),
      fetch(`${apiUrl}/pages/${slug}/components`, { cache: "no-store" }),
      fetch(`${apiUrl}/config`, { cache: "no-store" }),
      fetch(`${apiUrl}/dashboard/stats`, { cache: "no-store" }),
    ]);

    const page = pageRes.ok ? (await pageRes.json()).data : null;
    const components = componentsRes.ok ? (await componentsRes.json()).data : [];
    const config = configRes.ok ? (await configRes.json()).data : null;
    const stats = statsRes.ok ? (await statsRes.json()).data : null;

    return {
      page,
      components: components || [],
      config,
      trafficActive: stats?.trafficActive ?? true,
    };
  } catch (err) {
    return {
      page: null,
      components: [],
      config: null,
      trafficActive: true,
    };
  }
}

export default async function CampaignSlugPage({ params }) {
  const { slug } = params;
  const { page, components, config, trafficActive } = await getCampaignData(slug);

  // HU-DSK-001: Si el Traffic Kill-Switch está desactivado, mostrar vista amigable de espera
  if (!trafficActive) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 text-center">
        <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[36px]">hourglass_top</span>
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Próximo Lanzamiento
          </span>
          <h1 className="font-headline text-2xl font-black text-on-surface mt-4">
            {page?.title || "Campaña en Pausa Programada"}
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            Estamos actualizando el inventario y preparando nuevos accesos exclusivos. Únete a la lista prioritaria para recibir aviso inmediato.
          </p>
          <a
            href={OFFICIAL_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-6 py-3.5 px-4 rounded-xl bg-tertiary text-on-tertiary font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Unirse a Lista VIP por WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  // Filtrar bloques activos (isActive !== false)
  const activeComponents = components.filter((comp) => {
    if (comp.content && comp.content.isActive === false) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-surface overflow-x-hidden pb-20 sm:pb-8">
      {/* Telemetría automática de visita */}
      <VisitTracker slug={slug} />

      {/* Header y Banner Dinámico */}
      <StorefrontHeader siteConfig={config} />

      {/* Renderizado Dinámico de Bloques Modulares */}
      <main className="flex-1 w-full flex flex-col">
        {activeComponents.length > 0 ? (
          activeComponents.map((comp) => {
            switch (comp.component_type) {
              case "promo_hero":
                return <PromoHero key={comp.id} content={comp.content} />;
              case "countdown":
              case "countdown_urgency":
                return <CountdownBlock key={comp.id} content={comp.content} />;
              case "social_grid":
                return <SocialGridBlock key={comp.id} content={comp.content} />;
              case "link_tree":
              case "link_tree_hub":
                return <LinkTreeBlock key={comp.id} content={comp.content} />;
              case "proof":
              case "trust_social_proof":
                return <ProofBlock key={comp.id} content={comp.content} />;
              default:
                return null;
            }
          })
        ) : (
          <>
            <PromoHero
              content={{
                headline: page?.title || "Impulsa tus Ventas con SocialLaunch",
                highlightText: "Pro Edition",
              }}
            />
            <CountdownBlock />
            <SocialGridBlock />
            <LinkTreeBlock />
            <ProofBlock />
          </>
        )}
      </main>

      {/* Footer Minimalista */}
      <footer className="w-full bg-surface-container-low border-t border-slate-200/80 py-8 px-4 text-center text-xs text-on-surface-variant">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface">{config?.site_name || "SocialLaunch"}</span>
            <span>• Infraestructura de Alta Velocidad</span>
          </div>
          <span>© 2026 SocialLaunch Enterprise. Todos los derechos reservados.</span>
        </div>
      </footer>

      {/* Mobile Sticky Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <a
          href={OFFICIAL_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-xl bg-tertiary text-on-tertiary font-headline font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>⚡ Activar 50% DCTO por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
