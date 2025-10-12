#!/bin/bash

# TickKK - n8n Setup Script
# Este script automatiza la configuración inicial de n8n

set -e

echo "🚀 TickKK - Configuración de n8n"
echo "================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logs
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    log_error "No se encontró docker-compose.yml. Ejecuta este script desde la raíz del proyecto TickKK."
    exit 1
fi

# Paso 1: Verificar Docker
log_info "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    log_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

log_success "Docker y Docker Compose están disponibles"

# Paso 2: Verificar archivo .env
log_info "Verificando configuración..."
if [ ! -f ".env" ]; then
    log_warning "Archivo .env no encontrado. Creando desde .env.example..."
    cp .env.example .env
    log_info "Por favor edita el archivo .env con tus configuraciones antes de continuar."
    log_info "Especialmente las configuraciones de email (SMTP_*)."
    read -p "Presiona Enter cuando hayas configurado el archivo .env..."
fi

# Paso 3: Iniciar servicios
log_info "Iniciando servicios de Docker..."
docker-compose up -d database
log_info "Esperando que PostgreSQL inicie..."
sleep 10

docker-compose up -d backend n8n
log_info "Esperando que n8n inicie..."
sleep 15

docker-compose up -d frontend
log_info "Esperando que todos los servicios inicien..."
sleep 10

# Paso 4: Verificar servicios
log_info "Verificando servicios..."

# Verificar PostgreSQL
if docker-compose exec -T database pg_isready -U tickkk_user &> /dev/null; then
    log_success "PostgreSQL está funcionando"
else
    log_error "PostgreSQL no está respondiendo"
    exit 1
fi

# Verificar Backend
if curl -f http://localhost:9200/api/health &> /dev/null; then
    log_success "Backend está funcionando"
else
    log_warning "Backend no está respondiendo en el puerto 9200"
fi

# Verificar n8n
if curl -f http://localhost:9300/healthz &> /dev/null; then
    log_success "n8n está funcionando"
else
    log_warning "n8n no está respondiendo en el puerto 9300"
fi

# Verificar Frontend
if curl -f http://localhost:9100/health &> /dev/null; then
    log_success "Frontend está funcionando"
else
    log_warning "Frontend no está respondiendo en el puerto 9100"
fi

# Paso 5: Mostrar información de acceso
echo ""
echo "🎉 Configuración inicial completada!"
echo "===================================="
echo ""
echo "📱 URLs de acceso:"
echo "  Frontend:  http://localhost:9100"
echo "  Backend:   http://localhost:9200"
echo "  n8n:       http://localhost:9300"
echo ""
echo "🔐 Credenciales de n8n:"
echo "  Usuario:   admin"
echo "  Password:  (verificar en archivo .env - N8N_BASIC_AUTH_PASSWORD)"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Accede a n8n: http://localhost:9300"
echo "  2. Configura credenciales SMTP siguiendo la guía: docs/N8N_SETUP.md"
echo "  3. Importa y activa los workflows"
echo "  4. Verifica que los webhooks funcionen"
echo ""

# Paso 6: Ofrecer configuración automática de workflows
echo "¿Deseas configurar automáticamente los workflows? (y/n)"
read -r configure_workflows

if [[ $configure_workflows =~ ^[Yy]$ ]]; then
    log_info "Configurando workflows automáticamente..."

    # Verificar si n8n está accesible
    if curl -f http://localhost:9300/healthz &> /dev/null; then
        log_info "n8n está disponible, continuando con la configuración..."

        # Aquí podrías añadir comandos para configurar workflows automáticamente
        # usando la API de n8n si es necesario

        log_warning "La configuración automática de workflows requiere configuración manual."
        log_info "Por favor sigue la guía completa en: docs/N8N_SETUP.md"
    else
        log_error "n8n no está accesible. Verifica que esté funcionando correctamente."
    fi
fi

# Paso 7: Test básico opcional
echo ""
echo "¿Deseas ejecutar un test básico de conectividad? (y/n)"
read -r run_test

if [[ $run_test =~ ^[Yy]$ ]]; then
    log_info "Ejecutando test básico..."

    echo ""
    echo "📊 Estado de los servicios:"
    docker-compose ps

    echo ""
    echo "🔍 Test de conectividad:"

    # Test Backend
    if curl -s http://localhost:9200/api/health | grep -q "healthy"; then
        log_success "✅ Backend API responde correctamente"
    else
        log_error "❌ Backend API no responde"
    fi

    # Test n8n
    if curl -s http://localhost:9300/healthz | grep -q "ok"; then
        log_success "✅ n8n responde correctamente"
    else
        log_warning "⚠️  n8n health check falló (normal si no está completamente configurado)"
    fi

    # Test Frontend
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:9100 | grep -q "200"; then
        log_success "✅ Frontend está sirviendo contenido"
    else
        log_warning "⚠️  Frontend no responde correctamente"
    fi
fi

echo ""
log_success "Script de configuración completado!"
log_info "Para configuración avanzada, consulta: docs/N8N_SETUP.md"
echo ""