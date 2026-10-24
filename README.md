# 🚀 SocialLaunch — Plataforma Web Autónoma & Full-CMS de Alto Rendimiento

**SocialLaunch Studio** es una suite web enterprise y acelerador de conversión publicitaria diseñado para canalizar tráfico masivo desde redes sociales (TikTok Ads, Instagram Reels, Google Ads) hacia cierres comerciales directos en WhatsApp y pasarelas de pago.

---

## 🏗️ Arquitectura del Sistema

El monorepo cuenta con una separación limpia y desacoplada entre el motor frontend de alta velocidad y el backend RESTful con persistencia en Supabase (PostgreSQL JSONB):

```
SocialLaunch/
├── backend/                       # API REST con Express y Node.js (Render Ready)
│   ├── src/
│   │   ├── config/                # Cliente Supabase resiliente a entornos
│   │   ├── controllers/           # Auth, Pages, Components, Config, Dashboard, Leads, Upload
│   │   ├── middlewares/           # verifyAuth (JWT), verifyRole, Helmet, RateLimit, Sharp
│   │   ├── routes/                # Enrutamiento RESTful modular por entidad
│   │   ├── services/              # Lógica de negocio desacoplada con validación JSONB
│   │   └── scripts/               # Seed de base de datos idempotente
│   ├── uploads/                   # Almacén de imágenes optimizadas a WebP con Sharp
│   ├── .env.example               # Plantilla de variables de entorno del backend
│   └── app.js                     # Servidor Express con CORS dinámico, cookies httpOnly y seguridad
│
├── frontend/                      # Aplicación Next.js 14 (App Router) + Tailwind CSS (Vercel Ready)
│   ├── app/
│   │   ├── layout.js              # Inyección dinámica de Tokens CSS (:root) sin parpadeo SSR
│   │   ├── globals.css            # Directivas Tailwind, diseño responsivo y tokens
│   │   ├── page.js                # Vitrina Pública principal (/[slug] dinámico)
│   │   ├── [slug]/                # Enrutador dinámico de campañas de pauta
│   │   ├── login/                 # Autenticación segura con JWT y cookies httpOnly
│   │   └── admin/                 # Backoffice Enterprise
│   │       ├── layout.js          # Shell del Backoffice (Sidebar y Header responsivo)
│   │       ├── page.js            # Dashboard con KPIs en vivo, Kill-Switch y Leads
│   │       ├── constructor/       # Constructor CMS modular (JSONB CRUD + Simulador Multi-Dispositivo)
│   │       └── look-and-feel/     # Editor de variables :root, Presets y optimizador Sharp
│   ├── components/                # Bloques modulares reutilizables (DRY)
│   │   ├── storefront/            # Hero, Countdown, Social Grid, LinkTree, Proof, Header
│   │   └── admin/                 # AdminHeader, AdminSidebar
│   ├── tailwind.config.js         # Mapeo a variables CSS nativas (--primary-color, etc.)
│   └── .env.example               # Plantilla de variables de entorno del frontend
│
└── .gitignore                     # Exclusión estricta de node_modules, .env, .next y temporales
```

---

## 🔐 Seguridad y Rendimiento Enterprise (DoD)

1. **Autenticación JWT con Cookies `httpOnly`:**
   - La cookie de sesión cuenta con directivas `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'` y `sameSite: 'lax'` / `'strict'`, mitigando ataques XSS y CSRF.
   - Middlewares `verifyAuth` y `verifyRole(['admin'])` protegen las mutaciones de contenido en el panel de control.
2. **Defensas de Cabeceras & Rate Limiting:**
   - Implementación de `helmet` para protección contra sniffing de MIME, clickjacking y CSP.
   - Limitador de tasa (`express-rate-limit`) en endpoints sensibles de autenticación y carga multimedia.
3. **Optimización Multimedia con Sharp & WebP:**
   - Conversión automática de imágenes a formato `.webp` con compresión del 80% y redimensionamiento inteligente a 1920px.
4. **Motor Modular JSONB:**
   - Los bloques de campaña (`promo_hero`, `countdown_urgency`, `social_grid`, `link_tree_hub`, `trust_social_proof`) se almacenan de forma estructurada en PostgreSQL permitiendo mutaciones dinámicas sin alterar migraciones.
5. **Inyección en Caliente de Variables CSS (:root):**
   - El motor de temas inyecta tokens cromáticos `--primary-color`, `--secondary-color`, `--accent-color`, `--bg-surface` y `--bg-dark` directamente en el runtime de Next.js sin recompilar estilos Tailwind.
6. **Mobile-First & Cero Desbordamiento:**
   - Compatibilidad testeada para 375px, 390px y 412px (`overflow-x-hidden`).
   - Tablas con scroll horizontal interno táctil (`.table-responsive-container`).

