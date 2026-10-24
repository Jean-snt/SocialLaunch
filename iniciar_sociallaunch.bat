@echo off
chcp 65001 > nul
title SocialLaunch Studio Enterprise - Lanzador del Sistema

echo ===============================================================================
echo                SOCIALLAUNCH STUDIO ENTERPRISE v3.8.4
echo             High-Velocity Campaign Studio & Backend API
echo ===============================================================================
echo.
echo [1/4] Verificando entorno de Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado o no se encuentra en el PATH.
    echo Por favor instala Node.js versión 18 o superior para continuar.
    pause
    exit /b 1
)
echo      Node.js detectado correctamente.
echo.

echo [2/4] Iniciando Servidor Backend (Express + Sharp + API)...
cd /d "%~dp0SocialLaunch\backend"
start "SocialLaunch Backend (Puerto 3000)" cmd /k "title SocialLaunch Backend (Puerto 3000) && npm run dev"

echo [3/4] Iniciando Servidor Frontend (Next.js 14 App Router)...
cd /d "%~dp0SocialLaunch\frontend"
start "SocialLaunch Frontend (Puerto 3001)" cmd /k "title SocialLaunch Frontend (Puerto 3001) && npm run dev"

echo.
echo [4/4] Esperando inicialización de servicios locales...
timeout /t 5 /nobreak > nul

echo.
echo ===============================================================================
echo                   ¡SERVICIOS DESPLEGADOS CON ÉXITO!
echo ===============================================================================
echo.
echo   ► Página Oficial SaaS:         http://localhost:3001/
echo   ► Vitrina de Campaña Live:     http://localhost:3001/promo-2025
echo   ► Panel Administrativo:        http://localhost:3001/admin
echo   ► Constructor CMS Modular:     http://localhost:3001/admin/constructor
echo   ► Look & Feel Generator:       http://localhost:3001/admin/look-and-feel
echo   ► Formulario de Login:         http://localhost:3001/login
echo.
echo   ► API REST Backend:            http://localhost:3000/api
echo   ► WhatsApp Oficial de Contacto: wa.me/+51991488770
echo ===============================================================================
echo.
echo Abriendo SocialLaunch en tu navegador predeterminado...
start http://localhost:3001/
start http://localhost:3001/admin

echo.
echo Puedes mantener esta ventana abierta como referencia.
echo Presiona cualquier tecla para cerrar este asistente (los servidores continuarán corriendo).
pause > nul
