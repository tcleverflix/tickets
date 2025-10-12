# Guía de Despliegue - TickKK

## 🚀 Despliegue en Render

### Prerequisitos

1. Cuenta en [Render.com](https://render.com)
2. Repositorio Git con el código del proyecto
3. Configuración de email (SendGrid, Gmail, etc.)

### Paso 1: Preparar el Repositorio

```bash
# Clonar el repositorio
git clone <tu-repo-url>
cd tickkk

# Crear archivo .env desde el ejemplo
cp .env.example .env

# Editar .env con tus valores de producción
nano .env
```

### Paso 2: Configurar Variables de Entorno

En el archivo `.env`, configura las siguientes variables para producción:

```bash
# Base de datos (Render la configurará automáticamente)
DATABASE_URL=postgresql://...

# Secrets
SECRET_KEY=tu-clave-super-secreta-de-producción

# URLs de producción (Render las configurará automáticamente)
FRONTEND_URL=https://tu-app.onrender.com
BACKEND_URL=https://tu-api.onrender.com
N8N_WEBHOOK_URL=https://tu-n8n.onrender.com/

# Email (configurar según tu proveedor)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu-sendgrid-api-key
SMTP_FROM=noreply@tudominio.com

# Branding
EMAIL_DOMAIN=tudominio.com
SUPPORT_TEAM_EMAIL=soporte@tudominio.com
```

### Paso 3: Desplegar con render.yaml

1. **Conectar Repositorio**: Ve a tu dashboard de Render y conecta tu repositorio Git.

2. **Usar render.yaml**: Render detectará automáticamente el archivo `render.yaml` y creará todos los servicios.

3. **Verificar Servicios**: Se crearán los siguientes servicios:
   - `tickkk-backend` - API Flask
   - `tickkk-frontend` - Aplicación React
   - `tickkk-n8n` - Motor de automatización
   - `tickkk-database` - Base de datos PostgreSQL

### Paso 4: Configurar Email en n8n

1. **Acceder a n8n**: Ve a `https://tu-n8n.onrender.com`
2. **Login**: Usa las credenciales configuradas en las variables de entorno
3. **Configurar SMTP**: Ve a Settings > Credentials y configura SMTP
4. **Importar Workflows**: Los workflows se importarán automáticamente

### Paso 5: Configuración Manual Post-Despliegue

#### Configurar Credenciales SMTP en n8n

1. Ve a n8n dashboard → Credentials
2. Crea nueva credencial "SMTP"
3. Configura:
   - Host: `smtp.sendgrid.net` (o tu proveedor)
   - Port: `587`
   - User: `apikey` (para SendGrid)
   - Password: Tu API key
   - From: `noreply@tudominio.com`

#### Verificar Webhooks

1. Ve a cada workflow en n8n
2. Verifica que las URLs de webhook sean correctas
3. Activa los workflows

## 🔧 Despliegue Manual (Alternativo)

### Crear Servicios Individualmente

#### 1. Base de Datos
```bash
# En Render Dashboard
New → PostgreSQL
Name: tickkk-database
Database: tickkk
User: tickkk_user
Plan: Starter
```

#### 2. Backend
```bash
# En Render Dashboard
New → Web Service
Repository: tu-repo
Name: tickkk-backend
Environment: Docker
Dockerfile Path: ./backend/Dockerfile
```

Variables de entorno:
```
FLASK_ENV=production
SECRET_KEY=[auto-generate]
DATABASE_URL=[from database]
N8N_BASE_URL=https://tickkk-n8n.onrender.com
CORS_ORIGINS=https://tickkk-frontend.onrender.com
```

#### 3. Frontend
```bash
# En Render Dashboard
New → Web Service
Repository: tu-repo
Name: tickkk-frontend
Environment: Docker
Dockerfile Path: ./frontend/Dockerfile
```

Variables de entorno:
```
REACT_APP_API_BASE_URL=https://tickkk-backend.onrender.com/api
```

#### 4. n8n
```bash
# En Render Dashboard
New → Web Service
Repository: tu-repo
Name: tickkk-n8n
Environment: Docker
Dockerfile Path: ./Dockerfile.n8n
```

Variables de entorno:
```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=[auto-generate]
N8N_HOST=tickkk-n8n.onrender.com
N8N_PROTOCOL=https
WEBHOOK_URL=https://tickkk-n8n.onrender.com/
EMAIL_DOMAIN=tudominio.com
SUPPORT_TEAM_EMAIL=soporte@tudominio.com
FRONTEND_URL=https://tickkk-frontend.onrender.com
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu-sendgrid-api-key
SMTP_FROM=noreply@tudominio.com
```

## 📧 Configuración de Email

### SendGrid (Recomendado)

1. **Crear cuenta** en [SendGrid](https://sendgrid.com)
2. **Crear API Key** con permisos de envío
3. **Verificar dominio** (opcional pero recomendado)
4. **Configurar variables**:
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=tu-sendgrid-api-key
   SMTP_FROM=noreply@tudominio.com
   ```

### Gmail (Solo para desarrollo)

1. **Activar 2FA** en tu cuenta Gmail
2. **Crear contraseña de aplicación**
3. **Configurar variables**:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu-email@gmail.com
   SMTP_PASS=tu-contraseña-de-aplicacion
   SMTP_FROM=tu-email@gmail.com
   ```

### Mailgun

1. **Crear cuenta** en [Mailgun](https://mailgun.com)
2. **Verificar dominio**
3. **Obtener credenciales SMTP**
4. **Configurar variables**:
   ```bash
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=postmaster@tu-dominio
   SMTP_PASS=tu-mailgun-password
   SMTP_FROM=noreply@tu-dominio
   ```

## 🔍 Verificación del Despliegue

### 1. Health Checks

- Backend: `https://tu-backend.onrender.com/api/health`
- Frontend: `https://tu-frontend.onrender.com/health`
- n8n: `https://tu-n8n.onrender.com/healthz`

### 2. Funcionalidad

1. **Crear ticket** desde el frontend
2. **Verificar email** de confirmación
3. **Añadir comentario** y verificar notificación
4. **Cerrar ticket** y verificar email de cierre

### 3. Logs

```bash
# Ver logs en Render Dashboard
Service → Logs
```

## 🚨 Troubleshooting

### Problemas Comunes

#### Error de CORS
```bash
# Verificar CORS_ORIGINS en backend
CORS_ORIGINS=https://tu-frontend.onrender.com
```

#### Emails no se envían
1. Verificar credenciales SMTP en n8n
2. Verificar logs de n8n
3. Comprobar webhooks activos

#### Base de datos no conecta
1. Verificar DATABASE_URL
2. Revisar logs del backend
3. Verificar que la base de datos esté activa

#### n8n no responde
1. Verificar que el servicio esté activo
2. Revisar variables de entorno
3. Comprobar health check

### Comandos de Depuración

```bash
# Conectar a la base de datos
psql $DATABASE_URL

# Ver tablas
\dt

# Ver tickets
SELECT * FROM tickets;

# Ver comentarios
SELECT * FROM comments;
```

## 📈 Monitoreo

### Métricas a Vigilar

1. **Uptime** de todos los servicios
2. **Tiempo de respuesta** del API
3. **Errores** en logs
4. **Uso de memoria** y CPU
5. **Envío de emails** exitoso

### Alertas

Configura alertas en Render para:
- Servicios caídos
- Alto uso de recursos
- Errores frecuentes

## 🔄 Actualizaciones

### Despliegue Continuo

1. **Push a main**: Los cambios se despliegan automáticamente
2. **Verificar logs**: Monitorear el proceso de despliegue
3. **Smoke testing**: Verificar funcionalidad básica

### Rollback

Si algo sale mal:
1. Ve a Render Dashboard
2. Service → Deployments
3. Selecciona deployment anterior
4. Click "Redeploy"

## 💰 Costos Estimados

### Plan Starter (Recomendado para inicio)
- Backend: $7/mes
- Frontend: $7/mes
- n8n: $7/mes
- PostgreSQL: $7/mes
- **Total**: ~$28/mes

### Plan Pro (Para producción)
- Backend: $25/mes
- Frontend: $25/mes
- n8n: $25/mes
- PostgreSQL: $25/mes
- **Total**: ~$100/mes

## 🔒 Seguridad

### Checklist de Seguridad

- [ ] Cambiar todas las claves por defecto
- [ ] Usar HTTPS en todas las URLs
- [ ] Configurar CORS correctamente
- [ ] Activar autenticación en n8n
- [ ] Usar variables de entorno para secrets
- [ ] Configurar dominios personalizados
- [ ] Implementar rate limiting
- [ ] Monitorear logs de seguridad