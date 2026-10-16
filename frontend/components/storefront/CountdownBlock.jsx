"use client";
import { useState, useEffect } from "react";

export default function CountdownBlock({ content = {} }) {
  const title = content.title || "Cierre de Convocatoria Flash";
  const subtitle = content.subtitle || "Cupos limitados para integración prioritaria en campaña";
  const urgencyBadge = content.urgencyBadge || "🔥 Quedan 4 accesos PRO";

  // Cuenta regresiva dinámica
  const [timeLeft, setTimeLeft] = useState({
    hours: content.targetHours || 12,
    minutes: content.targetMinutes || 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (num) => String(num).padStart(2, "0");

  return (
    <section className="w-full max-w-4xl mx-auto px-4 my-8">
      <div className="bg-gradient-to-r from-secondary via-slate-900 to-secondary text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold tracking-wide w-fit mx-auto md:mx-0 mb-2 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              {urgencyBadge}
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-md">{subtitle}</p>
          </div>

          {/* Bloques de Tiempo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2.5 rounded-xl border border-white/10 min-w-[65px] sm:min-w-[75px]">
              <span className="font-headline text-2xl sm:text-4xl font-extrabold text-white">
                {formatNum(timeLeft.hours)}
              </span>
              <span className="text-[10px] font-semibold uppercase text-slate-400 mt-0.5">Horas</span>
            </div>
            <span className="text-2xl font-bold text-slate-500">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2.5 rounded-xl border border-white/10 min-w-[65px] sm:min-w-[75px]">
              <span className="font-headline text-2xl sm:text-4xl font-extrabold text-emerald-400">
                {formatNum(timeLeft.minutes)}
              </span>
              <span className="text-[10px] font-semibold uppercase text-slate-400 mt-0.5">Minutos</span>
            </div>
            <span className="text-2xl font-bold text-slate-500">:</span>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2.5 rounded-xl border border-white/10 min-w-[65px] sm:min-w-[75px]">
              <span className="font-headline text-2xl sm:text-4xl font-extrabold text-primary-fixed">
                {formatNum(timeLeft.seconds)}
              </span>
              <span className="text-[10px] font-semibold uppercase text-slate-400 mt-0.5">Segundos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
