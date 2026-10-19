"use client";
import Link from "next/link";

export default function AdminHeader({ onToggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl border-b border-slate-200/80 z-30 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Botón hamburguesa móvil */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 bg-tertiary/10 px-3 py-1 rounded-full border border-tertiary/20">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
          <span className="text-xs text-tertiary font-bold tracking-wide">
            ⚡ EN VIVO / LIVE
          </span>
        </div>

        {/* Search Bar Desktop */}
        <div className="relative hidden md:flex items-center w-64 lg:w-80">
          <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar componentes o colores..."
            className="w-full bg-surface-container-lowest text-xs text-on-surface pl-9 pr-12 py-2 rounded-xl border border-slate-200/80 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <span className="absolute right-2.5 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-all border border-slate-200/60 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px] text-tertiary">visibility</span>
          <span className="hidden sm:inline">Ver Vitrina Pública</span>
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
