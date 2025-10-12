#!/bin/bash

# ============================================
# Script para iniciar Backend Flask (Local)
# ============================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  Iniciando Backend Flask para TickKK${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"

# Ir al directorio del backend
cd "$(dirname "$0")/../backend"

# Verificar que existe .env
if [ ! -f ../.env ]; then
    echo -e "${RED}✗ Archivo .env no encontrado${NC}"
    echo -e "${YELLOW}  Copia .env.example a .env y configúralo${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Archivo .env encontrado${NC}"

# Verificar/Crear entorno virtual
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Creando entorno virtual...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✓ Entorno virtual creado${NC}"
fi

# Activar entorno virtual
echo -e "${YELLOW}📦 Activando entorno virtual...${NC}"
source venv/bin/activate

# Instalar dependencias
echo -e "${YELLOW}📦 Instalando/Actualizando dependencias...${NC}"
pip install -q --upgrade pip
pip install -q -r requirements.txt

echo -e "${GREEN}✓ Dependencias instaladas${NC}"

# Verificar conexión a PostgreSQL
echo -e "${YELLOW}🔍 Verificando conexión a base de datos...${NC}"

# Inicializar la base de datos
echo -e "${YELLOW}🗄️  Inicializando base de datos...${NC}"
python3 << EOF
from app import create_app, db
app = create_app('development')
with app.app_context():
    db.create_all()
    print('✓ Base de datos inicializada')
EOF

echo -e "${GREEN}✓ Base de datos lista${NC}"
echo ""
echo -e "${GREEN}🚀 Iniciando servidor Flask...${NC}"
echo -e "${YELLOW}   API disponible en: http://localhost:9200${NC}"
echo -e "${YELLOW}   Endpoints: http://localhost:9200/api/tickets${NC}"
echo ""
echo -e "${YELLOW}📝 Para detener: Presiona Ctrl+C${NC}"
echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""

# Iniciar Flask
export FLASK_APP=app.py
export FLASK_ENV=development
python3 app.py
