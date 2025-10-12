#!/bin/bash

# ============================================
# Script para iniciar Frontend React (Local)
# ============================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  Iniciando Frontend React para TickKK${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"

# Ir al directorio del frontend
cd "$(dirname "$0")/../frontend"

# Verificar que existe package.json
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗ package.json no encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ package.json encontrado${NC}"

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias npm...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencias instaladas${NC}"
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "REACT_APP_API_BASE_URL=http://localhost:9200/api" > .env
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Iniciando servidor React...${NC}"
echo -e "${YELLOW}   Aplicación disponible en: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}📝 Para detener: Presiona Ctrl+C${NC}"
echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""

# Iniciar React
PORT=3000 npm start
