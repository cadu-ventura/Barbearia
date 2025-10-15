@echo off
echo 🐳 Barbearia Hoshirara - Docker Setup
echo ======================================

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está instalado!
    echo 📥 Instale Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker detectado!

if "%1"=="start" goto start
if "%1"=="up" goto start
if "%1"=="stop" goto stop
if "%1"=="down" goto stop
if "%1"=="logs" goto logs
if "%1"=="restart" goto restart
if "%1"=="clean" goto clean
goto help

:start
echo 🚀 Iniciando containers...
docker-compose up -d --build
echo.
echo ✅ Aplicação rodando!
echo 🌐 Frontend: http://localhost
echo 🔧 Backend: http://localhost:3001
echo 📚 API Docs: http://localhost:3001/api-docs
goto end

:stop
echo 🛑 Parando containers...
docker-compose down
echo ✅ Containers parados!
goto end

:logs
echo 📋 Logs dos containers...
docker-compose logs -f
goto end

:restart
echo 🔄 Reiniciando containers...
docker-compose down
docker-compose up -d --build
echo ✅ Containers reiniciados!
goto end

:clean
echo 🧹 Limpando containers e imagens...
docker-compose down --rmi all --volumes --remove-orphans
docker system prune -f
echo ✅ Limpeza concluída!
goto end

:help
echo 📖 Uso: %0 {start^|stop^|logs^|restart^|clean}
echo.
echo Comandos disponíveis:
echo   start   - Iniciar containers
echo   stop    - Parar containers
echo   logs    - Ver logs em tempo real
echo   restart - Reiniciar containers
echo   clean   - Limpar tudo (cuidado!)

:end
pause