# Sistema de Tickets Premium - Documentación del Proyecto

## 🏗️ Arquitectura General

### Componentes del Sistema
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   React     │    │   Flask     │    │     n8n     │
│  Frontend   │◄──►│   Backend   │◄──►│ Automation  │
│             │    │     API     │    │   Engine    │
└─────────────┘    └─────────────┘    └─────────────┘
        │                  │                  │
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Nginx    │    │ PostgreSQL  │    │   SendGrid  │
│   Server    │    │  Database   │    │    SMTP     │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 📁 Estructura de Directorios Completa

```
tickkk/
├── 📄 README.md                    # Documentación principal
├── 📄 SETUP_GUIDE.md               # Guía rápida de inicio
├── 📄 PROJECT_STRUCTURE.md         # Este archivo
├── 📄 .gitignore                   # Archivos ignorados por Git
├── 📄 .env.example                 # Variables de entorno ejemplo
├── 📄 docker-compose.yml           # Configuración desarrollo
├── 📄 docker-compose.prod.yml      # Configuración producción
├── 📄 render.yaml                  # Configuración para Render
├── 📄 Dockerfile.n8n               # Dockerfile personalizado n8n
│
├── 📁 frontend/                    # Aplicación React
│   ├── 📄 package.json             # Dependencias Node.js
│   ├── 📄 Dockerfile               # Imagen Docker frontend
│   ├── 📄 nginx.conf               # Configuración Nginx
│   ├── 📄 .env.example             # Variables frontend
│   ├── 📁 public/
│   │   ├── 📄 index.html           # HTML principal
│   │   └── 📄 manifest.json        # Manifiesto PWA
│   └── 📁 src/
│       ├── 📄 index.js             # Punto de entrada React
│       ├── 📁 components/          # Componentes React
│       │   ├── 📄 App.js           # Componente principal
│       │   ├── 📄 Header.js        # Encabezado con navegación
│       │   ├── 📄 TicketList.js    # Lista de tickets con filtros
│       │   ├── 📄 TicketListItem.js # Item individual de ticket
│       │   ├── 📄 TicketDetail.js  # Vista detalle de ticket
│       │   ├── 📄 NewTicketForm.js # Formulario nuevo ticket
│       │   └── 📄 StatusBadge.js   # Badge de estado
│       ├── 📁 services/            # Servicios y API calls
│       │   └── 📄 api.js           # Cliente API con interceptors
│       ├── 📁 styles/              # Estilos CSS
│       │   └── 📄 index.css        # Estilos globales y variables
│       └── 📁 utils/               # Utilidades frontend
│
├── 📁 backend/                     # API Flask
│   ├── 📄 app.py                   # Aplicación principal Flask
│   ├── 📄 config.py                # Configuración Flask
│   ├── 📄 requirements.txt         # Dependencias Python
│   ├── 📄 Dockerfile               # Imagen Docker backend
│   ├── 📄 .env.example             # Variables backend
│   ├── 📄 init.sql                 # Script inicialización BD
│   ├── 📁 app/
│   │   ├── 📄 __init__.py          # Inicialización app Flask
│   │   ├── 📁 models/              # Modelos de base de datos
│   │   │   ├── 📄 __init__.py      # Exportación modelos
│   │   │   ├── 📄 ticket.py        # Modelo Ticket
│   │   │   └── 📄 comment.py       # Modelo Comment
│   │   ├── 📁 routes/              # Endpoints API
│   │   │   └── 📄 tickets.py       # Rutas de tickets
│   │   ├── 📁 services/            # Lógica de negocio
│   │   │   └── 📄 n8n_service.py   # Integración con n8n
│   │   └── 📁 utils/               # Utilidades backend
│   └── 📁 migrations/              # Migraciones de BD
│
├── 📁 n8n/                         # Automatización n8n
│   ├── 📁 workflows/               # Definiciones de workflows
│   │   ├── 📄 nuevo-ticket.json    # Workflow nuevo ticket
│   │   ├── 📄 actualizar-ticket.json # Workflow actualización
│   │   └── 📄 cerrar-ticket.json   # Workflow cierre
│   └── 📁 credentials/             # Credenciales SMTP (ignorado)
│
├── 📁 docs/                        # Documentación detallada
│   ├── 📄 N8N_SETUP.md             # Configuración completa n8n
│   ├── 📄 EMAIL_CONFIG.md          # Configuración email providers
│   ├── 📄 POSTGRESQL_SETUP.md      # Setup PostgreSQL
│   └── 📄 DEPLOYMENT.md            # Guía de despliegue
│
└── 📁 scripts/                     # Scripts de automatización
    └── 📄 setup-n8n.sh             # Script configuración automática
```

