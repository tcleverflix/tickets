# 📧 Configuración Detallada de Email - TickKK

## 📋 Proveedores de Email Soportados

### 1. Gmail (Desarrollo/Testing)
### 2. SendGrid (Producción Recomendada)
### 3. Mailgun (Alternativa)
### 4. Amazon SES (Empresarial)

---

## 🔧 Gmail - Configuración Paso a Paso

### ⚠️ Importante: Solo para desarrollo y testing

#### Paso 1: Activar Verificación en 2 Pasos

1. **Ir a**: https://myaccount.google.com/security
2. **Buscar**: "Verificación en 2 pasos"
3. **Activar** si no está activada
4. **Configurar** método de verificación (SMS o App)

#### Paso 2: Generar Contraseña de Aplicación

1. **En la misma página de seguridad**
2. **Buscar**: "Contraseñas de aplicaciones"
3. **Seleccionar app**: "Correo"
4. **Seleccionar dispositivo**: "Otro (nombre personalizado)"
5. **Escribir**: "TickKK n8n"
6. **Generar**
7. **Copiar** la contraseña de 16 caracteres (formato: abcd-efgh-ijkl-mnop)

#### Paso 3: Configurar Variables de Entorno

```bash
# En archivo .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=abcd-efgh-ijkl-mnop
SMTP_FROM=tu-email@gmail.com

# Para workflows de n8n
EMAIL_DOMAIN=gmail.com
SUPPORT_TEAM_EMAIL=tu-email@gmail.com
```

#### Paso 4: Crear Credencial en n8n

1. **Acceder**: http://localhost:9300
2. **Login** con credenciales de admin
3. **Settings** (⚙️) → **Credentials**
4. **New Credential** → Buscar **"SMTP"**
5. **Configurar**:
   ```
   Credential Name: Gmail SMTP
   Host: smtp.gmail.com
   Port: 587
   Secure: false (usar STARTTLS)
   Username: tu-email@gmail.com
   Password: abcd-efgh-ijkl-mnop
   From Email: tu-email@gmail.com
   ```
6. **Test** → **Save**

---

## 🚀 SendGrid - Configuración Profesional

### ✅ Recomendado para producción

#### Paso 1: Crear Cuenta SendGrid

1. **Registrarse**: https://sendgrid.com/
2. **Verificar email**
3. **Completar información** de la empresa
4. **Verificar identidad** si es requerido

#### Paso 2: Crear API Key

1. **Dashboard SendGrid** → **Settings** → **API Keys**
2. **Create API Key**
3. **Nombre**: "TickKK Production"
4. **Permisos**: "Mail Send" (Full Access)
5. **Create & View**
6. **Copiar API Key** (inicia con SG.)

#### Paso 3: Verificar Dominio (Opcional pero Recomendado)

1. **Settings** → **Sender Authentication** → **Domain Authentication**
2. **Authenticate Your Domain**
3. **Añadir tu dominio**: tudominio.com
4. **Seguir instrucciones** DNS
5. **Verificar** configuración

#### Paso 4: Configurar Variables

```bash
# En archivo .env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.tu-api-key-completa-aqui
SMTP_FROM=noreply@tudominio.com

# Para workflows
EMAIL_DOMAIN=tudominio.com
SUPPORT_TEAM_EMAIL=soporte@tudominio.com
```

#### Paso 5: Crear Credencial en n8n

```
Credential Name: SendGrid SMTP
Host: smtp.sendgrid.net
Port: 587
Secure: false
Username: apikey
Password: SG.tu-api-key-completa-aqui
From Email: noreply@tudominio.com
```

---

## 📮 Mailgun - Alternativa Robusta

#### Paso 1: Crear Cuenta

1. **Registrarse**: https://mailgun.com/
2. **Verificar email y teléfono**
3. **Añadir método de pago** (plan gratuito disponible)

#### Paso 2: Configurar Dominio

1. **Dashboard** → **Domains** → **Add New Domain**
2. **Añadir**: mg.tudominio.com
3. **Configurar registros DNS** según instrucciones
4. **Verificar** configuración

#### Paso 3: Obtener Credenciales SMTP

1. **Dashboard** → **Domains** → **[tu dominio]**
2. **Buscar sección** "SMTP credentials"
3. **Copiar**:
   - Login: postmaster@mg.tudominio.com
   - Password: [password generado]

#### Paso 4: Configurar Variables

```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@mg.tudominio.com
SMTP_PASS=tu-password-mailgun
SMTP_FROM=noreply@mg.tudominio.com
```

---

## ☁️ Amazon SES - Nivel Empresarial

#### Paso 1: Configurar SES

1. **AWS Console** → **SES**
2. **Verificar dominio** o email
3. **Solicitar** salida del sandbox si es necesario
4. **Crear** credenciales SMTP

#### Paso 2: Obtener Credenciales

1. **SES** → **SMTP Settings**
2. **Create My SMTP Credentials**
3. **Copiar** username y password generados

#### Paso 3: Configurar Variables

```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=tu-smtp-username
SMTP_PASS=tu-smtp-password
SMTP_FROM=noreply@tudominio.com
```

---

## 🔧 Configuración en n8n

