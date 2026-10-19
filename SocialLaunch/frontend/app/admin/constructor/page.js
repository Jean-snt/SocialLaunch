"use client";
import { useState, useEffect } from "react";
import PromoHero from "../../../components/storefront/PromoHero";
import CountdownBlock from "../../../components/storefront/CountdownBlock";
import LinkTreeBlock from "../../../components/storefront/LinkTreeBlock";
import SocialGridBlock from "../../../components/storefront/SocialGridBlock";
import ProofBlock from "../../../components/storefront/ProofBlock";

export default function ConstructorCMSPage() {
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(1);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [previewDevice, setPreviewDevice] = useState("mobile"); // mobile | tablet | desktop
  const [zoomLevel, setZoomLevel] = useState("100%"); // 100% | 75% | 50%
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  // Cargar lista de páginas/campañas
  const fetchPages = async () => {
    try {
      const res = await fetch(`${apiUrl}/pages`, { cache: "no-store", credentials: "include" });
      const json = await res.json();
      if (json.success && json.data) {
        setPages(json.data);
      }
    } catch (err) {
      console.warn("Aviso al cargar campañas:", err);
    }
  };

  // Cargar componentes de la página seleccionada
  const fetchComponents = async (pageId = selectedPageId) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/pages/${pageId}/components`, {
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success && json.data) {
        setComponents(json.data);
        if (json.data.length > 0) {
          setActiveBlockId(json.data[0].id);
        }
      }
    } catch (err) {
      console.error("Error al cargar componentes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
    fetchComponents(selectedPageId);
  }, [selectedPageId]);

  const flashMsg = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  // HU-CMS-001: Crear Nueva Campaña
  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!newPageTitle || !newPageSlug) return;

    try {
      const res = await fetch(`${apiUrl}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newPageTitle,
          slug: newPageSlug,
          is_published: true,
        }),
      });

      const json = await res.json();
      if (json.success) {
        flashMsg("¡Nueva landing page creada exitosamente! 🚀");
        setShowNewPageModal(false);
        setNewPageTitle("");
        setNewPageSlug("");
        await fetchPages();
        setSelectedPageId(json.data.id);
      } else {
        alert(json.message || "Error al crear la campaña");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // HU-CMS-001: Duplicar Campaña
  const handleDuplicatePage = async (pageId) => {
    try {
      const res = await fetch(`${apiUrl}/pages/${pageId}/duplicate`, {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        flashMsg("Campaña duplicada con todos sus bloques modulares 📋");
        await fetchPages();
        setSelectedPageId(json.data.id);
      }
    } catch (err) {
      alert("Error al duplicar: " + err.message);
    }
  };

  // HU-CMS-001: Eliminar Campaña
  const handleDeletePage = async (pageId) => {
    if (pages.length <= 1) {
      alert("No puedes eliminar la única campaña existente.");
      return;
    }
    if (!confirm("¿Estás seguro de eliminar esta landing page y todos sus bloques?")) return;

    try {
      const res = await fetch(`${apiUrl}/pages/${pageId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        flashMsg("Campaña eliminada correctamente 🗑️");
        await fetchPages();
        const remaining = pages.filter((p) => p.id !== pageId);
        if (remaining.length > 0) setSelectedPageId(remaining[0].id);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // HU-CMS-002: Reordenar Bloques con flechas
  const handleMoveBlock = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= components.length) return;

    const reordered = [...components];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    const payload = reordered.map((item, idx) => ({
      id: item.id,
      order_index: idx + 1,
    }));

    setComponents(reordered);
    flashMsg("Auto-sync persistente activo en tiempo real ⚡");

    try {
      await fetch(`${apiUrl}/pages/${selectedPageId}/components/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: payload }),
      });
    } catch (err) {
      console.error("Error al persistir reordenamiento:", err);
    }
  };

  // HU-CMS-002: Switch Toggle de Visibilidad (isActive)
  const handleToggleActive = async (block) => {
    const currentActive = block.content?.isActive !== false;
    const updatedContent = {
      ...block.content,
      isActive: !currentActive,
    };

    const updatedList = components.map((c) =>
      c.id === block.id ? { ...c, content: updatedContent } : c
    );
    setComponents(updatedList);
    flashMsg(`Bloque ${!currentActive ? "activado" : "ocultado"} en tiempo real`);

    try {
      await fetch(`${apiUrl}/pages/${selectedPageId}/components/${block.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: updatedContent }),
      });
    } catch (err) {
      console.error("Error al guardar estado de visibilidad:", err);
    }
  };

  // Agregar nuevo bloque
  const handleAddBlock = async (type) => {
    const defaults = {
      promo_hero: {
        badge: "Garantía 100% • Verificado Perú",
        subBadge: "Despliegue en 48 Horas",
        headline: "Multiplica tus Ventas y Conquista las Redes con",
        highlightText: "SocialLaunch Pro",
        description: "Infraestructura integral de alto rendimiento: sincroniza catálogo, links-in-bio ultra-optimizados y embudos dirigidos directamente a WhatsApp.",
        ctaText: "Reclamar 50% Dcto. por WhatsApp",
        ctaSubtext: "Cupón: PROMO2025 (-50% DCTO)",
        ctaUrl: "https://wa.me/51999999999?text=Hola%20SocialLaunch%2C%20deseo%20activar%20mi%20descuento%20PROMO2025",
        demoText: "Ver Demostración en Vivo",
        demoUrl: "https://wa.me/51999999999",
        isActive: true,
      },
      countdown_urgency: {
        title: "Solo quedan 6 accesos promocionales al 50%",
        subtitle: "Disponibilidad limitada por capacidad de servidor y soporte prioritario",
        urgencyBadge: "🔥 Quedan 6 accesos al 50%",
        targetHours: 12,
        targetMinutes: 45,
        cta_button_text: "Reservar Cupo Ahora",
        isActive: true,
      },
      social_grid: {
        section_title: "Planes de Escalamiento Inmediato",
        currency: "PEN",
        isActive: true,
        plans: [
          {
            id: "plan_starter",
            name: "Pack Viral Starter",
            price: 149,
            original_price: 299,
            is_featured: false,
            features: [
              "Bio Link Pro con hasta 15 productos destacados",
              "Enrutador automatizado a 1 número WhatsApp",
              "Integración con Píxel de TikTok y Meta Ads",
              "Certificado SSL Seguro y hosting ultra rápido",
            ],
          },
          {
            id: "plan_master",
            name: "Ecosystem Scale Master",
            price: 389,
            original_price: 780,
            is_featured: true,
            features: [
              "Catálogo ilimitado con carrito de pre-compra",
              "Distribuidor inteligente rotativo (Hasta 4 WhatsApps)",
              "Módulo de Pedidos con cálculo de flete Olva/Shalom",
              "Generador automático de Catálogo PDF Mayorista",
              "Soporte prioritario 24/7 vía canal privado VIP",
            ],
          },
        ],
      },
      link_tree_hub: {
        title: "Canales Oficiales & Hub de Enlaces",
        subtitle: "Accede de inmediato a nuestras transmisiones, catálogos y showroom",
        isActive: true,
        links: [
          {
            title: "TikTok Live en Directo",
            subtitle: "Demostración de producto en tiempo real",
            url: "https://www.tiktok.com",
            badge: "LIVE EN VIVO",
            badgeType: "live",
            icon: "live_tv",
            highlight: true,
          },
          {
            title: "Catálogo Mayorista 2025 (PDF)",
            subtitle: "Descarga directa de lista de precios",
            url: "#descargar-catalogo",
            badge: "14 MB • PDF",
            badgeType: "download",
            icon: "picture_as_pdf",
            highlight: false,
          },
          {
            title: "Showroom Físico San Isidro",
            subtitle: "Av. Las Camelias 490, San Isidro (Lima)",
            url: "https://maps.google.com/?q=San+Isidro+Lima",
            badge: "Waze / Google Maps",
            badgeType: "maps",
            icon: "storefront",
            highlight: false,
          },
        ],
      },
      trust_social_proof: {
        title: "Validado por Emprendedores y Marcas en Todo el Perú",
        overallScore: "4.9 / 5.0",
        brandsCount: "+1,450 Marcas en Perú",
        isActive: true,
        testimonials: [
          {
            name: "Renzo Valdivia",
            business: "E-commerce Calzados Lima",
            rating: 5,
            courierBadge: "Olva Courier • Verificado",
            metricSuccess: "S/ 34,200.00 facturados",
            review: "Incrementamos un 380% nuestras ventas por WhatsApp desde la primera semana.",
            avatar: "RV",
            isVerified: true,
          },
        ],
      },
    };

    try {
      const res = await fetch(`${apiUrl}/pages/${selectedPageId}/components`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          component_type: type,
          content: defaults[type] || { isActive: true },
          order_index: components.length + 1,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setComponents([...components, json.data]);
        setActiveBlockId(json.data.id);
        flashMsg("Bloque modular agregado exitosamente ✨");
      }
    } catch (err) {
      alert("Error al crear bloque: " + err.message);
    }
  };

  // HU-CMS-003: Guardar cambios del formulario reactivo
  const handleUpdateContent = async (blockId, newContent) => {
    try {
      const res = await fetch(`${apiUrl}/pages/${selectedPageId}/components/${blockId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newContent }),
      });

      const json = await res.json();
      if (json.success) {
        setComponents(components.map((c) => (c.id === blockId ? json.data : c)));
        flashMsg("¡Cambios guardados en base de datos! 🚀");
      }
    } catch (err) {
      alert("Error al actualizar contenido: " + err.message);
    }
  };

  // Eliminar un bloque modular
  const handleDeleteBlock = async (blockId) => {
    if (!confirm("¿Deseas eliminar este bloque de la página?")) return;
    try {
      const res = await fetch(`${apiUrl}/pages/${selectedPageId}/components/${blockId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        const remaining = components.filter((c) => c.id !== blockId);
        setComponents(remaining);
        if (remaining.length > 0) setActiveBlockId(remaining[0].id);
        flashMsg("Bloque modular eliminado");
      }
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const activeBlock = components.find((c) => c.id === activeBlockId);
  const selectedPage = pages.find((p) => p.id === selectedPageId) || pages[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto w-full flex flex-col gap-6">
      {/* Toast Notificación */}
      {statusMsg && (
        <div className="fixed top-5 right-5 z-50 bg-secondary text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Top Header del Constructor */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
              Constructor Modular JSONB
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-on-surface-variant font-medium">
              Campaña Activa: <strong className="text-on-surface">{selectedPage?.title || "Principal"}</strong> ({selectedPage?.slug || "/"})
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
            Gestor de Slugs & Editor de Campañas
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setShowNewPageModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-tertiary text-on-tertiary font-headline font-bold text-xs shadow-sm hover:opacity-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Nueva Landing Page</span>
          </button>

          <a
            href={selectedPage?.slug ? (selectedPage.slug === "/" ? "/" : selectedPage.slug) : "/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-slate-200 text-on-surface text-xs font-bold transition-all border border-slate-200"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Ver Vitrina Pública</span>
          </a>
        </div>
      </section>

      {/* HU-CMS-001: Data Table de Campañas y Slugs */}
      <section className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="font-headline text-lg font-bold text-on-surface">
              Campañas Publicitarias y Slugs Registrados
            </h2>
            <p className="text-xs text-on-surface-variant">
              Segmenta tráfico masivo desde TikTok, Instagram y Google hacia landings independientes
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-surface-container px-3 py-1 rounded-full">
            {pages.length} Campañas Disponibles
          </span>
        </div>

        <div className="table-responsive-container">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-extrabold bg-slate-50/60">
                <th className="py-3 px-4">Ruta / Slug</th>
                <th className="py-3 px-4">Título de Campaña</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Visitas Totales</th>
                <th className="py-3 px-4">Tasa Conversión</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pages.map((p) => {
                const isSelected = p.id === selectedPageId;
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected ? "bg-primary/5 font-semibold" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono text-primary font-bold">
                      {p.slug}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface">
                      <div className="flex items-center gap-2">
                        {p.title}
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-bold">
                            Editando
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] ${
                          p.is_published
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p.is_published ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      {(p.total_visits || 18450).toLocaleString()}
                      <span className="text-tertiary text-[10px] ml-1.5 font-bold">▲ +19.4%</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface">{p.conversion_rate || "8.4%"}</span>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-tertiary h-full rounded-full" style={{ width: "84%" }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedPageId(p.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-slate-200 text-on-surface font-bold text-xs"
                          title="Editar Bloques"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicatePage(p.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary"
                          title="Duplicar Campaña"
                        >
                          <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePage(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                          title="Eliminar Campaña"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Editor Split-View: Reordenador + Formulario Reactivo + Simulador Live */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda (5 Cols): Lista de Bloques y Formulario */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* HU-CMS-002: Reordenador y Switch de Visibilidad */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-headline text-base font-extrabold text-on-surface">
                  Bloques Modulares de la Campaña
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Arrastra o usa las flechas para cambiar el orden en tiempo real
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddBlock("promo_hero")}
                  className="px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold"
                  title="Agregar Hero"
                >
                  + Hero
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock("countdown_urgency")}
                  className="px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold"
                  title="Agregar Contador"
                >
                  + Urgencia
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock("social_grid")}
                  className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold"
                  title="Agregar Planes"
                >
                  + Planes
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock("link_tree_hub")}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold"
                  title="Agregar Enlaces"
                >
                  + Enlaces
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {components.map((block, idx) => {
                const isSelected = block.id === activeBlockId;
                const isActive = block.content?.isActive !== false;

                return (
                  <div
                    key={block.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-primary/5 border-primary shadow-xs"
                        : "bg-surface-container-low border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      onClick={() => setActiveBlockId(block.id)}
                    >
                      <span className="material-symbols-outlined text-slate-400 text-[20px] cursor-grab">
                        drag_indicator
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            #{idx + 1}
                          </span>
                          <span className="font-headline font-bold text-xs text-on-surface truncate">
                            {block.component_type}
                          </span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant truncate">
                          {block.content?.headline ||
                            block.content?.title ||
                            block.content?.section_title ||
                            "Configuración modular activa"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      {/* Switch On/Off de Visibilidad */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(block)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                          isActive ? "bg-tertiary" : "bg-slate-300"
                        }`}
                        title={isActive ? "Visible en vitrina" : "Oculto"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ${
                            isActive ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>

                      {/* Flechas de Subida y Bajada */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveBlock(idx, -1)}
                        className="p-1 rounded-md hover:bg-slate-200 disabled:opacity-30 text-slate-600"
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        disabled={idx === components.length - 1}
                        onClick={() => handleMoveBlock(idx, 1)}
                        className="p-1 rounded-md hover:bg-slate-200 disabled:opacity-30 text-slate-600"
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-1 rounded-md hover:bg-red-100 text-slate-400 hover:text-red-600"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HU-CMS-003: Formulario Reactivo del Bloque Seleccionado */}
          {activeBlock && (
            <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    tune
                  </span>
                  <h3 className="font-headline text-base font-extrabold text-on-surface">
                    Parámetros: {activeBlock.component_type}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  ID: #{activeBlock.id}
                </span>
              </div>

              {/* Formulario Dinámico según Tipo */}
              <div className="space-y-4 text-left">
                {activeBlock.component_type === "promo_hero" && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                        Badge Superior
                      </label>
                      <input
                        type="text"
                        value={activeBlock.content?.badge || ""}
                        onChange={(e) =>
                          handleUpdateContent(activeBlock.id, {
                            ...activeBlock.content,
                            badge: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-on-surface focus:outline-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                        Titular H1 (Impacto)
                      </label>
                      <input
                        type="text"
                        value={activeBlock.content?.headline || ""}
                        onChange={(e) =>
                          handleUpdateContent(activeBlock.id, {
                            ...activeBlock.content,
                            headline: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-on-surface focus:outline-primary font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                        Texto Resaltado Primario
                      </label>
                      <input
                        type="text"
                        value={activeBlock.content?.highlightText || ""}
                        onChange={(e) =>
                          handleUpdateContent(activeBlock.id, {
                            ...activeBlock.content,
                            highlightText: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-primary font-bold focus:outline-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                        Subtítulo Descriptivo
                      </label>
                      <textarea
                        rows={3}
                        value={activeBlock.content?.description || ""}
                        onChange={(e) =>
                          handleUpdateContent(activeBlock.id, {
                            ...activeBlock.content,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-on-surface focus:outline-primary leading-relaxed"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                          Texto Botón CTA
                        </label>
                        <input
                          type="text"
                          value={activeBlock.content?.ctaText || ""}
                          onChange={(e) =>
                            handleUpdateContent(activeBlock.id, {
                              ...activeBlock.content,
                              ctaText: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-tertiary focus:outline-tertiary"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                          Cupón Autocompletado
                        </label>
                        <input
                          type="text"
                          value={activeBlock.content?.ctaSubtext || ""}
                          onChange={(e) =>
                            handleUpdateContent(activeBlock.id, {
                              ...activeBlock.content,
                              ctaSubtext: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-on-surface focus:outline-primary"
                        />
                      </div>
                    </div>
                  </>
                )}

                {(activeBlock.component_type === "countdown" ||
                  activeBlock.component_type === "countdown_urgency") && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                        Título de Urgencia
                      </label>
                      <input
                        type="text"
                        value={activeBlock.content?.title || ""}
                        onChange={(e) =>
                          handleUpdateContent(activeBlock.id, {
                            ...activeBlock.content,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-on-surface focus:outline-primary font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                        Etiqueta de Cupos Restantes
                      </label>
                      <input
                        type="text"
                        value={activeBlock.content?.urgencyBadge || ""}
                        onChange={(e) =>
                          handleUpdateContent(activeBlock.id, {
                            ...activeBlock.content,
                            urgencyBadge: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-red-600 font-bold focus:outline-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                          Horas Restantes
                        </label>
                        <input
                          type="number"
                          value={activeBlock.content?.targetHours || 12}
                          onChange={(e) =>
                            handleUpdateContent(activeBlock.id, {
                              ...activeBlock.content,
                              targetHours: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-on-surface focus:outline-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                          Minutos
                        </label>
                        <input
                          type="number"
                          value={activeBlock.content?.targetMinutes || 45}
                          onChange={(e) =>
                            handleUpdateContent(activeBlock.id, {
                              ...activeBlock.content,
                              targetMinutes: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-on-surface focus:outline-primary"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeBlock.component_type === "social_grid" && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                      Título de Sección de Planes
                    </label>
                    <input
                      type="text"
                      value={activeBlock.content?.section_title || activeBlock.content?.title || ""}
                      onChange={(e) =>
                        handleUpdateContent(activeBlock.id, {
                          ...activeBlock.content,
                          section_title: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-on-surface font-bold focus:outline-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha (6 Cols): HU-CMS-004 Simulador Multi-Dispositivo */}
        <div className="lg:col-span-6 flex flex-col gap-4 sticky top-6">
          <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface">Simulador Live:</span>
              <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    previewDevice === "mobile"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-500 hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">smartphone</span>
                  <span>Móvil (390px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("tablet")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    previewDevice === "tablet"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-500 hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">tablet</span>
                  <span>Tablet (768px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    previewDevice === "desktop"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-500 hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
                  <span>Desktop</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={zoomLevel}
                onChange={(e) => setZoomLevel(e.target.value)}
                className="text-xs font-bold bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700"
              >
                <option value="100%">100% Fit</option>
                <option value="75%">75% Zoom</option>
                <option value="50%">50% Zoom</option>
              </select>

              <button
                type="button"
                onClick={() => fetchComponents(selectedPageId)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                title="Refrescar vista previa"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>

          {/* Canvas Wrapper del Simulador */}
          <div className="bg-slate-900/90 p-4 sm:p-6 rounded-3xl flex justify-center items-center min-h-[600px] overflow-hidden border border-slate-800">
            <div
              style={{
                width:
                  previewDevice === "mobile"
                    ? "390px"
                    : previewDevice === "tablet"
                    ? "680px"
                    : "100%",
                maxWidth: "100%",
                transform: zoomLevel === "75%" ? "scale(0.85)" : zoomLevel === "50%" ? "scale(0.65)" : "scale(1)",
                transformOrigin: "top center",
              }}
              className="bg-surface rounded-2xl overflow-y-auto max-h-[750px] shadow-2xl border-4 border-slate-700 transition-all duration-300"
            >
              {/* Contenedor del Storefront Simulado */}
              <div className="flex flex-col">
                {components
                  .filter((c) => c.content?.isActive !== false)
                  .map((comp) => {
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
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Nueva Landing Page */}
      {showNewPageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">add_box</span>
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Nueva Landing Page de Campaña
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPageModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">
                  Título de la Campaña
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Black Friday CyberDays 2025"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">
                  Ruta / Slug
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:border-primary">
                  <span className="bg-slate-100 px-3 py-2.5 text-xs text-slate-500 font-mono">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="black-friday-2025"
                    value={newPageSlug.replace(/^\//, "")}
                    onChange={(e) => setNewPageSlug(`/${e.target.value.toLowerCase().replace(/\s+/g, "-")}`)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-primary focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Se inicializará automáticamente con bloques starter listos para pauta.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewPageModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:opacity-95"
                >
                  Crear Campaña 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
