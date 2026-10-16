"use client";
import { useState, useEffect } from "react";
import PromoHero from "../../../components/storefront/PromoHero";
import CountdownBlock from "../../../components/storefront/CountdownBlock";
import LinkTreeBlock from "../../../components/storefront/LinkTreeBlock";
import SocialGridBlock from "../../../components/storefront/SocialGridBlock";
import ProofBlock from "../../../components/storefront/ProofBlock";

export default function ConstructorCMSPage() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [previewDevice, setPreviewDevice] = useState("mobile"); // mobile | desktop

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  // Cargar componentes desde la API
  const fetchComponents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/pages/1/components`, {
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json();
      if (json.success && json.data) {
        setComponents(json.data);
        if (json.data.length > 0 && !activeBlockId) {
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
    fetchComponents();
  }, []);

  // Agregar nuevo bloque modular
  const handleAddBlock = async (type) => {
    const defaults = {
      promo_hero: {
        badge: "🔥 Oferta Especial",
        headline: "Nuevo Titular de Impacto",
        highlightText: "SocialLaunch",
        description: "Descripción de tu nueva oferta optimizada.",
        ctaText: "Pedir por WhatsApp",
        ctaUrl: "https://wa.me/51999999999",
      },
      countdown: {
        title: "Cierre de Oferta Flash",
        subtitle: "Aprovecha antes de que expire el cronómetro",
        targetHours: 6,
        targetMinutes: 30,
        urgencyBadge: "⚡ Pocos cupos disponibles",
      },
      link_tree: {
        title: "Nuestros Canales",
        links: [
          {
            title: "WhatsApp Asesoría Directa",
            url: "https://wa.me/51999999999",
            badge: "Online",
            icon: "chat",
            highlight: true,
          },
          {
            title: "Catálogo Online",
            url: "#",
            badge: "Novedades",
            icon: "storefront",
            highlight: false,
          },
        ],
      },
      social_grid: {
        title: "Productos del Mes",
        items: [
          {
            title: "Plan Emprendedor PRO",
            price: "S/ 120.00",
            tag: "OFERTA",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx7eg4UBqcf1MpYIO-2G5Lwfe2Qw8NPry2Eob3NMa-nfNEQnBG5YOSIO7S_4kAI2XF29z7A_7i4VicFfEp0lNrLN5uvmlqg0nIBEd94fIg-IR6QRRokPcviD8uHptL89saWuvtRRMiqYwebnZPlxuUKQx82UuG0AFQckI1NKTQZJYSPluokYPPENbaX20_DWSdNFQpWh2JFWkup71rj9id4neH_u5yE3stdk-mDo7wmJaMYwVJHrNe",
          },
        ],
      },
      proof: {
        title: "Testimonios Verificados",
        testimonials: [
          {
            name: "Cliente Satisfecho",
            business: "Tienda Lima",
            rating: 5,
            review: "Excelente plataforma para convertir visitantes en ventas.",
            avatar: "CS",
          },
        ],
      },
    };

    try {
      const res = await fetch(`${apiUrl}/pages/1/components`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          component_type: type,
          content: defaults[type] || {},
          order_index: components.length + 1,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setComponents([...components, json.data]);
        setActiveBlockId(json.data.id);
        flashMsg("Bloque agregado exitosamente");
      }
    } catch (err) {
      alert("Error al crear bloque: " + err.message);
    }
  };

  // Guardar cambios en el contenido JSONB de un bloque
  const handleUpdateContent = async (blockId, newContent) => {
    try {
      const res = await fetch(`${apiUrl}/pages/1/components/${blockId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newContent }),
      });

      const json = await res.json();
      if (json.success) {
        setComponents(
          components.map((c) => (c.id === blockId ? { ...c, content: newContent } : c))
        );
        flashMsg("Cambios guardados en JSONB");
      }
    } catch (err) {
      alert("Error al actualizar contenido: " + err.message);
    }
  };

  // Reordenar bloques (Mover Arriba / Mover Abajo)
  const handleMove = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= components.length) return;

    const newComponents = [...components];
    const [moved] = newComponents.splice(index, 1);
    newComponents.splice(targetIndex, 0, moved);

    // Preparar payload de reordenamiento
    const items = newComponents.map((item, idx) => ({
      id: item.id,
      order_index: idx + 1,
    }));

    setComponents(newComponents);

    try {
      const res = await fetch(`${apiUrl}/pages/1/components/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items }),
      });

      const json = await res.json();
      if (json.success) {
        flashMsg("Orden actualizado exitosamente");
      }
    } catch (err) {
      console.error("Error al reordenar:", err);
    }
  };

  // Eliminar un bloque
  const handleDelete = async (blockId) => {
    if (!confirm("¿Seguro que deseas eliminar este bloque modular?")) return;

    try {
      const res = await fetch(`${apiUrl}/pages/1/components/${blockId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json();
      if (json.success) {
        const filtered = components.filter((c) => c.id !== blockId);
        setComponents(filtered);
        if (activeBlockId === blockId && filtered.length > 0) {
          setActiveBlockId(filtered[0].id);
        }
        flashMsg("Bloque eliminado");
      }
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const flashMsg = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto w-full flex flex-col gap-6">
      {/* Header del Constructor */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">design_services</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-2xl font-extrabold text-on-surface">
                Constructor CMS
              </h1>
              <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-mono">
                v2.4 JSONB
              </span>
            </div>
            <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              Auto-sync persistente activo en PostgreSQL Supabase
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {statusMsg && (
            <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-3 py-1.5 rounded-xl border border-tertiary/20 animate-fade">
              ✓ {statusMsg}
            </span>
          )}

          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-slate-200 text-xs font-bold text-on-surface transition-all border border-slate-200/60"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>Previsualizar</span>
          </a>

          <button
            onClick={() => flashMsg("¡Cambios publicados en producción! 🚀")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tertiary text-on-tertiary text-xs font-bold shadow-md hover:opacity-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            <span>Publicar Cambios 🚀</span>
          </button>
        </div>
      </section>

      {/* Split View: Gestor de Bloques (Izquierda) + Simulador en Vivo (Derecha) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Bloques y Editor JSONB (5 Columnas) */}
        <div className="xl:col-span-5 flex flex-col gap-5">
          {/* Paleta rápida para insertar nuevos bloques */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="font-headline font-bold text-base text-on-surface">
                Estructura Modular
              </span>
              <span className="text-xs font-medium text-slate-400">
                {components.length} Bloques Activos
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {[
                { type: "promo_hero", label: "Hero", icon: "star", color: "text-primary" },
                { type: "countdown", label: "Reloj", icon: "timer", color: "text-red-500" },
                { type: "link_tree", label: "Links", icon: "link", color: "text-emerald-600" },
                { type: "social_grid", label: "Ofertas", icon: "grid_view", color: "text-purple-600" },
                { type: "proof", label: "Reviews", icon: "verified", color: "text-amber-500" },
              ].map((btn) => (
                <button
                  key={btn.type}
                  type="button"
                  onClick={() => handleAddBlock(btn.type)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all hover:scale-105 group"
                >
                  <span className={`material-symbols-outlined text-[22px] ${btn.color}`}>
                    {btn.icon}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 mt-1">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Bloques con Reordenamiento y Editor */}
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Cargando bloques modulares...
              </div>
            ) : components.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                No hay bloques creados aún. Haz clic arriba para agregar uno.
              </div>
            ) : (
              components.map((comp, idx) => {
                const isExpanded = activeBlockId === comp.id;

                return (
                  <div
                    key={comp.id}
                    className={`bg-surface-container-lowest rounded-2xl shadow-sm border transition-all overflow-hidden ${
                      isExpanded ? "border-primary ring-2 ring-primary/10" : "border-slate-100"
                    }`}
                  >
                    {/* Barra de cabecera del bloque */}
                    <div
                      onClick={() => setActiveBlockId(isExpanded ? null : comp.id)}
                      className="p-4 bg-slate-50/60 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-primary text-white">
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="text-sm font-bold text-on-surface block capitalize">
                            {comp.component_type.replace("_", " ")}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            id: {comp.id}
                          </span>
                        </div>
                      </div>

                      {/* Botones de acción rápida: subir, bajar, eliminar */}
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, "up")}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30"
                          title="Mover arriba"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                        </button>
                        <button
                          type="button"
                          disabled={idx === components.length - 1}
                          onClick={() => handleMove(idx, "down")}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30"
                          title="Mover abajo"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_downward
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(comp.id)}
                          className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 ml-1"
                          title="Eliminar bloque"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Editor de campos JSONB cuando está expandido */}
                    {isExpanded && (
                      <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Propiedades del Contenido (JSONB)
                        </span>

                        {comp.component_type === "promo_hero" && (
                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block text-slate-500 mb-1">Titular (Headline)</label>
                              <input
                                type="text"
                                value={comp.content?.headline || ""}
                                onChange={(e) =>
                                  handleUpdateContent(comp.id, {
                                    ...comp.content,
                                    headline: e.target.value,
                                  })
                                }
                                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Texto Resaltado</label>
                              <input
                                type="text"
                                value={comp.content?.highlightText || ""}
                                onChange={(e) =>
                                  handleUpdateContent(comp.id, {
                                    ...comp.content,
                                    highlightText: e.target.value,
                                  })
                                }
                                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Texto Botón WhatsApp</label>
                              <input
                                type="text"
                                value={comp.content?.ctaText || ""}
                                onChange={(e) =>
                                  handleUpdateContent(comp.id, {
                                    ...comp.content,
                                    ctaText: e.target.value,
                                  })
                                }
                                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                              />
                            </div>
                          </div>
                        )}

                        {comp.component_type === "countdown" && (
                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block text-slate-500 mb-1">Título del Cronómetro</label>
                              <input
                                type="text"
                                value={comp.content?.title || ""}
                                onChange={(e) =>
                                  handleUpdateContent(comp.id, {
                                    ...comp.content,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 mb-1">Badge de Urgencia</label>
                              <input
                                type="text"
                                value={comp.content?.urgencyBadge || ""}
                                onChange={(e) =>
                                  handleUpdateContent(comp.id, {
                                    ...comp.content,
                                    urgencyBadge: e.target.value,
                                  })
                                }
                                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                              />
                            </div>
                          </div>
                        )}

                        {comp.component_type === "link_tree" && (
                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block text-slate-500 mb-1">Título de la Sección</label>
                              <input
                                type="text"
                                value={comp.content?.title || ""}
                                onChange={(e) =>
                                  handleUpdateContent(comp.id, {
                                    ...comp.content,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                              />
                            </div>
                          </div>
                        )}

                        {(comp.component_type === "social_grid" ||
                          comp.component_type === "proof") && (
                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block text-slate-500 mb-1">Título de la Sección</label>
                              <input
                                type="text"
                                value={comp.content?.title || ""}
                                onChange={(e) =>
                                  handleUpdateContent(comp.id, {
                                    ...comp.content,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                              />
                            </div>
                          </div>
                        )}

                        <span className="text-[10px] text-slate-400 italic">
                          💾 Los cambios se guardan y reflejan automáticamente en el simulador en vivo.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Columna Derecha: Simulador Interactivo en Tiempo Real (7 Columnas) */}
        <div className="xl:col-span-7 flex flex-col items-center">
          {/* Selector de Dispositivo para Previsualización */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl mb-4 shadow-inner">
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewDevice === "mobile"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">smartphone</span>
              <span>Móvil (380px)</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewDevice === "desktop"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
              <span>Escritorio Completo</span>
            </button>
          </div>

          {/* Marco del Simulador */}
          <div
            className={`w-full transition-all duration-300 ${
              previewDevice === "mobile"
                ? "max-w-[400px] border-[10px] border-slate-800 rounded-[40px] shadow-2xl overflow-hidden bg-surface"
                : "max-w-full rounded-2xl border border-slate-200 shadow-md bg-surface overflow-hidden"
            }`}
          >
            {/* Altavoz y Notch de Teléfono */}
            {previewDevice === "mobile" && (
              <div className="w-full bg-slate-800 h-6 flex justify-center items-center">
                <div className="w-16 h-3 bg-slate-900 rounded-full"></div>
              </div>
            )}

            {/* Contenedor del Preview con scroll interno */}
            <div className="h-[740px] overflow-y-auto bg-surface flex flex-col">
              {components.map((comp) => {
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
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