## 🗄️ Esquema de Base de Datos PostgreSQL

### Tabla: `tickets`
```sql
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status ticket_status DEFAULT 'abierto',
    priority ticket_priority DEFAULT 'media',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_to VARCHAR(255),
    category VARCHAR(100)
);

-- Tipos ENUM
CREATE TYPE ticket_status AS ENUM ('abierto', 'en_proceso', 'cerrado');
CREATE TYPE ticket_priority AS ENUM ('baja', 'media', 'alta', 'critica');
```

### Tabla: `comments`
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Índices de Rendimiento
```sql
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_client_email ON tickets(client_email);
CREATE INDEX idx_comments_ticket_id ON comments(ticket_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

## 🔌 API Endpoints Completa

### Tickets
| Método | Endpoint | Descripción | Payload | Respuesta |
|--------|----------|-------------|---------|-----------|
| `GET` | `/api/tickets` | Obtener todos los tickets | - | Array de tickets |
| `GET` | `/api/tickets/<id>` | Obtener ticket específico | - | Ticket con comentarios |
| `POST` | `/api/tickets` | Crear nuevo ticket | `{client_name, client_email, subject, description, priority?, category?}` | Ticket creado |
| `PUT` | `/api/tickets/<id>/status` | Actualizar estado | `{status}` | Ticket actualizado |
| `PUT` | `/api/tickets/<id>` | Actualizar ticket completo | `{subject?, description?, priority?, category?, assigned_to?}` | Ticket actualizado |

### Comentarios
| Método | Endpoint | Descripción | Payload | Respuesta |
|--------|----------|-------------|---------|-----------|
| `GET` | `/api/tickets/<id>/comments` | Obtener comentarios de ticket | - | Array de comentarios |
| `POST` | `/api/tickets/<id>/comments` | Añadir comentario | `{author_name, author_email, comment_text, is_internal?}` | Comentario creado |

### Sistema
| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| `GET` | `/api/health` | Health check | `{status: "healthy", timestamp}` |

## 🔄 Flujos de n8n Detallados

### 1. Workflow: Nuevo Ticket
- **Trigger**: Webhook POST `/webhook/nuevo-ticket`
- **Payload**: `{ticketId, clientName, clientEmail, subject, description, priority}`
- **Acciones Paralelas**:
  1. **Email al Cliente**:
     - Confirmación de recepción
     - Información del ticket
     - Tiempo estimado de respuesta
  2. **Email al Equipo**:
     - Notificación de nuevo ticket
     - Detalles completos
     - Enlace al panel de administración

### 2. Workflow: Actualización de Ticket
- **Trigger**: Webhook POST `/webhook/actualizar-ticket`
- **Payload**: `{ticketId, clientName, clientEmail, subject, commentText}`
- **Acción**:
  - Email al cliente con nueva respuesta del equipo
  - Incluye texto del comentario
  - Invitación a responder

### 3. Workflow: Cierre de Ticket
- **Trigger**: Webhook POST `/webhook/cerrar-ticket`
- **Payload**: `{ticketId, clientName, clientEmail, subject}`
- **Acción**:
  - Email de confirmación de resolución
  - Encuesta de satisfacción
  - Información de contacto para futuras consultas

## 🔐 Variables de Entorno Completas

### Archivo Principal (.env)
```bash
# ===========================================
# GENERAL CONFIGURATION
# ===========================================
FLASK_ENV=development
TIMEZONE=America/Mexico_City

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
POSTGRES_DB=tickkk
POSTGRES_USER=tickkk_user
POSTGRES_PASSWORD=tickkk_password
DATABASE_URL=postgresql://tickkk_user:tickkk_password@database:5432/tickkk

# ===========================================
# BACKEND CONFIGURATION
# ===========================================
SECRET_KEY=your-super-secret-key-change-this-in-production
CORS_ORIGINS=http://localhost:9100

# ===========================================
# N8N CONFIGURATION
# ===========================================
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
N8N_HOST=localhost
N8N_BASE_URL=http://localhost:9300
N8N_WEBHOOK_NEW_TICKET=http://localhost:9300/webhook/nuevo-ticket
N8N_WEBHOOK_UPDATE_TICKET=http://localhost:9300/webhook/actualizar-ticket
N8N_WEBHOOK_CLOSE_TICKET=http://localhost:9300/webhook/cerrar-ticket

