import "./globals.css";

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
      cache: "no-store", // SSR dinámico en cada petición para reflejar cambios del admin al instante
    });

    if (!res.ok) {
      console.warn("No se pudo obtener site_config, usando valores por defecto.");
      return null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.warn("Error de conexión SSR con la API de configuración:", error.message);
    return null;
  }
}

export default async function RootLayout({ children }) {
  // 1. Petición SSR a la API del backend
  const siteConfig = await getSiteConfig();

  const primaryColor = siteConfig?.primary_color || "#2563EB";
  const secondaryColor = siteConfig?.secondary_color || "#0F172A";
  const accentColor = "#007d55"; // Color de conversión esmeralda

  // 2. Inyección dinámica de variables CSS nativas para Tailwind
  const cssVariables = {
    "--primary-color": primaryColor,
    "--secondary-color": secondaryColor,
    "--accent-color": accentColor,
  };

  return (
    <html lang="es" style={cssVariables}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased min-h-screen flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
