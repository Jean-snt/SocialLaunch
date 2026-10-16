# 🚀 SocialLaunch — Plataforma Web Autónoma & Full-CMS de Alto Rendimiento

**SocialLaunch** es una plataforma integral diseñada para marcas y negocios que publican Landing Pages de Campañas Publicitarias (optimizadas para Meta Ads y TikTok Ads) con embudos dirigidos directamente a WhatsApp, vitrina pública de alta conversión y constructor CMS modular basado en PostgreSQL (Supabase) con soporte JSONB.

---

## 🏗️ Arquitectura del Proyecto

El repositorio está organizado en un monorepo limpio con dos capas desacopladas:

```
SocialLaunch/
├── backend/                       # API REST con Express y Node.js
│   ├── src/
│   │   ├── config/                # Cliente Supabase inyectado por entorno
│   │   ├── controllers/           # Auth, Config, Components, Upload
│   │   ├── middlewares/           # verifyAuth (JWT), verifyRole, Multer + Sharp
│   │   ├── routes/                # Enrutamiento modular por entidad
│   │   ├── services/              # Lógica de negocio desacoplada (DRY)
│   │   └── scripts/               # Seed de base de datos y test suite
│   ├── uploads/                   # Almacén de imágenes optimizadas en formato .webp
│   ├── .env.example               # Plantilla de variables de entorno del backend
│   └── app.js                     # Servidor Express con CORS credentials y cookie-parser
│
├── frontend/                      # Aplicación Next.js 14 (App Router) + Tailwind CSS
│   ├── app/
│   │   ├── layout.js              # SSR fetch de site_config e inyección de Variables CSS
│   │   ├── globals.css            # Directivas Tailwind y estilos base
│   │   ├── page.js                # Vitrina Pública dinámica consumiendo page_components
│   │   ├── login/                 # Autenticación segura con JWT y cookies httpOnly
│   │   └── admin/
│   │       ├── layout.js          # Shell del Backoffice (Sidebar y Header responsivo)
│   │       ├── page.js            # Dashboard con KPIs y Master Switch
│   │       ├── constructor/       # Constructor CMS modular (JSONB CRUD + Simulador Móvil)
│   │       └── look-and-feel/     # Editor de variables :root y optimizador WebP con Sharp
│   ├── components/                # Componentes modulares reutilizables (DRY)
│   ├── tailwind.config.js         # Mapeo a variables CSS nativas (--primary-color, etc.)
│   └── .env.example               # Plantilla de variables de entorno del frontend
│
└── .gitignore                     # Exclusión de node_modules, .env, .next y artefactos
```

---

## 🔐 Características de Seguridad y Rendimiento

1. **Autenticación JWT con Cookies `httpOnly`:**
   - La cookie de sesión cuenta con directivas `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'` y `sameSite: 'strict'` (o `'lax'`), mitigando ataques XSS y CSRF.
   - Middlewares `verifyAuth` y `verifyRole(['admin'])` protegen las mutaciones de contenido en el panel de control.
2. **Procesamiento de Imágenes con Sharp & Multer:**
   - Las imágenes subidas desde el backoffice se convierten obligatoriamente a formato `.webp` con compresión de calidad balanceada (80%) y redimensionamiento automático máximo de 1920px.
3. **Constructor Modular con JSONB:**
   - Componentes (`promo_hero`, `countdown`, `link_tree`, `social_grid`, `proof`) almacenan su contenido en la columna flexible `JSONB` de Supabase, permitiendo mutaciones rápidas sin alterar el esquema relacional.
4. **Look & Feel Dinámico con CSS Variables:**
   - En el layout raíz SSR (`app/layout.js`), Next.js obtiene los colores desde `/api/config` e inyecta dinámicamente las variables `--primary-color` y `--secondary-color` en la etiqueta `<html>`.
   - Tailwind CSS consume estas variables nativas, reflejando cualquier ajuste de color al instante sin recompilar.
5. **Mobile-First & Scroll Adaptativo:**
   - Cero scroll horizontal general indeseado.
   - Las tablas analíticas del panel de administración implementan la clase `.table-responsive-container` con scroll interno táctil y barras de desplazamiento estilizadas.

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
# Completar en .env: SUPABASE_URL, SUPABASE_KEY, JWT_SECRET

# Ejecutar el seed inicial (crea roles, usuario admin y componentes demo)
npm run seed

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev
```

> **Credenciales por defecto creadas por el seed:**
> - **Usuario:** `admin@sociallaunch.com`
> - **Contraseña:** `admin123456`

### 3. Configurar y Ejecutar el Frontend
```bash
cd ../frontend
npm install

# Copiar variables de entorno
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
# API_INTERNAL_URL=http://localhost:3000/api

# Iniciar Next.js en http://localhost:3001
npm run dev
```

---

## 🚀 Despliegue en Producción

### Despliegue del Backend (Railway o Render)
1. Conecta tu repositorio de GitHub a **Railway** o **Render**.
2. Especifica el **Root Directory**: `backend`.
3. Comando de compilación: `npm install`.
4. Comando de inicio: `npm start`.
5. Configura las siguientes Variables de Entorno en el panel del proveedor:
   - `PORT`: `3000` (o el asignado automáticamente)
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://tu-frontend.vercel.app`
   - `SUPABASE_URL`: `https://tu-proyecto.supabase.co`
   - `SUPABASE_KEY`: `tu-clave-secreta-o-anon-de-supabase`
   - `JWT_SECRET`: `tu_clave_secreta_jwt_larga_y_segura`
   - `JWT_EXPIRES_IN`: `7d`

### Despliegue del Frontend (Vercel)
1. Importa el repositorio en **Vercel**.
2. Configura el **Root Directory**: `frontend`.
3. Framework Preset: **Next.js**.
4. Añade las siguientes Variables de Entorno en Vercel:
   - `NEXT_PUBLIC_API_URL`: `https://tu-backend.up.railway.app/api`
   - `NEXT_PUBLIC_BACKEND_URL`: `https://tu-backend.up.railway.app`
   - `API_INTERNAL_URL`: `https://tu-backend.up.railway.app/api`
5. Haz clic en **Deploy**.

---

## 📦 Comandos Git para Subir Cambios al Repositorio

Desde la raíz del repositorio (`SocialLaunch`):

```bash
# 1. Verificar estado de los archivos y reglas de exclusión
git status

# 2. Preparar todos los cambios
git add .

# 3. Crear el commit de integración
git commit -m "feat: integración completa de CMS modular, JWT httpOnly y Sharp para SocialLaunch"

# 4. Subir los cambios a la rama principal
git push origin main
```
