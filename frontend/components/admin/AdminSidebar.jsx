"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession } from "../../lib/api";

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    try {
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("Logout error:", e);
    }
    clearAuthSession();
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "grid_view" },
    { label: "Constructor CMS", href: "/admin/constructor", icon: "layers" },
    { label: "Look & Feel Generator", href: "/admin/look-and-feel", icon: "palette" },
  ];

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-surface-container-low border-r border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Brand */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200/60">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-base font-bold tracking-tight text-on-surface">
                  SocialLaunch
                </span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                  Studio CMS
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Workspace Pill */}
          <div className="px-5 my-3">
            <div className="bg-surface-container rounded-lg px-3 py-2 flex items-center justify-between border border-slate-200/60">
              <span className="text-xs text-on-surface-variant font-medium">Workspace</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-tertiary font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                Pro Enterprise
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-3 mt-1">
            <div className="px-3 py-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-outline">
                Plataforma
              </span>
            </div>

            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? "bg-primary text-on-primary font-semibold shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="px-3 pt-5 pb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-outline">
                Canales de Venta
              </span>
            </div>

            <Link
              href="/promo-2025"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-tertiary">storefront</span>
                <span>Vitrina de Campaña</span>
              </div>
              <span className="text-[10px] font-bold bg-tertiary/15 text-tertiary px-1.5 py-0.5 rounded">
                Live ↗
              </span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-blue-500">public</span>
                <span>Página Oficial SaaS</span>
              </div>
              <span className="text-[10px] font-bold bg-blue-500/15 text-blue-600 px-1.5 py-0.5 rounded">
                B2B ↗
              </span>
            </Link>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-200/80">
          <div className="bg-surface-container rounded-xl p-3 flex items-center justify-between border border-slate-200/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                AS
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-on-surface truncate">Alejandra Silva</span>
                <span className="text-[10px] text-tertiary font-bold">Super Admin</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
