"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authFetch } from "../../lib/api";

export default function AdminHeader({ onToggleSidebar }) {
  const router = useRouter();
  const [trafficActive, setTrafficActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Lista de elementos navegables y configurables del sistema
  const searchableItems = [
    { title: "Hero Promocional (promo_hero)", type: "Componente CMS", url: "/admin/constructor", icon: "view_headline" },
    { title: "Contador de Urgencia (countdown)", type: "Componente CMS", url: "/admin/constructor", icon: "timer" },
    { title: "Planes Comerciales (social_grid)", type: "Componente CMS", url: "/admin/constructor", icon: "grid_view" },
    { title: "Hub de Enlaces (link_tree)", type: "Componente CMS", url: "/admin/constructor", icon: "link" },
    { title: "Testimonios y Prueba Social (proof)", type: "Componente CMS", url: "/admin/constructor", icon: "verified" },
    { title: "Paleta de Colores & Tokens :root", type: "Look & Feel", url: "/admin/look-and-feel", icon: "palette" },
    { title: "Logotipo Corporativo & Favicon", type: "Look & Feel", url: "/admin/look-and-feel", icon: "image" },
    { title: "Leads de WhatsApp & Telemetría", type: "Dashboard", url: "/admin", icon: "chat" },
    { title: "Exportar Reporte CSV de Leads", type: "Dashboard", url: "/admin", icon: "download" },
    { title: "Gestor de Slugs de Campaña", type: "CMS", url: "/admin/constructor", icon: "folder" },
    { title: "Vitrina de Campaña Activa", type: "Pública", url: "/promo-2025", icon: "visibility" },
    { title: "Página Oficial SocialLaunch", type: "Pública", url: "/", icon: "home" },
  ];

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await authFetch("/dashboard/stats");
        if (res.ok && res.data?.data) {
          setTrafficActive(res.data.data.trafficActive ?? true);
        }
      } catch (e) {}
    }
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const filtered = searchableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q.toLowerCase()) ||
        item.type.toLowerCase().includes(q.toLowerCase())
    );
    setSearchResults(filtered);
    setShowResults(true);
  };

  const handleSelectResult = (url) => {
    setShowResults(false);
    setSearchQuery("");
    router.push(url);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/95 backdrop-blur-xl border-b border-slate-200/80 z-30 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Botón hamburguesa móvil */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Indicador EN VIVO / LIVE Simplificado (Verde cuando activo, Rojo cuando pausado, sin animaciones excesivas) */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold tracking-wide transition-colors ${
            trafficActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              trafficActive ? "bg-emerald-500" : "bg-red-500"
            }`}
          ></span>
          <span>{trafficActive ? "EN VIVO" : "EN PAUSA"}</span>
        </div>

        {/* Buscador Superior Funcional */}
        <div className="relative hidden md:flex items-center w-64 lg:w-80">
          <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => searchQuery && setShowResults(true)}
            placeholder="Buscar componentes, páginas..."
            className="w-full bg-surface-container-lowest text-xs text-on-surface pl-9 pr-8 py-2 rounded-xl border border-slate-200/80 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowResults(false);
              }}
              className="absolute right-2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}

          {/* Menú de Resultados del Buscador */}
          {showResults && (
            <div className="absolute top-11 left-0 right-0 bg-surface-container-lowest rounded-2xl shadow-xl border border-slate-200 p-2 max-h-80 overflow-y-auto z-50 animate-fade-in">
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectResult(item.url)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100/80 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        {item.icon}
                      </span>
                      <span className="text-xs font-semibold text-on-surface group-hover:text-primary">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-container text-slate-500">
                      {item.type}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  No se encontraron resultados para "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/promo-2025"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all border border-slate-200/60 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px] text-tertiary">visibility</span>
          <span className="hidden sm:inline">Ver Vitrina de Campaña</span>
          <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
        </Link>

        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
            AS
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-on-surface leading-tight">Alejandra Silva</span>
            <span className="text-[10px] text-tertiary font-semibold">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
