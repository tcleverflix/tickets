#!/bin/bash

# ============================================
# Script de Prueba de Integración n8n
# ============================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🧪 Test de Integración n8n + Backend     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════╝${NC}"
echo ""

# URL del backend
BACKEND_URL="http://localhost:9200/api"
N8N_URL="http://localhost:5678"

# Función para verificar servicios
check_service() {
    local url=$1
    local name=$2

    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ $name está corriendo${NC}"
        return 0
    else
        echo -e "${RED}✗ $name NO está corriendo${NC}"
        echo -e "${YELLOW}  Inicia $name primero${NC}"
        return 1
    fi
}

# Verificar servicios
echo -e "${YELLOW}[1/3] Verificando servicios...${NC}"
check_service "$BACKEND_URL/health" "Backend Flask" || exit 1
check_service "$N8N_URL" "n8n" || exit 1
echo ""

# Crear ticket de prueba
echo -e "${YELLOW}[2/3] Creando ticket de prueba...${NC}"

RESPONSE=$(curl -s -X POST "$BACKEND_URL/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Test Usuario",
    "client_email": "test@example.com",
    "subject": "Prueba de integración n8n",
    "description": "Este es un ticket de prueba para verificar que n8n recibe el webhook correctamente",
    "priority": "alta"
  }')

# Extraer ID del ticket
TICKET_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)

if [ -n "$TICKET_ID" ]; then
    echo -e "${GREEN}✓ Ticket creado exitosamente${NC}"
    echo -e "${BLUE}  ID del ticket: ${YELLOW}$TICKET_ID${NC}"
    echo -e "${BLUE}  Respuesta completa:${NC}"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
else
    echo -e "${RED}✗ Error al crear ticket${NC}"
    echo "$RESPONSE"
    exit 1
fi

echo ""

# Esperar un momento para que n8n procese
echo -e "${YELLOW}⏳ Esperando 3 segundos para que n8n procese...${NC}"
sleep 3

# Verificar ejecuciones en n8n
echo -e "${YELLOW}[3/3] Verificando ejecuciones en n8n...${NC}"
echo -e "${BLUE}  Ve a: ${YELLOW}http://localhost:5678${NC}"
echo -e "${BLUE}  Y revisa: ${YELLOW}Executions → Latest executions${NC}"
echo ""

# Instrucciones para el usuario
echo -e "${GREEN}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ TEST COMPLETADO               ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📝 Qué verificar ahora:${NC}"
echo ""
echo -e "${YELLOW}1. En n8n (http://localhost:5678):${NC}"
echo -e "   - Ve a 'Executions' en el menú lateral"
echo -e "   - Debería aparecer una ejecución reciente"
echo -e "   - Verifica que sea exitosa (✓ verde)"
echo ""
echo -e "${YELLOW}2. En tu bandeja de email:${NC}"
echo -e "   - Revisa si llegó el email de confirmación"
echo -e "   - Puede tardar 10-30 segundos"
echo ""
echo -e "${YELLOW}3. Si NO funcionó:${NC}"
echo -e "   - Verifica que los workflows estén ACTIVOS en n8n"
echo -e "   - Verifica las credenciales SMTP en n8n"
echo -e "   - Revisa los logs en la terminal del backend"
echo ""

# Test adicional: Añadir comentario
echo -e "${BLUE}¿Quieres probar añadir un comentario? (s/n)${NC}"
read -r CONTINUE

if [ "$CONTINUE" = "s" ] || [ "$CONTINUE" = "S" ]; then
    echo ""
    echo -e "${YELLOW}Añadiendo comentario al ticket $TICKET_ID...${NC}"

    COMMENT_RESPONSE=$(curl -s -X POST "$BACKEND_URL/tickets/$TICKET_ID/comments" \
      -H "Content-Type: application/json" \
      -d '{
        "author_name": "Equipo Soporte",
        "author_email": "soporte@tickkk.com",
        "comment_text": "Hemos recibido tu solicitud y estamos trabajando en ella. Te mantendremos informado.",
        "is_internal": false
      }')

    echo -e "${GREEN}✓ Comentario añadido${NC}"
    echo "$COMMENT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$COMMENT_RESPONSE"
    echo ""
    echo -e "${YELLOW}⏳ Esperando 3 segundos...${NC}"
    sleep 3
    echo -e "${BLUE}📧 Revisa tu email para ver la notificación de actualización${NC}"
fi

echo ""

# Test adicional: Cerrar ticket
echo -e "${BLUE}¿Quieres probar cerrar el ticket? (s/n)${NC}"
read -r CONTINUE_CLOSE

if [ "$CONTINUE_CLOSE" = "s" ] || [ "$CONTINUE_CLOSE" = "S" ]; then
    echo ""
    echo -e "${YELLOW}Cerrando ticket $TICKET_ID...${NC}"

    CLOSE_RESPONSE=$(curl -s -X PUT "$BACKEND_URL/tickets/$TICKET_ID/status" \
      -H "Content-Type: application/json" \
      -d '{
        "status": "cerrado"
      }')

    echo -e "${GREEN}✓ Ticket cerrado${NC}"
    echo "$CLOSE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CLOSE_RESPONSE"
    echo ""
    echo -e "${YELLOW}⏳ Esperando 3 segundos...${NC}"
    sleep 3
    echo -e "${BLUE}📧 Revisa tu email para ver la confirmación de cierre${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Prueba completada. Revisa n8n y tu email.${NC}"
echo ""
