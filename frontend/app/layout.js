import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SocialLaunch | Plataforma de Campañas & CMS Autónomo",
  description:
    "Infraestructura integral de alto rendimiento: sincroniza catálogo, links-in-bio ultra-optimizados y embudos dirigidos directamente a WhatsApp con cero latencia.",
};

/**
 * Función Server-Side (SSR) para obtener la configuración del sitio
 * desde el backend en Express y Supabase.
 */
async function getSiteConfig() {
  const apiUrl =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000/api";

  try {
    const res = await fetch(`${apiUrl}/config`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

export default async function RootLayout({ children }) {
  const siteConfig = await getSiteConfig();

  const primaryColor = siteConfig?.primary_color || "#2563EB";
  const secondaryColor = siteConfig?.secondary_color || "#0F172A";
  const accentColor = siteConfig?.accent_color || "#10B981";
  const bgSurface = siteConfig?.bg_surface || "#F8FAFC";
  const bgDark = siteConfig?.bg_dark || "#1E293B";
  const fontFamily = siteConfig?.font_family || "'Plus Jakarta Sans', sans-serif";

  // Inyección dinámica de variables CSS nativas para Tailwind
  const cssVariables = {
    "--primary-color": primaryColor,
    "--secondary-color": secondaryColor,
    "--accent-color": accentColor,
    "--bg-surface": bgSurface,
    "--bg-dark": bgDark,
    "--font-family": fontFamily,
  };

  return (
    <html lang="es" style={cssVariables}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased min-h-screen flex flex-col overflow-x-hidden font-body">
        {children}
      </body>
    </html>
  );
}
