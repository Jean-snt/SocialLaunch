"use client";
import { useState } from "react";
import Link from "next/link";

export default function BackofficeDashboard() {
  const [trafficActive, setTrafficActive] = useState(true);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto w-full flex flex-col gap-6">
      {/* Top Command & Status Bar */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider font-bold text-outline bg-surface-container px-2.5 py-0.5 rounded-md">
              Console v3.8.4
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-tertiary font-bold flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-tertiary"></span>
              CDN Edge Node: US-East (Miami)
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Bienvenida de nuevo, Alejandra Silva{" "}
            <span className="text-sm font-normal text-on-surface-variant">
              (Admin Principal)
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Master Switch de Tráfico Interactivo */}
          <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-xl border border-slate-200/60">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    trafficActive ? "bg-tertiary animate-pulse" : "bg-slate-400"
                  }`}
                ></span>
                {trafficActive ? "Campaña En Vivo" : "Tráfico Pausado"}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {trafficActive
                  ? "Redirigiendo a Vitrina Pública"
                  : "Modo Mantenimiento"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setTrafficActive(!trafficActive)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ml-2 ${
                trafficActive ? "bg-tertiary" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
                  trafficActive ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <Link
            href="/admin/constructor"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>Editar Bloques CMS</span>
          </Link>
        </div>
      </section>

      {/* Analytical KPI Strip (4 Columnas) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Tráfico Central
              </span>
              <span className="text-xs font-medium text-on-surface-variant block mt-0.5">
                Clics Totales en Bio / Vitrina
              </span>
            </div>
            <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">ads_click</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-4">
            <span className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
              48,290
            </span>
            <span className="text-xs text-tertiary font-bold bg-tertiary/10 px-2 py-0.5 rounded-full">
              ▲ +24.8%
            </span>
          </div>

          {/* Sparkline Visual */}
          <div className="mt-4 pt-2">
            <div className="flex items-end justify-between h-8 gap-1.5">
              <div className="w-full bg-primary/20 rounded-t h-[40%]"></div>
              <div className="w-full bg-primary/30 rounded-t h-[55%]"></div>
              <div className="w-full bg-primary/25 rounded-t h-[35%]"></div>
              <div className="w-full bg-primary/45 rounded-t h-[70%]"></div>
              <div className="w-full bg-primary/60 rounded-t h-[65%]"></div>
              <div className="w-full bg-primary/80 rounded-t h-[85%]"></div>
              <div className="w-full bg-primary rounded-t h-[100%] shadow-xs"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Lun</span>
              <span>Mie</span>
              <span className="font-bold text-primary">Hoy</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Conversión Mensajería
              </span>
              <span className="text-xs font-medium text-on-surface-variant block mt-0.5">
                Leads WhatsApp Directo
              </span>
            </div>
            <span className="w-10 h-10 rounded-xl bg-tertiary/15 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[22px]">chat</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-4">
            <span className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
              3,842
            </span>
            <span className="text-xs text-tertiary font-bold bg-tertiary/10 px-2 py-0.5 rounded-full">
              ▲ +18.2% hoy
            </span>
          </div>

          <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-xs text-on-surface mb-1">
              <span>Conversión Clic-a-WhatsApp</span>
              <span className="font-bold text-tertiary">7.95%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-tertiary h-full rounded-full" style={{ width: "79.5%" }}></div>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Calidad de Navegación
              </span>
              <span className="text-xs font-medium text-on-surface-variant block mt-0.5">
                Tasa de Rebote Promedio
              </span>
            </div>
            <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[22px]">speed</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-4">
            <span className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
              24.1%
            </span>
            <span className="text-xs text-tertiary font-bold bg-tertiary/10 px-2 py-0.5 rounded-full">
              ▼ -5.4% óptimo
            </span>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-on-surface-variant mb-1">
              <span>Retención de Sesión (&gt;45s)</span>
              <span className="font-bold text-on-surface">75.9%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
              <div className="bg-primary h-full" style={{ width: "76%" }}></div>
              <div className="bg-slate-300 h-full" style={{ width: "24%" }}></div>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Origen de Tráfico
              </span>
              <span className="text-xs font-medium text-on-surface-variant block mt-0.5">
                Dispositivos Móviles
              </span>
            </div>
            <span className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined text-[22px]">smartphone</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-4">
            <span className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
              91.4%
            </span>
            <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full">
              Mobile-First
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span>TikTok: <strong>58%</strong></span>
            <span>Instagram: <strong>33%</strong></span>
            <span>Web: <strong>9%</strong></span>
          </div>
        </div>
      </section>

      {/* Tabla Adaptativa con Scroll Interno Controlado (Cero desborde de pantalla) */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-headline text-lg sm:text-xl font-bold text-on-surface">
              Campañas y Canales de Conversión Activos
            </h2>
            <p className="text-xs text-on-surface-variant">
              Monitoreo en tiempo real de URLs parametrizadas y tasas de conversión
            </p>
          </div>
          <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full">
            ● 4 Canales Sincronizados
          </span>
        </div>

        {/* Contenedor responsivo con scroll horizontal interno para prevenir overflow general */}
        <div className="table-responsive-container">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-bold bg-slate-50/50">
                <th className="py-3 px-4">Canal / Campaña</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Clics</th>
                <th className="py-3 px-4">WhatsApp Leads</th>
                <th className="py-3 px-4">Tasa Conv.</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  TikTok Ads Cyber 2025
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500">/bio?ref=tiktok</td>
                <td className="py-3.5 px-4 font-bold">28,490</td>
                <td className="py-3.5 px-4 font-bold text-tertiary">2,380</td>
                <td className="py-3.5 px-4 font-bold">8.35%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Activo
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Instagram Stories Flash
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500">/bio?ref=ig_story</td>
                <td className="py-3.5 px-4 font-bold">14,120</td>
                <td className="py-3.5 px-4 font-bold text-tertiary">1,120</td>
                <td className="py-3.5 px-4 font-bold">7.93%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Activo
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Tráfico Orgánico Bio
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500">/</td>
                <td className="py-3.5 px-4 font-bold">5,680</td>
                <td className="py-3.5 px-4 font-bold text-tertiary">342</td>
                <td className="py-3.5 px-4 font-bold">6.02%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px]">
                    Optimizable
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
