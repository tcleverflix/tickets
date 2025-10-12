# 🔧 Guía Completa de Configuración de n8n - TickKK

## 📋 Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Base de Datos PostgreSQL](#base-de-datos-postgresql)
3. [Credenciales de Email](#credenciales-de-email)
4. [Importar Workflows](#importar-workflows)
5. [Configurar Webhooks](#configurar-webhooks)
6. [Verificación y Testing](#verificación-y-testing)
7. [Troubleshooting](#troubleshooting)

## 🚀 Configuración Inicial

### Paso 1: Iniciar el Proyecto

```bash
# 1. Clonar y configurar
cd tickkk
cp .env.example .env

# 2. Editar .env con configuraciones básicas
nano .env
```

### Paso 2: Configurar Variables de Entorno Básicas

Edita el archivo `.env`:

```bash
# n8n Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=tu_password_seguro_123

# Email Domain Configuration
EMAIL_DOMAIN=tickkk.com
SUPPORT_TEAM_EMAIL=soporte@tickkk.com
FRONTEND_URL=http://localhost:9100
```

### Paso 3: Iniciar Servicios

```bash
# Iniciar todos los servicios
docker-compose up -d

# Verificar que todos estén corriendo
docker-compose ps
```

### Paso 4: Acceder a n8n

1. **Abrir navegador**: `http://localhost:9300`
2. **Login inicial**:
   - Usuario: `admin`
   - Password: `tu_password_seguro_123`

## 🗄️ Base de Datos PostgreSQL

### Opción 1: Usar PostgreSQL del Docker Compose (Recomendado)

n8n usará automáticamente la base de datos PostgreSQL configurada en el proyecto:

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose exec database psql -U tickkk_user -d tickkk -c "\dt"
```

### Opción 2: Configurar Base de Datos Externa

Si prefieres usar una base de datos externa:

#### 2.1. Crear Base de Datos para n8n

```sql
-- Conectar a PostgreSQL
psql -h localhost -U postgres

-- Crear base de datos específica para n8n
CREATE DATABASE n8n_db;
CREATE USER n8n_user WITH PASSWORD 'n8n_secure_password';
GRANT ALL PRIVILEGES ON DATABASE n8n_db TO n8n_user;
```

#### 2.2. Configurar n8n para usar PostgreSQL

Edita `docker-compose.yml` y añade la configuración de BD para n8n:

```yaml
  n8n:
    image: n8nio/n8n:latest
    environment:
      # ... otras variables ...

      # Database Configuration
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: database
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: n8n_db
      DB_POSTGRESDB_USER: n8n_user
      DB_POSTGRESDB_PASSWORD: n8n_secure_password
```

#### 2.3. Reiniciar n8n

```bash
docker-compose restart n8n
```

## 📧 Credenciales de Email

### Configuración con Gmail (Para Desarrollo)

#### Paso 1: Generar Contraseña de Aplicación

1. **Ir a Google Account**: https://myaccount.google.com/
2. **Seguridad → Verificación en 2 pasos** (debe estar activada)
3. **Contraseñas de aplicaciones → Seleccionar aplicación → Correo**
4. **Copiar la contraseña generada** (16 caracteres)

#### Paso 2: Configurar Variables en .env

```bash
# Gmail Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=abcd-efgh-ijkl-mnop  # Contraseña de aplicación
SMTP_FROM=tu-email@gmail.com
```

#### Paso 3: Crear Credencial SMTP en n8n

1. **Acceder a n8n**: `http://localhost:9300`
2. **Ir a Settings** (engranaje arriba a la derecha)
3. **Credentials → New Credential**
4. **Buscar "SMTP"** y seleccionar
5. **Configurar**:
   ```
   Name: Gmail SMTP
   Host: smtp.gmail.com
   Port: 587
   Secure: No (usar STARTTLS)
   Username: tu-email@gmail.com
   Password: abcd-efgh-ijkl-mnop
   ```
6. **Test → Save**

### Configuración con SendGrid (Para Producción)

#### Paso 1: Crear Cuenta SendGrid

1. **Registrarse**: https://sendgrid.com/
2. **Verificar email y cuenta**
3. **Ir a Settings → API Keys**
4. **Create API Key** con permisos "Mail Send"

#### Paso 2: Configurar Variables

```bash
# SendGrid Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.tu-sendgrid-api-key-aqui
SMTP_FROM=noreply@tudominio.com
```

#### Paso 3: Crear Credencial en n8n

```
Name: SendGrid SMTP
Host: smtp.sendgrid.net
Port: 587
Secure: No
Username: apikey
Password: SG.tu-sendgrid-api-key-aqui
```

## 📥 Importar Workflows

### Método 1: Importación Automática (Docker)

Los workflows se cargan automáticamente desde la carpeta `n8n/workflows/`:

```bash
# Verificar que los workflows estén montados
docker-compose exec n8n ls -la /home/node/.n8n/workflows/
```

### Método 2: Importación Manual

#### Paso 1: Acceder a n8n Dashboard

1. **Ir a**: `http://localhost:9300`
2. **Login** con tus credenciales

#### Paso 2: Importar Workflow "Nuevo Ticket"

1. **Click en "+" → Import from file**
2. **Seleccionar**: `n8n/workflows/nuevo-ticket.json`
3. **Importar**

#### Paso 3: Configurar Credenciales

1. **Abrir el workflow importado**
2. **Click en cada nodo "Email"**
3. **Seleccionar credential**: "Gmail SMTP" o "SendGrid SMTP"
4. **Save**

#### Paso 4: Activar Workflow

1. **Toggle el switch** "Active" en ON
2. **Verificar** que el webhook URL se haya generado

#### Paso 5: Repetir para Otros Workflows

- Importar `actualizar-ticket.json`
- Importar `cerrar-ticket.json`
- Configurar credenciales en ambos
- Activar ambos workflows

## 🔗 Configurar Webhooks

### Verificar URLs de Webhooks

Después de activar los workflows, n8n generará URLs únicas:

```bash
# Verificar en n8n Dashboard:
# Workflow "Nuevo Ticket" → Webhook Node → Copy URL
# Debería ser: http://localhost:9300/webhook/nuevo-ticket
```

### Actualizar Backend con URLs Correctas

Si las URLs son diferentes, actualiza el archivo `.env`:

```bash
# URLs generadas por n8n
N8N_WEBHOOK_NEW_TICKET=http://localhost:9300/webhook/nuevo-ticket
N8N_WEBHOOK_UPDATE_TICKET=http://localhost:9300/webhook/actualizar-ticket
N8N_WEBHOOK_CLOSE_TICKET=http://localhost:9300/webhook/cerrar-ticket
```

### Reiniciar Backend

```bash
docker-compose restart backend
```

## ✅ Verificación y Testing

### Paso 1: Verificar Conexión Backend → n8n

```bash
# Test desde el backend
docker-compose exec backend python -c "
import requests
response = requests.get('http://n8n:5678/healthz')
print(f'n8n Status: {response.status_code}')
"
```

### Paso 2: Test Manual de Webhook

```bash
# Test webhook nuevo ticket
curl -X POST http://localhost:9300/webhook/nuevo-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": 999,
    "clientName": "Test Usuario",
    "clientEmail": "test@example.com",
    "subject": "Test Ticket",
    "description": "Este es un ticket de prueba",
    "priority": "media"
  }'
```

### Paso 3: Verificar Email

1. **Revisar** tu bandeja de entrada
2. **Verificar** que llegó el email de confirmación
3. **Comprobar** formato y contenido

### Paso 4: Test Completo desde Frontend

```bash
# Acceder al frontend
open http://localhost:9100

# Crear un ticket completo:
# 1. Click "Nuevo Ticket"
# 2. Llenar formulario
# 3. Enviar
# 4. Verificar emails
# 5. Añadir comentario
# 6. Cerrar ticket
```

## 🔍 Troubleshooting

### Problema: n8n no inicia

**Síntomas**: Error al acceder a `http://localhost:9300`

**Solución**:
```bash
# Verificar logs
docker-compose logs n8n

# Reiniciar servicio
docker-compose restart n8n

# Verificar puerto
netstat -tulpn | grep 9300
```

### Problema: Webhooks no funcionan

**Síntomas**: Tickets se crean pero no llegan emails

**Solución**:
```bash
# 1. Verificar workflows activos
# En n8n Dashboard → cada workflow debe tener toggle ON

# 2. Verificar credenciales SMTP
# Settings → Credentials → Test connection

# 3. Verificar logs de n8n
docker-compose logs n8n | grep ERROR

# 4. Test manual webhook
curl -X POST http://localhost:9300/webhook/nuevo-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticketId": 1, "clientEmail": "test@test.com"}'
```

### Problema: Credenciales SMTP fallan

**Gmail - Error de autenticación**:
```bash
# Verificar:
# 1. 2FA activado en Google
# 2. Contraseña de aplicación correcta (16 chars)
# 3. Usuario completo (email@gmail.com)
```

**SendGrid - Error 401**:
```bash
# Verificar:
# 1. API Key válida
# 2. Usuario exactamente "apikey"
# 3. Permisos "Mail Send" en SendGrid
```

### Problema: Base de datos no conecta

**Síntomas**: n8n se reinicia continuamente

**Solución**:
```bash
# Verificar PostgreSQL
docker-compose exec database pg_isready -U tickkk_user

# Verificar variables de BD en n8n
docker-compose exec n8n env | grep DB_

# Reset completo de n8n
docker-compose down
docker volume rm tickkk_n8n_data
docker-compose up -d
```

## 📊 Monitoreo y Mantenimiento

### Verificar Estado de Workflows

```bash
# Acceder a n8n
http://localhost:9300

# Dashboard → Executions
# Aquí verás todas las ejecuciones de workflows
# Verde = Exitoso, Rojo = Error
```

### Logs Importantes

```bash
# Logs de n8n
docker-compose logs -f n8n

# Logs de backend (para debug)
docker-compose logs -f backend

# Logs de base de datos
docker-compose logs -f database
```

### Backup de Configuración

```bash
# Backup de workflows y credenciales
docker-compose exec n8n tar -czf /tmp/n8n-backup.tar.gz /home/node/.n8n

# Copiar backup al host
docker cp $(docker-compose ps -q n8n):/tmp/n8n-backup.tar.gz ./n8n-backup.tar.gz
```

## 🔒 Seguridad en Producción

### Cambiar Credenciales por Defecto

```bash
# En producción, cambiar:
N8N_BASIC_AUTH_USER=admin_personalizado
N8N_BASIC_AUTH_PASSWORD=password_super_seguro_123!

# Y reiniciar
docker-compose restart n8n
```

### Configurar HTTPS

Para producción, configurar reverse proxy con SSL:

```nginx
# nginx.conf
server {
    listen 443 ssl;
    server_name n8n.tudominio.com;

    location / {
        proxy_pass http://localhost:9300;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🎯 Próximos Pasos

Una vez configurado n8n:

1. **✅ Verificar** que todos los workflows funcionan
2. **✅ Configurar** email de producción (SendGrid)
3. **✅ Personalizar** templates de email
4. **✅ Añadir** más automações si es necesario
5. **✅ Configurar** monitoreo de emails enviados

---

**¡Configuración de n8n completada!** 🎉

El sistema de automatización está listo para manejar todas las notificaciones de tickets de forma automática.