#!/bin/bash

# ============================================
# Script para iniciar n8n localmente
# ============================================

set -e  # Salir si hay error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  Iniciando n8n para TickKK (Local)${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"

# Verificar si n8n está instalado
if ! command -v n8n &> /dev/null; then
    echo -e "${YELLOW}⚠️  n8n no está instalado globalmente.${NC}"
    echo -e "${YELLOW}   Usando npx para ejecutar n8n...${NC}"
    N8N_COMMAND="npx n8n"
else
    echo -e "${GREEN}✓ n8n está instalado${NC}"
    N8N_COMMAND="n8n"
fi

# Configurar variables de entorno para n8n
export N8N_PORT=5678
export N8N_HOST="localhost"
export N8N_PROTOCOL="http"
export WEBHOOK_URL="http://localhost:5678/"

# Opcional: Configurar base de datos para n8n (SQLite por defecto)
# Para PostgreSQL:
# export DB_TYPE="postgresdb"
# export DB_POSTGRESDB_HOST="localhost"
# export DB_POSTGRESDB_PORT=5432
# export DB_POSTGRESDB_DATABASE="n8n"
# export DB_POSTGRESDB_USER="n8n_user"
# export DB_POSTGRESDB_PASSWORD="n8n_password"

echo -e "${GREEN}📍 Configuración:${NC}"
echo -e "   Puerto: ${YELLOW}$N8N_PORT${NC}"
echo -e "   Webhook Base URL: ${YELLOW}$WEBHOOK_URL${NC}"
echo ""
echo -e "${GREEN}🚀 Iniciando n8n...${NC}"
echo -e "${YELLOW}   Accede a: http://localhost:$N8N_PORT${NC}"
echo ""
echo -e "${YELLOW}📝 Para detener n8n: Presiona Ctrl+C${NC}"
echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""

# Iniciar n8n
$N8N_COMMAND start