# ===========================================
# EMAIL CONFIGURATION
# ===========================================
# Gmail (desarrollo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=your-email@gmail.com

# SendGrid (producción)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_USER=apikey
# SMTP_PASS=SG.your-sendgrid-api-key
# SMTP_FROM=noreply@yourdomain.com

# ===========================================
# BRANDING CONFIGURATION
# ===========================================
EMAIL_DOMAIN=tickkk.com
SUPPORT_TEAM_EMAIL=soporte@tickkk.com
FRONTEND_URL=http://localhost:9100

# ===========================================
# REACT APP CONFIGURATION
# ===========================================
REACT_APP_API_BASE_URL=http://localhost:9200/api
REACT_APP_ENV=development
```

## 🐳 Docker Compose Completo

### Servicios Configurados
- **database**: PostgreSQL 15 (puerto 5432)
- **backend**: Flask API (puerto 9200)
- **frontend**: React + Nginx (puerto 9100)
- **n8n**: Automation engine (puerto 9300)
- **redis**: Cache para producción (puerto 6379)

### Volúmenes
- `postgres_data`: Datos de PostgreSQL
- `n8n_data`: Datos y workflows de n8n
- `redis_data`: Cache Redis
- `backend_logs`: Logs del backend

### Redes
- `tickkk-network`: Red interna para comunicación entre servicios

## 🎨 Diseño Frontend Detallado

### Sistema de Design
```css
:root {
  /* Colores principales */
  --primary: #3b82f6;
  --primary-dark: #1e40af;
  --primary-light: #93c5fd;

  /* Estados */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;

  /* Grises */
  --secondary: #6b7280;
  --text: #111827;
  --text-light: #6b7280;
  --text-muted: #9ca3af;

  /* Fondos */
  --background: #f9fafb;
  --background-secondary: #f3f4f6;
  --white: #ffffff;

  /* Bordes */
  --border: #e5e7eb;
  --border-light: #f3f4f6;

  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Border radius */
  --radius: 8px;
  --radius-lg: 12px;
}
```

### Componentes UI
- **Botones**: Primarios, secundarios, con iconos
- **Inputs**: Text, textarea, select con validación
- **Cards**: Para tickets, comentarios, formularios
- **Badges**: Estados de tickets con colores
- **Loading**: Estados de carga con animaciones

### Responsive Design
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: 768px, 1024px, 1280px
- **Grid System**: CSS Grid y Flexbox

## 📋 Estados de la Aplicación

### Frontend State Management
```javascript
// Estado global en App.js
const [appState, setAppState] = useState({
  tickets: [],              // Lista de tickets
  selectedTicket: null,     // Ticket seleccionado
  currentView: 'list',      // 'list' | 'detail' | 'new'
  loading: false,           // Estado de carga global
  error: null,              // Errores globales
  filters: {                // Filtros aplicados
    search: '',
    status: 'all',
    priority: 'all'
  }
});

// Estados de formularios
const [formState, setFormState] = useState({
  data: {},
  errors: {},
  submitting: false
});
```

### Backend State
- **Database**: PostgreSQL con conexiones pooled
- **Cache**: Redis para sesiones y datos frecuentes
- **Logging**: Structured logging con niveles
- **Error Handling**: Manejo centralizado de errores

## 🔧 Configuración de Desarrollo

### Requisitos del Sistema
- **Node.js**: 18+ (recomendado 20 LTS)
- **Python**: 3.11+ (recomendado 3.11)
- **Docker**: 24+ con Compose V2
- **Git**: Para control de versiones

### Setup Automático
```bash
# 1. Clonar y configurar
git clone [repo-url]
cd tickkk
cp .env.example .env

# 2. Ejecutar script de configuración
chmod +x scripts/setup-n8n.sh
./scripts/setup-n8n.sh

# 3. Acceder a servicios
# Frontend: http://localhost:9100
# Backend: http://localhost:9200
# n8n: http://localhost:9300
```

### Desarrollo Sin Docker
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run --host=0.0.0.0 --port=9200

# Frontend
cd frontend
npm install
npm start
```