### Paso 1: Acceder a Credenciales

1. **n8n Dashboard**: http://localhost:9300
2. **Settings** (⚙️) → **Credentials**

### Paso 2: Crear Nueva Credencial SMTP

1. **New Credential**
2. **Buscar**: "SMTP"
3. **Seleccionar**: "SMTP"

### Paso 3: Configurar Según Proveedor

#### Para Gmail:
```
Host: smtp.gmail.com
Port: 587
Security: None (STARTTLS)
Username: tu-email@gmail.com
Password: contraseña-de-aplicacion
```

#### Para SendGrid:
```
Host: smtp.sendgrid.net
Port: 587
Security: None (STARTTLS)
Username: apikey
Password: SG.tu-api-key
```

### Paso 4: Test y Guardar

1. **Test** connection
2. **Save** si el test es exitoso
3. **Nombrar** la credencial descriptivamente

---

## 🔄 Aplicar Credenciales a Workflows

### Paso 1: Abrir Workflow

1. **n8n Dashboard** → **Workflows**
2. **Abrir**: "Notificación Nuevo Ticket"

### Paso 2: Configurar Nodos Email

1. **Click** en nodo "Email al Cliente"
2. **Credential for SMTP** → Seleccionar tu credencial
3. **Save**
4. **Repetir** para "Email al Equipo"

### Paso 3: Activar Workflow

1. **Toggle** "Active" → **ON**
2. **Verificar** que aparezca webhook URL

### Paso 4: Repetir para Otros Workflows

- "Notificación Actualización Ticket"
- "Notificación Cierre Ticket"

---

## ✅ Verificar Configuración

### Test Manual del Sistema

```bash
# 1. Test webhook directo
curl -X POST http://localhost:9300/webhook/nuevo-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": 999,
    "clientName": "Test Usuario",
    "clientEmail": "tu-email-personal@gmail.com",
    "subject": "Test de Configuración Email",
    "description": "Este es un test del sistema de emails",
    "priority": "media"
  }'

# 2. Verificar respuesta (debe ser 200 OK)
# 3. Revisar bandeja de entrada del email configurado
```

### Test desde Frontend

1. **Acceder**: http://localhost:9100
2. **Crear ticket** con tu email personal
3. **Verificar** recepción de email
4. **Añadir comentario**
5. **Verificar** email de actualización
6. **Cerrar ticket**
7. **Verificar** email de cierre

---

## 🚨 Troubleshooting Común

### Error: "Authentication failed"

**Gmail**:
- ✅ Verificar que 2FA esté activada
- ✅ Usar contraseña de aplicación, no contraseña normal
- ✅ Username debe ser email completo

**SendGrid**:
- ✅ Username debe ser exactamente "apikey"
- ✅ Password debe empezar con "SG."
- ✅ API Key debe tener permisos "Mail Send"

### Error: "Connection timeout"

**Solución**:
```bash
# Verificar conectividad
docker-compose exec n8n ping smtp.gmail.com
docker-compose exec n8n ping smtp.sendgrid.net

# Verificar puertos
docker-compose exec n8n telnet smtp.gmail.com 587
```

### Error: "From address not verified"

**SendGrid**:
- Verificar dominio en SendGrid
- O usar email verificado manualmente

**Gmail**:
- From email debe coincidir con username

### Emails no llegan

**Verificar**:
1. ✅ Workflow está activo
2. ✅ Credenciales funcionan (test en n8n)
3. ✅ No están en spam/junk
4. ✅ Logs de n8n no muestran errores

```bash
# Ver logs de n8n
docker-compose logs n8n | grep -i error

# Ver execuciones en n8n dashboard
# Settings → Executions (para ver histórico)
```

---

## 📊 Monitoreo de Emails

### Dashboard de n8n

1. **Executions**: Ver historial de ejecuciones
2. **Active Workflows**: Verificar workflows activos
3. **Credentials**: Gestionar credenciales

### Logs del Sistema

```bash
# Logs detallados de n8n
docker-compose logs -f n8n

# Logs de backend (webhooks)
docker-compose logs -f backend

# Filtrar solo errores
docker-compose logs n8n 2>&1 | grep -i error
```

### Métricas Importantes

- **Emails enviados exitosamente**
- **Errores de SMTP**
- **Webhooks ejecutados**
- **Tiempo de respuesta**

---

## 🔒 Mejores Prácticas de Seguridad

### Credenciales

- ✅ **Nunca** hardcodear credenciales en código
- ✅ Usar variables de entorno
- ✅ Rotar API keys regularmente
- ✅ Usar cuentas de servicio, no personales

### Producción

- ✅ **Usar SendGrid/SES**, no Gmail
- ✅ Configurar SPF/DKIM/DMARC
- ✅ Monitorear reputación del dominio
- ✅ Implementar rate limiting

### n8n

- ✅ Cambiar credenciales por defecto
- ✅ Usar HTTPS en producción
- ✅ Restringir acceso por IP si es posible
- ✅ Backup regular de workflows y credenciales

---

**¡Configuración de email completada!** 📧✨

Tu sistema TickKK ahora puede enviar emails automáticamente para todas las interacciones de tickets.