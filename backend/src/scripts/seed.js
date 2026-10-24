require("dotenv").config();
const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");

async function seed() {
  console.log("🌱 Iniciando verificación y seeding de SocialLaunch...");

  try {
    // 1. Verificar roles
    const { data: roles } = await supabase.from("roles").select("*");
    console.log(`✅ Roles encontrados: ${roles ? roles.length : 0}`);

    // 2. Verificar usuario admin
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "admin@sociallaunch.com");

    if (userError) {
      console.error("Error al buscar usuarios:", userError.message);
    }

    if (!users || users.length === 0) {
      const passwordHash = await bcrypt.hash("admin123456", 10);
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            name: "Alejandra Silva",
            email: "admin@sociallaunch.com",
            password_hash: passwordHash,
            role_id: 1,
          },
        ])
        .select();

      if (insertError) {
        console.error("❌ Error al crear usuario admin:", insertError.message);
      } else {
        console.log("🎉 Usuario administrador creado exitosamente:");
        console.log("   Email: admin@sociallaunch.com");
        console.log("   Password: admin123456");
      }
    } else {
      console.log("ℹ️ El usuario admin ya existe en la base de datos.");
    }

    // 3. Verificar site_config
    const { data: config } = await supabase.from("site_config").select("*").limit(1);
    if (!config || config.length === 0) {
      await supabase.from("site_config").insert([
        {
          id: 1,
          site_name: "SocialLaunch Campañas",
          primary_color: "#2563EB",
          secondary_color: "#0F172A",
          logo_url: null,
        },
      ]);
      console.log("✅ Configuración inicial de site_config creada.");
    } else {
      console.log("ℹ️ site_config ya configurado.");
    }

    // 4. Verificar componentes iniciales para page_id: 1
    const { data: components } = await supabase
      .from("page_components")
      .select("*")
      .eq("page_id", 1);

    if (!components || components.length === 0) {
      await supabase.from("page_components").insert([
        {
          page_id: 1,
          component_type: "promo_hero",
          order_index: 1,
          content: {
            badge: "Garantía 100% • Verificado Perú",
            subBadge: "Despliegue en 48 Horas",
            headline: "Multiplica tus Ventas y Conquista las Redes con",
            highlightText: "SocialLaunch Pro",
            description:
              "Infraestructura integral de alto rendimiento: sincroniza catálogo, links-in-bio ultra-optimizados y embudos dirigidos directamente a WhatsApp para capturar leads calificados con cero latencia.",
            ctaText: "Activar Oferta Cyber 2025",
            ctaSubtext: "Cupón: PROMO2025 (-50% DCTO)",
            ctaUrl: "https://wa.me/51999999999?text=Hola%20SocialLaunch%2C%20deseo%20activar%20la%20promocion%20Cyber2025",
            demoText: "Ver Demostración en Vivo",
            demoUrl: "https://wa.me/51999999999",
          },
        },
        {
          page_id: 1,
          component_type: "countdown",
          order_index: 2,
          content: {
            title: "Cierre de Convocatoria Flash",
            subtitle: "Cupos limitados para integración prioritaria",
            targetHours: 12,
            targetMinutes: 45,
            urgencyBadge: "🔥 Quedan 4 accesos PRO",
          },
        },
        {
          page_id: 1,
          component_type: "link_tree",
          order_index: 3,
          content: {
            title: "Enlaces de Tráfico y Canales Directos",
            links: [
              {
                title: "Canal Oficial de WhatsApp Ventas",
                url: "https://wa.me/51999999999",
                badge: "Respuesta Inmediata",
                icon: "chat",
                highlight: true,
              },
              {
                title: "Catálogo Digital de Ofertas",
                url: "#catalogo",
                badge: "50+ Productos",
                icon: "storefront",
                highlight: false,
              },
              {
                title: "Comunidad VIP de Emprendedores",
                url: "https://t.me/sociallaunch",
                badge: "+4.8k Miembros",
                icon: "groups",
                highlight: false,
              },
            ],
          },
        },
      ]);
      console.log("✅ Componentes modulares iniciales creados para la página 1.");
    }

    console.log("🏁 Proceso de seed finalizado exitosamente.");
  } catch (err) {
    console.error("❌ Error durante el seed:", err.message);
  }
}

seed().then(() => process.exit(0));
