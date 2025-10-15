#!/bin/bash

echo "🐳 Barbearia Hoshirara - Docker Setup"
echo "======================================"

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado!"
    echo "📥 Instale Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Verificar se Docker Compose está disponível
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose não está disponível!"
    exit 1
fi

echo "✅ Docker detectado!"

# Função para usar docker-compose ou docker compose
run_compose() {
    if command -v docker-compose &> /dev/null; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

case "$1" in
    "start" | "up")
        echo "🚀 Iniciando containers..."
        run_compose up -d --build
        echo ""
        echo "✅ Aplicação rodando!"
        echo "🌐 Frontend: http://localhost"
        echo "🔧 Backend: http://localhost:3001"
        echo "📚 API Docs: http://localhost:3001/api-docs"
        ;;
    "stop" | "down")
        echo "🛑 Parando containers..."
        run_compose down
        echo "✅ Containers parados!"
        ;;
    "logs")
        echo "📋 Logs dos containers..."
        run_compose logs -f
        ;;
    "restart")
        echo "🔄 Reiniciando containers..."
        run_compose down
        run_compose up -d --build
        echo "✅ Containers reiniciados!"
        ;;
    "clean")
        echo "🧹 Limpando containers e imagens..."
        run_compose down --rmi all --volumes --remove-orphans
        docker system prune -f
        echo "✅ Limpeza concluída!"
        ;;
    *)
        echo "📖 Uso: $0 {start|stop|logs|restart|clean}"
        echo ""
        echo "Comandos disponíveis:"
        echo "  start   - Iniciar containers"
        echo "  stop    - Parar containers"
        echo "  logs    - Ver logs em tempo real"
        echo "  restart - Reiniciar containers"
        echo "  clean   - Limpar tudo (cuidado!)"
        ;;
esac