---

## ⚡ Guía de Inicio Rápido (Desarrollo Local)

### 1. Prerrequisitos
- Node.js 18+ o superior (recomendado Node 20+)
- npm o yarn
- Proyecto activo en Supabase (PostgreSQL)

### 2. Configurar y Ejecutar el Backend
```bash
cd backend
npm install

# Copiar variables de entorno
cp .env.example .env

# Ejecutar el seed inicial (crea usuario admin y componentes demo)
npm run seed

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev
```

> **Credenciales por defecto:**
> - **Usuario:** `admin@sociallaunch.com`
> - **Contraseña:** `admin123456`

### 3. Configurar y Ejecutar el Frontend
```bash
cd ../frontend
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar Next.js en http://localhost:3001
npm run dev
```

Acceder a:
- Vitrina Pública: `http://localhost:3001`
- Backoffice CMS: `http://localhost:3001/admin`
- Login: `http://localhost:3001/login`

---

## 🚀 Despliegue en Producción (Render & Vercel)

### Despliegue del Backend en Render (Web Service)
1. Ve a [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
2. Conecta el repositorio GitHub de **SocialLaunch**.
3. Parámetros de configuración:
   - **Name:** `sociallaunch-backend`
   - **Root Directory:** `backend` ⚠️ *(Crítico)*
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Variables de entorno requeridas en Render:
   ```bash
   PORT=3000
   NODE_ENV=production
   CLIENT_URL=https://tu-frontend.vercel.app
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_KEY=tu_clave_anon_o_service_role
   JWT_SECRET=tu_clave_secreta_jwt_minimo_32_caracteres
   JWT_EXPIRES_IN=7d
   ```
5. Tras el despliegue exitoso, valida el health check:
   `GET https://sociallaunch-backend.onrender.com/api/health`

### Despliegue del Frontend en Vercel
1. Importa el repositorio en [vercel.com](https://vercel.com).
2. Selecciona **Root Directory**: `frontend`.
3. Framework Preset: **Next.js**.
4. Variables de entorno requeridas en Vercel:
   ```bash
   NEXT_PUBLIC_API_URL=https://sociallaunch-backend.onrender.com/api
   NEXT_PUBLIC_BACKEND_URL=https://sociallaunch-backend.onrender.com
   API_INTERNAL_URL=https://sociallaunch-backend.onrender.com/api
   ```
5. Clic en **Deploy**.

---

## 📡 Catálogo de Endpoints REST

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `GET` | `/api/health` | Estado del servicio y timestamp | Público |
| `POST` | `/api/auth/login` | Login con credenciales, emite cookie httpOnly | Público |
| `POST` | `/api/auth/logout` | Cierre de sesión y limpieza de cookie | Autenticado |
| `GET` | `/api/auth/me` | Datos del usuario actual | Autenticado |
| `GET` | `/api/config` | Obtener tokens visuales (:root) | Público |
| `PUT` | `/api/config` | Actualizar paleta, logo y favicon | Admin |
| `GET` | `/api/pages` | Listar todas las campañas y slugs | Público |
| `GET` | `/api/pages/:identifier` | Obtener campaña por ID o Slug | Público |
| `POST` | `/api/pages` | Crear nueva campaña / landing page | Admin |
| `PUT` | `/api/pages/:id` | Actualizar metadatos o estado de campaña | Admin |
| `DELETE` | `/api/pages/:id` | Eliminar campaña | Admin |
| `POST` | `/api/pages/:id/duplicate`| Duplicar campaña con sus componentes | Admin |
| `GET` | `/api/pages/:id/components` | Listar componentes modulares ordenados | Público |
| `POST` | `/api/pages/:id/components` | Insertar nuevo bloque modular JSONB | Admin |
| `PUT` | `/api/pages/:id/components/reorder` | Reordenar bloques en lote | Admin |
| `PUT` | `/api/pages/:id/components/:cId` | Actualizar contenido JSONB o isActive | Admin |
| `DELETE` | `/api/pages/:id/components/:cId` | Eliminar bloque | Admin |
| `POST` | `/api/upload` | Subida y compresión WebP con Sharp | Admin |
| `GET` | `/api/dashboard/stats` | Telemetría en vivo, KPIs y Kill-Switch | Autenticado |
| `POST` | `/api/dashboard/traffic-toggle` | Alternar Kill-Switch global con auditoría | Admin |
| `GET` | `/api/leads` | Leads en tiempo real con teléfonos ofuscados | Autenticado |
| `POST` | `/api/leads` | Registrar evento de captura / clic WhatsApp | Público |
| `GET` | `/api/integrations` | Estado de CAPI (Meta, TikTok) y Webhooks HMAC | Autenticado |
