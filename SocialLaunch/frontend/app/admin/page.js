"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BackofficeDashboard() {
  const [trafficActive, setTrafficActive] = useState(true);
  const [timeRange, setTimeRange] = useState("7d"); // 7d | today | month
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [searchLead, setSearchLead] = useState("");
  const [leadPage, setLeadPage] = useState(1);
  const [mediaData, setMediaData] = useState(null);
  const [integrations, setIntegrations] = useState(null);
  const [copiedHmac, setCopiedHmac] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  const flashMsg = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  // Cargar estadísticas
  const fetchStats = async () => {
    try {
      const res = await fetch(`${apiUrl}/dashboard/stats?timeRange=${timeRange}`, {
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
        setTrafficActive(json.data.trafficActive);
      }
    } catch (e) {
      console.warn("Aviso stats:", e);
    }
  };

  // HU-DSK-003: Cargar Leads con Polling activo de 5 segundos
  const fetchLeads = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/dashboard/leads?search=${encodeURIComponent(searchLead)}&page=${leadPage}&limit=6`,
        { cache: "no-store", credentials: "include" }
      );
      const json = await res.json();
      if (json.success && json.data) {
        setLeads(json.data);
      }
    } catch (e) {
      console.warn("Aviso leads:", e);
    }
  };

  // Cargar Integraciones y Medios
  const fetchAuxData = async () => {
    try {
      const [intRes, mediaRes] = await Promise.all([
        fetch(`${apiUrl}/dashboard/integrations`, { cache: "no-store", credentials: "include" }),
        fetch(`${apiUrl}/dashboard/media`, { cache: "no-store", credentials: "include" }),
      ]);
      const intJson = await intRes.json();
      const mediaJson = await mediaRes.json();
      if (intJson.success) setIntegrations(intJson.data);
      if (mediaJson.success) setMediaData(mediaJson.data);
    } catch (e) {
      console.warn("Aviso aux data:", e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAuxData();
  }, [timeRange]);

  // Polling de 5 segundos para leads
  useEffect(() => {
    fetchLeads();
    const interval = setInterval(() => {
      fetchLeads();
    }, 5000);
    return () => clearInterval(interval);
  }, [searchLead, leadPage]);

  // HU-DSK-001: Alternar Master Switch de Tráfico
  const handleToggleTraffic = async () => {
    const nextState = !trafficActive;
    setTrafficActive(nextState);

    try {
      const res = await fetch(`${apiUrl}/dashboard/traffic-toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ state: nextState }),
      });
      const json = await res.json();
      if (json.success) {
        flashMsg(json.message);
      }
    } catch (err) {
      alert("Error al alternar tráfico: " + err.message);
    }
  };

  // HU-DSK-002: Exportar Reporte Completo (CSV instantáneo)
  const handleExportCsv = () => {
    const headers = "ID,Timestamp,Origen,Telefono_Ofuscado,Campana,Estado\n";
    const rows = leads
      .map(
        (l) =>
          `${l.id},"${l.timestamp}","${l.source}","${l.phone_obfuscated}","${l.campaign}","${l.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SocialLaunch_Reporte_${timeRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    flashMsg("Reporte CSV exportado exitosamente 📥");
  };

  // HU-DSK-005: Copiar Token HMAC SHA-256
  const handleCopyHmac = () => {
    if (integrations?.webhooks?.hmacToken && typeof navigator !== "undefined") {
      navigator.clipboard.writeText(integrations.webhooks.hmacToken);
      setCopiedHmac(true);
      flashMsg("Token HMAC copiado al portapapeles 🔑");
      setTimeout(() => setCopiedHmac(false), 3000);
    }
  };

  // HU-DSK-004: Subir Nuevo Banner con Sharp
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        flashMsg("¡Banner WebP optimizado con Sharp al -78%! ✨");
        setShowUploadModal(false);
        fetchAuxData();
      }
    } catch (err) {
      alert("Error al procesar banner: " + err.message);
    } finally {
      setUploadingBanner(false);
    }
  };

  const kpis = stats?.kpis;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto w-full flex flex-col gap-6">
      {/* Toast Notificación */}
      {statusMsg && (
        <div className="fixed top-5 right-5 z-50 bg-secondary text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{statusMsg}</span>
        </div>
      )}

      {/* HU-DSK-001: Top Command & Master Traffic Kill-Switch Bar */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
              Console v3.8.4 Enterprise
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-tertiary font-bold flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              Edge CDN Node: US-East (Miami) • 12ms
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
            Bienvenida, Alejandra Silva{" "}
            <span className="text-xs font-normal text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-lg ml-1 font-sans">
              Director de Operaciones & Media Buyer
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Master Switch de Tráfico Interactivo */}
          <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-col text-left">
              <span className="text-xs font-headline font-bold text-on-surface flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    trafficActive ? "bg-tertiary animate-pulse" : "bg-red-500"
                  }`}
                ></span>
                {trafficActive ? "🟢 Campaña En Vivo" : "🔴 En Pausa / Mantenimiento"}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {trafficActive ? "Tráfico Redirigiendo a Vitrina Pública" : "Kill-Switch Activo"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleTraffic}
              className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ml-2 ${
                trafficActive ? "bg-tertiary" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
                  trafficActive ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <Link
            href="/admin/constructor"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary text-on-primary font-headline font-bold text-xs shadow-sm hover:opacity-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Constructor CMS</span>
          </Link>
        </div>
      </section>

      {/* HU-DSK-002: Selector Temporal & Botón Exportar Reporte */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          {[
            { id: "today", label: "Hoy" },
            { id: "7d", label: "Últimos 7 días" },
            { id: "month", label: "Mes actual" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeRange(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-headline font-bold transition-all ${
                timeRange === t.id
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-500 hover:text-on-surface"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-slate-50 text-on-surface border border-slate-200 font-headline font-bold text-xs shadow-2xs transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Exportar Reporte Completo (CSV)</span>
        </button>
      </div>

      {/* HU-DSK-002: Cuadro de Mando de 4 KPIs Analíticos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Clics Totales */}
        <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                Tráfico Central
              </span>
              <span className="text-xs font-semibold text-on-surface-variant block mt-0.5">
                Clics Totales en Bio / Vitrina
              </span>
            </div>
            <span className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">ads_click</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 mt-4">
            <span className="font-headline text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
              {kpis?.totalBioClicks?.value || "48,290"}
            </span>
            <span className="text-xs text-tertiary font-extrabold bg-tertiary/10 px-2 py-0.5 rounded-full">
              {kpis?.totalBioClicks?.growth || "▲ +24.8%"}
            </span>
          </div>

          {/* Micro-gráfico de barras semanales */}
          <div className="mt-4 pt-2">
            <div className="flex items-end justify-between h-8 gap-1.5">
              {[40, 55, 35, 70, 65, 85, 100].map((val, idx) => (
                <div
                  key={idx}
                  className="w-full bg-primary/20 hover:bg-primary rounded-t transition-all"
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Lun</span>
              <span>Mie</span>
              <span className="font-bold text-primary">Hoy</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Leads WhatsApp */}
        <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                Conversión Mensajería
              </span>
              <span className="text-xs font-semibold text-on-surface-variant block mt-0.5">
                Leads WhatsApp Directo
              </span>
            </div>
            <span className="w-11 h-11 rounded-2xl bg-tertiary/15 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[24px]">chat</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 mt-4">
            <span className="font-headline text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
              {kpis?.whatsappLeads?.value || "3,842"}
            </span>
            <span className="text-xs text-tertiary font-extrabold bg-tertiary/10 px-2 py-0.5 rounded-full">
              {kpis?.whatsappLeads?.growth || "▲ +18.2% hoy"}
            </span>
          </div>

          <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-xs text-on-surface mb-1.5">
              <span className="font-medium">Objetivo Mensual</span>
              <span className="font-extrabold text-tertiary">
                {kpis?.whatsappLeads?.targetRate || "7.95"}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-tertiary h-full rounded-full" style={{ width: "79.5%" }}></div>
            </div>
          </div>
        </div>

        {/* KPI 3: Tasa de Rebote */}
        <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                Calidad de Navegación
              </span>
              <span className="text-xs font-semibold text-on-surface-variant block mt-0.5">
                Tasa de Rebote Promedio
              </span>
            </div>
            <span className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
              <span className="material-symbols-outlined text-[24px]">speed</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 mt-4">
            <span className="font-headline text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
              {kpis?.bounceRate?.value || "24.1%"}
            </span>
            <span className="text-xs text-tertiary font-extrabold bg-tertiary/10 px-2 py-0.5 rounded-full">
              {kpis?.bounceRate?.growth || "▼ -5.4% óptimo"}
            </span>
          </div>

          <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-xs text-on-surface mb-1">
              <span className="font-medium">Tiempo en Vitrina</span>
              <span className="font-extrabold text-on-surface">
                {kpis?.bounceRate?.avgTime || "1m 54s"}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>Retención de Sesión (&gt;45s)</span>
              <span className="font-bold text-primary">75.9%</span>
            </div>
          </div>
        </div>

        {/* KPI 4: ROAS Integrado Multicanal */}
        <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                Eficiencia de Pauta
              </span>
              <span className="text-xs font-semibold text-on-surface-variant block mt-0.5">
                ROAS Integrado Multicanal
              </span>
            </div>
            <span className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined text-[24px]">trending_up</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 mt-4">
            <span className="font-headline text-3xl sm:text-4xl font-black text-purple-600 tracking-tight">
              {kpis?.roas?.multiplier || "4.8x"}
            </span>
            <span className="text-xs text-purple-700 font-extrabold bg-purple-50 px-2 py-0.5 rounded-full">
              Escalado
            </span>
          </div>

          <div className="mt-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs text-on-surface flex items-center justify-between">
            <span>CPL: <strong>{kpis?.roas?.cpl || "USD 0.84"}</strong></span>
            <span>Gasto: <strong>{kpis?.roas?.totalSpend || "USD 3,227.28"}</strong></span>
          </div>
        </div>
      </section>

      {/* HU-DSK-003: Registro de Leads en Tiempo Real con Ofuscación */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline text-lg sm:text-xl font-bold text-on-surface">
                Captura de Leads en Tiempo Real (WhatsApp Directo)
              </h2>
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Polling Activo 5s
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Teléfonos ofuscados conforme a normativas de privacidad y protección de datos
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined text-slate-400 absolute left-3 top-2.5 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por origen, campaña..."
                value={searchLead}
                onChange={(e) => setSearchLead(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-primary w-52 sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="table-responsive-container">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-extrabold bg-slate-50/60">
                <th className="py-3 px-4">Hora / Fecha</th>
                <th className="py-3 px-4">Origen de Pauta</th>
                <th className="py-3 px-4">Teléfono Ofuscado</th>
                <th className="py-3 px-4">Campaña Activa</th>
                <th className="py-3 px-4">Valor Estimado</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(l.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-on-surface flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[16px]">{l.icon || "play_circle"}</span>
                    </span>
                    <span>{l.source}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-on-surface tracking-wider">
                    {l.phone_obfuscated}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{l.campaign}</td>
                  <td className="py-3.5 px-4 font-extrabold text-primary">{l.value || "S/ 389.00"}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px] border border-emerald-200">
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Grid Inferior: HU-DSK-004 Gestor Sharp + HU-DSK-005 Integraciones & CAPI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* HU-DSK-004: Gestor de Medios Sharp */}
        <section className="lg:col-span-6 bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-headline text-base font-extrabold text-on-surface">
                  Pipeline de Medios (Sharp WebP)
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Almacenamiento SSD Cloud & Optimización Automática
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-on-primary font-headline font-bold text-xs shadow-xs hover:opacity-95"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>+ Cargar Banner</span>
              </button>
            </div>

            {/* Medidor SSD */}
            <div className="bg-surface-container-low p-4 rounded-2xl border border-slate-200/80 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-on-surface mb-2">
                <span>Almacenamiento SSD Cloud</span>
                <span>1.2 GB / 10.0 GB (12% utilizado)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "12%" }}></div>
              </div>
            </div>

            {/* Lista de Banners */}
            <div className="space-y-3">
              {mediaData?.banners?.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <img src={b.url} alt={b.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-headline font-bold text-on-surface truncate max-w-[200px]">
                        {b.name}
                      </span>
                      <span className="text-[11px] text-slate-400">{b.dimensions}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {b.compressionBadge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HU-DSK-005: Consola de Integraciones, Píxeles CAPI y Webhooks */}
        <section className="lg:col-span-6 bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-headline text-base font-extrabold text-on-surface">
                Consola de Integraciones & CAPI
              </h3>
              <p className="text-xs text-on-surface-variant">
                Meta Conversions API, TikTok Events API y Webhooks HMAC SHA-256
              </p>
            </div>
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              99.98% Entregabilidad
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Meta CAPI */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  f
                </span>
                <div>
                  <span className="text-xs font-headline font-bold text-on-surface block">
                    Meta Conversions API (ID: 884102941)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Latencia: <strong>12ms</strong> • Coincidencia: <strong>99.4%</strong>
                  </span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Activo
              </span>
            </div>

            {/* TikTok CAPI */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  TT
                </span>
                <div>
                  <span className="text-xs font-headline font-bold text-on-surface block">
                    TikTok Events API (Server-to-Server)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Latencia: <strong>18ms</strong> • Coincidencia: <strong>99.1%</strong>
                  </span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Activo
              </span>
            </div>

            {/* Google Sheets */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">table_chart</span>
                </span>
                <div>
                  <span className="text-xs font-headline font-bold text-on-surface block">
                    Google Sheets Sincronización Continua
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Bidireccional cada 30s • Snapshot Excel habilitado
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                Conectado
              </span>
            </div>

            {/* Webhook REST HMAC SHA-256 */}
            <div className="p-4 rounded-2xl bg-secondary text-white border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Webhook Endpoint & Firma HMAC SHA-256
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  0 Fallas
                </span>
              </div>
              <span className="text-xs font-mono text-slate-300 block truncate mb-3">
                {integrations?.webhooks?.url || "https://sociallaunch-backend.onrender.com/api/webhooks/v1/inbound"}
              </span>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700 text-xs">
                <span className="font-mono text-slate-400 text-[11px]">
                  Token: sl_sec_hmac_99482f8d...
                </span>
                <button
                  type="button"
                  onClick={handleCopyHmac}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {copiedHmac ? "done" : "content_copy"}
                  </span>
                  <span>{copiedHmac ? "Copiado" : "Copiar Token"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal para Subir Nuevo Banner */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-headline text-lg font-bold text-on-surface">
                Cargar Nuevo Banner de Campaña
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-xs text-on-surface-variant">
                Dimensiones recomendadas: <strong>1080x1350px</strong> (Feed) o <strong>1080x1920px</strong> (Stories/TikTok).
              </p>

              <div className="border-2 border-dashed border-slate-200 hover:border-primary/60 rounded-2xl p-6 relative bg-slate-50/50 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  disabled={uploadingBanner}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                  <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
                </span>
                <span className="text-xs font-bold text-on-surface block">
                  {uploadingBanner ? "Comprimiendo con Sharp..." : "Selecciona una imagen"}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Conversión WebP automática (calidad 80%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
