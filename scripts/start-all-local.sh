#!/bin/bash

# ============================================
# Script Maestro - Inicia todo el stack TickKK
# ============================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Banner
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                               ║${NC}"
echo -e "${BLUE}║       ${GREEN}🎫 TickKK - Sistema de Tickets${BLUE}       ║${NC}"
echo -e "${BLUE}║          ${YELLOW}Iniciando Stack Completo${BLUE}          ║${NC}"
echo -e "${BLUE}║                                               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════╝${NC}"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Función para cleanup
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Verificar PostgreSQL
echo -e "${BLUE}[1/4]${NC} ${YELLOW}Verificando PostgreSQL...${NC}"
if ! pg_isready -q 2>/dev/null; then
    echo -e "${RED}✗ PostgreSQL no está corriendo${NC}"
    echo -e "${YELLOW}  Inicia PostgreSQL con: sudo systemctl start postgresql${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL está activo${NC}"
echo ""

# Iniciar n8n
echo -e "${BLUE}[2/4]${NC} ${YELLOW}Iniciando n8n...${NC}"
"$SCRIPT_DIR/start-n8n-local.sh" &
N8N_PID=$!
echo -e "${GREEN}✓ n8n iniciado (PID: $N8N_PID)${NC}"
echo -e "${YELLOW}   Accede a n8n en: http://localhost:5678${NC}"
echo ""

# Esperar a que n8n esté listo
echo -e "${YELLOW}⏳ Esperando a que n8n esté listo...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:5678 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ n8n está listo${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# Iniciar Backend
echo -e "${BLUE}[3/4]${NC} ${YELLOW}Iniciando Backend Flask...${NC}"
"$SCRIPT_DIR/start-backend-local.sh" &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend iniciado (PID: $BACKEND_PID)${NC}"
echo -e "${YELLOW}   API disponible en: http://localhost:9200/api${NC}"
echo ""

# Esperar a que backend esté listo
echo -e "${YELLOW}⏳ Esperando a que backend esté listo...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:9200/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend está listo${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# Iniciar Frontend
echo -e "${BLUE}[4/4]${NC} ${YELLOW}Iniciando Frontend React...${NC}"
"$SCRIPT_DIR/start-frontend-local.sh" &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
echo -e "${YELLOW}   Aplicación disponible en: http://localhost:3000${NC}"
echo ""

# Resumen
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           ✨ STACK COMPLETAMENTE ACTIVO ✨    ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 URLs de acceso:${NC}"
echo -e "   ${YELLOW}Frontend:${NC}    http://localhost:3000"
echo -e "   ${YELLOW}Backend:${NC}     http://localhost:9200/api"
echo -e "   ${YELLOW}n8n:${NC}         http://localhost:5678"
echo ""
echo -e "${BLUE}📝 Siguiente paso:${NC}"
echo -e "   1. Accede a n8n: http://localhost:5678"
echo -e "   2. Importa los workflows desde: ${YELLOW}n8n/workflows/${NC}"
echo -e "   3. Configura credenciales SMTP en n8n"
echo -e "   4. Activa los 3 workflows"
echo ""
echo -e "${YELLOW}🛑 Para detener todo: Presiona Ctrl+C${NC}"
echo ""

# Mantener el script corriendo
wait