### Comandos Útiles
```bash
# Ver logs en tiempo real
docker-compose logs -f [servicio]

# Reiniciar servicio específico
docker-compose restart [servicio]

# Ejecutar comando en contenedor
docker-compose exec [servicio] [comando]

# Backup de base de datos
docker-compose exec database pg_dump -U tickkk_user tickkk > backup.sql

# Restaurar base de datos
docker-compose exec -T database psql -U tickkk_user tickkk < backup.sql
```

## 🚀 Despliegue y Producción

### Render.com (Recomendado)
- **Configuración**: `render.yaml` incluido
- **Servicios**: Frontend, Backend, n8n, PostgreSQL
- **Variables**: Configuración automática
- **SSL**: HTTPS incluido
- **Scaling**: Horizontal y vertical

### Otras Plataformas
- **Heroku**: Compatible con buildpacks
- **DigitalOcean App Platform**: Docker nativo
- **AWS ECS**: Con docker-compose
- **Google Cloud Run**: Servicios independientes

### Optimizaciones de Producción
- **Database**: PostgreSQL con índices optimizados
- **Frontend**: Build optimizado con Nginx
- **Backend**: Gunicorn con múltiples workers
- **Cache**: Redis para sesiones y datos frecuentes
- **Monitoring**: Health checks y métricas

## 📊 Monitoreo y Métricas

### Health Checks
- **Backend**: `/api/health`
- **Frontend**: `/health`
- **n8n**: `/healthz`
- **Database**: `pg_isready`

### Métricas Importantes
- **Response Time**: Tiempo de respuesta API
- **Throughput**: Requests por segundo
- **Error Rate**: Porcentaje de errores
- **Database**: Conexiones y queries
- **Email**: Deliverability y bounce rate

### Logging
- **Structured Logs**: JSON format
- **Log Levels**: DEBUG, INFO, WARNING, ERROR
- **Centralized**: Agregación de logs
- **Retention**: Política de retención

## 🔒 Seguridad

### Características Implementadas
- ✅ **CORS**: Configurado correctamente
- ✅ **Input Validation**: Sanitización de datos
- ✅ **SQL Injection**: Prevención con ORM
- ✅ **XSS Prevention**: Escape de contenido
- ✅ **HTTPS**: En producción
- ✅ **Environment Variables**: Para secrets
- ✅ **Health Checks**: Monitoreo de servicios

### Pendientes de Implementar
- 🔄 **Authentication**: JWT o OAuth
- 🔄 **Authorization**: Roles y permisos
- 🔄 **Rate Limiting**: Prevención de abuso
- 🔄 **Audit Logs**: Registro de cambios
- 🔄 **Data Encryption**: Cifrado de datos sensibles

## 📚 Documentación

### Guías Disponibles
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)**: Inicio rápido
- **[docs/N8N_SETUP.md](docs/N8N_SETUP.md)**: Configuración n8n
- **[docs/EMAIL_CONFIG.md](docs/EMAIL_CONFIG.md)**: Setup email
- **[docs/POSTGRESQL_SETUP.md](docs/POSTGRESQL_SETUP.md)**: Base de datos
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**: Despliegue

### APIs y Referencias
- **OpenAPI/Swagger**: Documentación automática de API
- **Component Library**: Storybook para componentes
- **Database Schema**: Diagramas ER
- **Architecture Diagrams**: Diagramas de arquitectura

## 🚧 Roadmap y Futuras Mejoras

### Versión 1.1 (Próxima)
- [ ] Sistema de autenticación
- [ ] Panel de administración
- [ ] Métricas y dashboards
- [ ] Templates de respuesta
- [ ] Subida de archivos adjuntos

### Versión 1.2 (Futuro)
- [ ] API pública con documentación
- [ ] Integración con Slack/Teams
- [ ] Aplicación móvil
- [ ] Chat en vivo
- [ ] Base de conocimiento
- [ ] SLA y escalación automática

### Versión 2.0 (Visión)
- [ ] Multi-tenancy
- [ ] Advanced analytics
- [ ] AI-powered responses
- [ ] Omnichannel support
- [ ] Advanced workflow builder

---

## 📞 Soporte y Contacto

- **Documentación**: Carpeta `docs/`
- **Issues**: GitHub Issues
- **Email**: soporte@tickkk.com
- **Scripts**: `scripts/setup-n8n.sh` para configuración

---

**TickKK - Sistema de Tickets Premium** 🎫✨

*Arquitectura completa, documentación detallada, listo para producción.*