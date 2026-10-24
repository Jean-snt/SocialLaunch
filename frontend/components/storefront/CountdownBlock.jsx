"use client";
import { useState, useEffect } from "react";

export default function CountdownBlock({ content = {} }) {
  const title = content.title || "Solo quedan 6 accesos promocionales al 50% de Descuento";
  const subtitle =
    content.urgency_label ||
    content.subtitle ||
    "Disponibilidad limitada por capacidad de servidor y soporte prioritario";
  const urgencyBadge = content.urgencyBadge || "⚡ Solo quedan 6 accesos promocionales al 50%";
  const ctaButtonText = content.cta_button_text || content.ctaText || "Reservar Cupo Ahora";
  const whatsappUrl =
    content.ctaUrl ||
    "https://wa.me/+51991488770?text=Hola%20SocialLaunch%2C%20quiero%20reservar%20mi%20cupo%20con%2050%25%20de%20descuento";

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: content.targetHours || 12,
    minutes: content.targetMinutes || 45,
    seconds: 30,
    isExpired: false,
  });

  useEffect(() => {
    setMounted(true);

    // Si viene target_date_iso, calcular tiempo exacto
    if (content.target_date_iso) {
      const targetTime = new Date(content.target_date_iso).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, targetTime - now);

        if (diff <= 0) {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
          clearInterval(interval);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft({ hours, minutes, seconds, isExpired: false });
        }
      }, 1000);
      return () => clearInterval(interval);
    }

    // Temporizador regresivo relativo estándar
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [content.target_date_iso, content.targetHours, content.targetMinutes]);

  const formatNum = (num) => String(num).padStart(2, "0");

  return (
    <section className="w-full max-w-5xl mx-auto px-4 my-8 sm:my-12">
      <div className="bg-gradient-to-r from-secondary via-slate-900 to-secondary text-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-700/80 relative overflow-hidden">
        {/* Glow sutil */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          <div className="flex flex-col text-center lg:text-left max-w-xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold tracking-wide w-fit mx-auto lg:mx-0 mb-3 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              {timeLeft.isExpired ? "OFERTA EXPIRADA" : urgencyBadge}
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{subtitle}</p>
          </div>

          {/* Bloques de Reloj y Botón Urgencia */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 sm:px-5 py-3 rounded-2xl border border-white/15 min-w-[70px] sm:min-w-[85px]">
                <span className="font-headline text-2xl sm:text-4xl font-extrabold text-white">
                  {mounted ? formatNum(timeLeft.hours) : "12"}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Horas</span>
              </div>
              <span className="text-2xl font-bold text-slate-500">:</span>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 sm:px-5 py-3 rounded-2xl border border-white/15 min-w-[70px] sm:min-w-[85px]">
                <span className="font-headline text-2xl sm:text-4xl font-extrabold text-emerald-400">
                  {mounted ? formatNum(timeLeft.minutes) : "45"}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Minutos</span>
              </div>
              <span className="text-2xl font-bold text-slate-500">:</span>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3.5 sm:px-5 py-3 rounded-2xl border border-white/15 min-w-[70px] sm:min-w-[85px]">
                <span className="font-headline text-2xl sm:text-4xl font-extrabold text-primary-fixed">
                  {mounted ? formatNum(timeLeft.seconds) : "30"}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Segundos</span>
              </div>
            </div>

            {/* Alternancia a Lista de Espera si expiró */}
            {timeLeft.isExpired ? (
              <a
                href="https://wa.me/51999999999?text=Hola,%20deseo%20anotarme%20en%20la%20Lista%20de%20Espera%20para%20la%20proxima%20promocion"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm text-center border border-slate-500 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                <span>Unirse a Lista de Espera</span>
              </a>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-xl bg-tertiary hover:opacity-95 text-on-tertiary font-bold text-sm text-center shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 font-headline"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>{ctaButtonText}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
