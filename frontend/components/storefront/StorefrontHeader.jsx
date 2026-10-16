"use client";
import Link from "next/link";

export default function StorefrontHeader({ siteConfig }) {
  const siteName = siteConfig?.site_name || "SocialLaunch";
  const logoUrl = siteConfig?.logo_url;

  return (
    <>
      {/* Top Banner Flash Oferta */}
      <div className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-2 px-4 sm:px-8 flex items-center justify-between text-xs sm:text-sm font-semibold shadow-sm">
        <div className="flex items-center gap-2 mx-auto">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold animate-pulse">
            🔥
          </span>
          <span className="tracking-wide">OFERTA FLASH CYBER 2025:</span>
          <span className="hidden sm:inline opacity-95">
            Envíos Express gratis y despacho prioritario a todo el Perú
          </span>
          <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ml-1">
            Cupón Auto-Aplicado
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-1 text-xs text-white/90">
          <span className="material-symbols-outlined text-[15px]">verified</span>
          <span>Pasarela SSL 256-bit</span>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="w-full bg-surface-container-lowest/95 backdrop-blur-md shadow-sm sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteName}
                className="h-9 w-auto object-contain rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-lg sm:text-xl font-bold tracking-tight text-on-surface">
                  {siteName}
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary">
                  PRO
                </span>
              </div>
              <span className="text-xs text-on-surface-variant font-medium -mt-0.5">
                Vitrina Pública & Engine Comercial
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-on-surface-variant">
            <a href="#hero" className="hover:text-primary transition-colors">
              Inicio
            </a>
            <a href="#enlaces" className="hover:text-primary transition-colors">
              Enlaces Directos
            </a>
            <a href="#ofertas" className="hover:text-primary transition-colors">
              Promociones
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden xl:flex flex-col text-right">
            <span className="text-xs text-on-surface-variant">Atención en Tiempo Real</span>
            <span className="text-xs font-bold text-tertiary flex items-center gap-1 justify-end">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span> 12 Asesores Online
            </span>
          </div>

          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-primary rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Backoffice</span>
          </Link>

          <a
            href="https://wa.me/51999999999?text=Hola%20SocialLaunch%2C%20deseo%20activar%20la%20promocion%20Cyber2025"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-tertiary hover:opacity-95 text-on-tertiary text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>WhatsApp Ventas</span>
          </a>
        </div>
      </header>
    </>
  );
}
