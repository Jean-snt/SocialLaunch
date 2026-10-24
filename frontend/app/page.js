import Link from "next/link";
import { OFFICIAL_WHATSAPP_URL, OFFICIAL_WHATSAPP_NUMBER } from "../lib/api";

export const dynamic = "force-dynamic";

/**
 * Obtener la campaña activa principal para enlazar la Vitrina Frontend dinámica
 */
async function getActiveCampaignSlug() {
  const apiUrl =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000/api";

  try {
    const res = await fetch(`${apiUrl}/pages`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const pages = data.data || [];
      if (pages.length > 0) {
        const primary = pages.find((p) => p.is_published) || pages[0];
        return primary.slug ? `/${primary.slug}` : "/promo-2025";
      }
    }
  } catch (e) {}
  return "/promo-2025";
}

export default async function SocialLaunchOfficialPage() {
  const activeCampaignSlug = await getActiveCampaignSlug();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-primary selection:text-white">
      {/* Top Banner Oficial */}
      <div className="w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-600 py-2.5 px-4 text-center text-xs sm:text-sm font-semibold tracking-wide text-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">
              PLATAFORMA OFICIAL
            </span>
            <span>SocialLaunch Studio 3.8 Enterprise • Infraestructura de Conversión para Marcas</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sistema 100% Operativo
            </span>
            <Link href="/login" className="hover:underline text-white font-medium">
              Acceso Clientes &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[26px]">rocket_launch</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-headline tracking-tight text-white">SocialLaunch</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  STUDIO
                </span>
              </div>
              <span className="text-xs text-slate-400">High-Velocity Campaign CMS</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#caracteristicas" className="hover:text-white transition-colors">
              Características
            </a>
            <a href="#como-funciona" className="hover:text-white transition-colors">
              Cómo Funciona
            </a>
            <a href="#planes" className="hover:text-white transition-colors">
              Planes SaaS
            </a>
            <Link
              href={activeCampaignSlug}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Vitrina de Campaña Demo</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <a
              href={OFFICIAL_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span className="hidden sm:inline">Hablar con Ventas</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-bold text-blue-400 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Plataforma Enterprise de Conversión Directa
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-headline tracking-tight text-white leading-[1.1] max-w-5xl mx-auto">
            Convierte Clics de Redes Sociales en{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Ventas Cerradas por WhatsApp
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            SocialLaunch es el CMS modular de alto rendimiento para marcas que pautan en TikTok Ads, Instagram Reels y
            Google Ads. Elimina la fricción del Link-in-Bio convencional con cargas en borde &lt;0.8s y cierres directos.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={OFFICIAL_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.03] active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">chat</span>
              <span>Solicitar Demo de SocialLaunch</span>
            </a>

            <Link
              href={activeCampaignSlug}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-100 hover:text-white border border-slate-700 hover:border-slate-600 font-bold text-base transition-all hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-[22px] text-blue-400">visibility</span>
              <span>Ver Vitrina de Campaña en Vivo</span>
            </Link>

            <Link
              href="/admin/constructor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-base transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">tune</span>
              <span>Ir al CMS Constructor</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="block text-2xl sm:text-3xl font-black text-white">&lt;0.8s</span>
              <span className="text-xs text-slate-400 font-medium">LCP en Edge CDN</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">+28.6%</span>
              <span className="text-xs text-slate-400 font-medium">Conversión a WhatsApp</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="block text-2xl sm:text-3xl font-black text-blue-400">0 Re-despliegues</span>
              <span className="text-xs text-slate-400 font-medium">Motor Modular JSONB</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="block text-2xl sm:text-3xl font-black text-purple-400">5.1x</span>
              <span className="text-xs text-slate-400 font-medium">ROAS Promedio Reportado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Características Clave */}
      <section id="caracteristicas" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-500/20">
              Diferenciadores Técnicos
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-headline text-white mt-4">
              Diseñado Específicamente para Pauta y Tráfico Masivo
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Mientras las landings tradicionales pierden el 60% de los usuarios por lentitud, SocialLaunch entrega una
              experiencia instantánea optimizada para dispositivos móviles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px]">speed</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Velocidad Extrema en Borde</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Menos de 280 bytes en CSS crítico. Las páginas cargan al instante en conexiones 4G/5G, garantizando que
                cada clic pagado en TikTok o Instagram sea aprovechado.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px]">chat</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Enrutador Directo a WhatsApp</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Canaliza el interés en un solo toque hacia WhatsApp con mensajes contextualizados según el producto o
                paquete que el usuario visualiza.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px]">dashboard_customize</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Constructor Visual sin Código</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Reordena bloques, activa ofertas de urgencia con temporizador regresivo y edita textos en tiempo real con
                el simulador móvil interactivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes Comerciales de SocialLaunch SaaS */}
      <section id="planes" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
              Planes de Suscripción SocialLaunch
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-headline text-white mt-4">
              Escala tu Infraestructura Publicitaria
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Selecciona el plan que mejor se adapte a tu volumen de pauta y requerimientos de soporte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plan Inicial</span>
                <h3 className="text-2xl font-black text-white mt-2">Starter Launch</h3>
                <div className="flex items-baseline gap-2 my-4">
                  <span className="text-4xl font-black text-white">S/ 149</span>
                  <span className="text-xs text-slate-400">/ mes</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Ideal para emprendedores y marcas individuales que inician en TikTok Ads.</p>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 1 Campaña Activa Dinámica</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Enrutador a 1 WhatsApp Oficial</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Carga en CDN &lt; 0.8s</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Telemetría de Clics Básica</li>
                </ul>
              </div>
              <a
                href={`${OFFICIAL_WHATSAPP_URL}?text=${encodeURIComponent("Hola SocialLaunch, deseo activar el Plan Starter Launch")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm text-center transition-colors"
              >
                Elegir Starter Launch
              </a>
            </div>

            {/* Pro - Featured */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-blue-950/40 to-slate-900 border-2 border-blue-500 shadow-2xl shadow-blue-500/10 flex flex-col justify-between relative scale-105 z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Recomendado para Marcas
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Plan Crecimiento</span>
                <h3 className="text-2xl font-black text-white mt-2">Growth Scale</h3>
                <div className="flex items-baseline gap-2 my-4">
                  <span className="text-4xl font-black text-white">S/ 389</span>
                  <span className="text-xs text-slate-400">/ mes</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Para e-commerce y tiendas que invierten pauta diaria y requieren hasta 3 campañas.</p>
                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Hasta 3 Campañas Activas Simultáneas</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Constructor CMS con Bloques Urgencia</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Look & Feel con Marca Personalizada</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Telemetría y Exportación Real CSV</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Soporte Prioritario WhatsApp</li>
                </ul>
              </div>
              <a
                href={`${OFFICIAL_WHATSAPP_URL}?text=${encodeURIComponent("Hola SocialLaunch, deseo activar el Plan Growth Scale")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm text-center shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
              >
                Elegir Growth Scale
              </a>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plan Corporativo</span>
                <h3 className="text-2xl font-black text-white mt-2">Enterprise Suite</h3>
                <div className="flex items-baseline gap-2 my-4">
                  <span className="text-4xl font-black text-white">S/ 690</span>
                  <span className="text-xs text-slate-400">/ mes</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Solución llave en mano para agencias con múltiples clientes y dominios propios.</p>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Campañas ilimitadas con multi-dominio</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Distribuidor rotativo WhatsApp para 4 asesores</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Webhooks automatizados a Google Sheets</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Capacitación y Onboarding 1 a 1</li>
                </ul>
              </div>
              <a
                href={`${OFFICIAL_WHATSAPP_URL}?text=${encodeURIComponent("Hola SocialLaunch, deseo una cotización para el Plan Enterprise Suite")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm text-center transition-colors"
              >
                Contactar Asesor Enterprise
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              SL
            </div>
            <span>© 2025 SocialLaunch Studio Inc. Todos los derechos reservados.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href={activeCampaignSlug} className="hover:text-white transition-colors">
              Vitrina Demo
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Panel Administrativo
            </Link>
            <a
              href={OFFICIAL_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              WhatsApp Ventas: {OFFICIAL_WHATSAPP_NUMBER}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}