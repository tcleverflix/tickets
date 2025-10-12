# 🚀 Guía Rápida de Configuración TickKK

## ⚡ Inicio Rápido (5 minutos)

### 1. Preparar el Proyecto

```bash
# Clonar repositorio
git clone [tu-repositorio-url]
cd tickkk

# Configurar variables de entorno
cp .env.example .env
```

### 2. Configurar Email (Elige una opción)

#### Opción A: Gmail (Para desarrollo)
```bash
# Editar .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion  # Ver docs/EMAIL_CONFIG.md
SMTP_FROM=tu-email@gmail.com
```

#### Opción B: SendGrid (Para producción)
```bash
# Editar .env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.tu-api-key-sendgrid
SMTP_FROM=noreply@tudominio.com
```

### 3. Ejecutar Script de Configuración

```bash
# Hacer ejecutable y correr
chmod +x scripts/setup-n8n.sh
./scripts/setup-n8n.sh
```

### 4. Configurar n8n (Después del script)

1. **Acceder a n8n**: http://localhost:9300
2. **Login**: admin / (ver password en .env)
3. **Seguir pasos automáticos** en la interfaz

---

## 📋 Checklist de Configuración Completa

### ✅ Pre-requisitos
- [ ] Docker y Docker Compose instalados
- [ ] Git instalado
- [ ] Cuenta de email (Gmail/SendGrid)

### ✅ Configuración Básica
- [ ] Archivo .env configurado
- [ ] Variables de email establecidas
- [ ] Script setup-n8n.sh ejecutado
- [ ] Todos los servicios corriendo

### ✅ Configuración de n8n
- [ ] Acceso a http://localhost:9300
- [ ] Credenciales SMTP configuradas
- [ ] Workflows importados y activos
- [ ] Webhooks funcionando

### ✅ Verificación Final
- [ ] Frontend accesible: http://localhost:9100
- [ ] Backend responde: http://localhost:9200/api/health
- [ ] Test de ticket completo funciona
- [ ] Emails se envían correctamente

---

## 🔧 URLs y Accesos

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend** | http://localhost:9100 | - |
| **Backend API** | http://localhost:9200 | - |
| **n8n Dashboard** | http://localhost:9300 | admin / (ver .env) |
| **PostgreSQL** | localhost:5432 | tickkk_user / tickkk_password |

---

## 📚 Documentación Detallada

- **🔧 Configuración n8n**: [docs/N8N_SETUP.md](docs/N8N_SETUP.md)
- **📧 Configuración Email**: [docs/EMAIL_CONFIG.md](docs/EMAIL_CONFIG.md)
- **🗄️ PostgreSQL**: [docs/POSTGRESQL_SETUP.md](docs/POSTGRESQL_SETUP.md)
- **🚀 Despliegue**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **🏗️ Arquitectura**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

## 🆘 Ayuda Rápida

### Comandos Útiles

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs
docker-compose logs -f [servicio]

# Reiniciar servicio
docker-compose restart [servicio]

# Parar todo
docker-compose down

# Iniciar todo
docker-compose up -d
```

### Problemas Comunes

| Problema | Solución Rápida |
|----------|-----------------|
| n8n no accesible | `docker-compose restart n8n` |
| Emails no llegan | Verificar credenciales en n8n |
| Backend error 500 | Verificar DATABASE_URL en .env |
| Frontend no carga | `docker-compose restart frontend` |

### Soporte

- **Issues**: GitHub Issues del proyecto
- **Documentación**: Carpeta `docs/`
- **Logs**: `docker-compose logs [servicio]`

---

**¡TickKK configurado y listo para usar!** 🎉