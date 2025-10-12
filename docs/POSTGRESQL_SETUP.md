# 🗄️ Configuración de PostgreSQL para TickKK

## 📋 Opciones de Configuración

### 1. PostgreSQL con Docker (Recomendado para desarrollo)
### 2. PostgreSQL Local (Sistema)
### 3. PostgreSQL en la Nube (Producción)

---

## 🐳 Opción 1: PostgreSQL con Docker (Incluido)

### ✅ Ya está configurado en docker-compose.yml

El proyecto incluye PostgreSQL configurado automáticamente:

```yaml
# En docker-compose.yml
database:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: tickkk
    POSTGRES_USER: tickkk_user
    POSTGRES_PASSWORD: tickkk_password
  ports:
    - "5432:5432"
```

### Iniciar PostgreSQL

```bash
# Iniciar solo la base de datos
docker-compose up -d database

# Verificar que esté funcionando
docker-compose exec database pg_isready -U tickkk_user -d tickkk
```

### Conectar a la Base de Datos

```bash
# Desde Docker
docker-compose exec database psql -U tickkk_user -d tickkk

# Desde host (si tienes psql instalado)
psql -h localhost -p 5432 -U tickkk_user -d tickkk
```

### Comandos Útiles

```sql
-- Ver tablas
\dt

-- Ver estructura de tabla tickets
\d tickets

-- Ver datos de ejemplo
SELECT * FROM tickets;

-- Ver comentarios
SELECT * FROM comments;

-- Verificar conexiones activas
SELECT * FROM pg_stat_activity WHERE datname = 'tickkk';
```

---

## 🖥️ Opción 2: PostgreSQL Local (Sistema)

### Instalación en Ubuntu/Debian

```bash
# Actualizar repositorios
sudo apt update

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Iniciar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Instalación en macOS

```bash
# Con Homebrew
brew install postgresql
brew services start postgresql

# O con MacPorts
sudo port install postgresql15
sudo port load postgresql15
```

### Instalación en Windows

1. **Descargar**: https://www.postgresql.org/download/windows/
2. **Ejecutar** installer
3. **Seguir** wizard de instalación
4. **Recordar** contraseña de postgres

### Configuración Inicial

```bash
# Conectar como postgres
sudo -u postgres psql

# O en Windows/macOS
psql -U postgres
```

```sql
-- Crear base de datos y usuario para TickKK
CREATE DATABASE tickkk;
CREATE USER tickkk_user WITH PASSWORD 'tickkk_password';

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE tickkk TO tickkk_user;

-- Conectar a la base TickKK
\c tickkk

-- Dar permisos al schema public
GRANT ALL ON SCHEMA public TO tickkk_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tickkk_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tickkk_user;

-- Salir
\q
```

### Configurar Variables de Entorno

```bash
# En archivo .env
DATABASE_URL=postgresql://tickkk_user:tickkk_password@localhost:5432/tickkk

# Deshabilitar PostgreSQL en Docker
# Comentar sección 'database' en docker-compose.yml
```

### Inicializar Esquema

```bash
# Ejecutar script de inicialización
psql -h localhost -U tickkk_user -d tickkk -f backend/init.sql
```

---

## ☁️ Opción 3: PostgreSQL en la Nube

### Render PostgreSQL (Recomendado para producción)

#### Crear Base de Datos en Render

1. **Render Dashboard** → **New** → **PostgreSQL**
2. **Configurar**:
   ```
   Name: tickkk-database
   Database: tickkk
   User: tickkk_user
   Region: Oregon
   Plan: Starter (gratuito)
   ```
3. **Create Database**

#### Obtener Credenciales

1. **Database created** → **Info tab**
2. **Copiar**:
   - Internal Database URL
   - External Database URL
   - Connection Parameters

#### Configurar Variables

```bash
# En .env para producción
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Supabase (Alternativa)

1. **Crear cuenta**: https://supabase.com/
2. **New project**
3. **Copiar** connection string
4. **Configurar** en .env

### AWS RDS

1. **AWS Console** → **RDS**
2. **Create database** → **PostgreSQL**
3. **Free tier** para desarrollo
4. **Configurar** security groups
5. **Obtener** endpoint y credenciales

### Google Cloud SQL

1. **GCP Console** → **SQL**
2. **Create instance** → **PostgreSQL**
3. **Configurar** networking
4. **Obtener** connection details

---

## 🔧 Configuración de n8n con PostgreSQL

### Para que n8n use PostgreSQL

#### Opción A: PostgreSQL Compartido (Simple)

n8n usará la misma base de datos pero con tablas separadas:

```yaml
# En docker-compose.yml
n8n:
  environment:
    # ... otras variables ...
    DB_TYPE: postgresdb
    DB_POSTGRESDB_HOST: database
    DB_POSTGRESDB_PORT: 5432
    DB_POSTGRESDB_DATABASE: tickkk
    DB_POSTGRESDB_USER: tickkk_user
    DB_POSTGRESDB_PASSWORD: tickkk_password
    DB_POSTGRESDB_SCHEMA: n8n
```

#### Opción B: Base de Datos Separada (Recomendado)

```sql
-- Crear base de datos específica para n8n
CREATE DATABASE n8n_db;
GRANT ALL PRIVILEGES ON DATABASE n8n_db TO tickkk_user;
```

```yaml
# En docker-compose.yml
n8n:
  environment:
    DB_TYPE: postgresdb
    DB_POSTGRESDB_HOST: database
    DB_POSTGRESDB_PORT: 5432
    DB_POSTGRESDB_DATABASE: n8n_db
    DB_POSTGRESDB_USER: tickkk_user
    DB_POSTGRESDB_PASSWORD: tickkk_password
```

### Verificar Configuración de n8n

```bash
# Verificar logs de n8n
docker-compose logs n8n | grep -i database

# Verificar tablas creadas por n8n
docker-compose exec database psql -U tickkk_user -d tickkk -c "\dt"
```

---

## 🔍 Monitoreo y Mantenimiento

### Verificar Estado de PostgreSQL

```bash
# Docker
docker-compose exec database pg_isready -U tickkk_user

# Local
pg_isready -h localhost -p 5432 -U tickkk_user

# Ver conexiones activas
docker-compose exec database psql -U tickkk_user -d tickkk -c "
SELECT
    datname,
    usename,
    application_name,
    client_addr,
    state,
    query_start
FROM pg_stat_activity
WHERE datname IN ('tickkk', 'n8n_db');"
```

### Información de Uso

```sql
-- Tamaño de bases de datos
SELECT
    datname,
    pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database
WHERE datname IN ('tickkk', 'n8n_db');

-- Tamaño de tablas
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Número de registros
SELECT
    'tickets' as table_name,
    COUNT(*) as count
FROM tickets
UNION ALL
SELECT
    'comments' as table_name,
    COUNT(*) as count
FROM comments;
```

### Backup y Restore

```bash
# Backup completo
docker-compose exec database pg_dump -U tickkk_user -d tickkk > tickkk_backup.sql

# Backup solo datos
docker-compose exec database pg_dump -U tickkk_user -d tickkk --data-only > tickkk_data.sql

# Backup solo estructura
docker-compose exec database pg_dump -U tickkk_user -d tickkk --schema-only > tickkk_schema.sql

# Restore
docker-compose exec -T database psql -U tickkk_user -d tickkk < tickkk_backup.sql
```

---

## 🚨 Troubleshooting

### Error: "Connection refused"

**Síntomas**: Backend no puede conectar a PostgreSQL

**Soluciones**:
```bash
# Verificar que PostgreSQL esté funcionando
docker-compose ps database

# Verificar logs
docker-compose logs database

# Reiniciar PostgreSQL
docker-compose restart database

# Verificar puerto
netstat -tulpn | grep 5432
```

### Error: "Role does not exist"

**Síntomas**: Error de autenticación

**Solución**:
```sql
-- Conectar como admin
docker-compose exec database psql -U postgres

-- Verificar usuarios
\du

-- Recrear usuario si es necesario
DROP USER IF EXISTS tickkk_user;
CREATE USER tickkk_user WITH PASSWORD 'tickkk_password';
GRANT ALL PRIVILEGES ON DATABASE tickkk TO tickkk_user;
```

### Error: "Database does not exist"

**Solución**:
```sql
-- Verificar bases de datos
\l

-- Crear si no existe
CREATE DATABASE tickkk;
GRANT ALL PRIVILEGES ON DATABASE tickkk TO tickkk_user;
```

### Error: "Permission denied"

**Solución**:
```sql
-- Conectar a la base tickkk
\c tickkk

-- Dar todos los permisos
GRANT ALL ON SCHEMA public TO tickkk_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tickkk_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tickkk_user;

-- Para futuras tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO tickkk_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO tickkk_user;
```

### n8n no inicia con PostgreSQL

**Verificar configuración**:
```bash
# Ver variables de entorno de n8n
docker-compose exec n8n env | grep DB_

# Ver logs específicos
docker-compose logs n8n | grep -i postgres

# Probar conexión manual
docker-compose exec n8n psql postgresql://tickkk_user:tickkk_password@database:5432/tickkk
```

---

## 🔒 Seguridad en Producción

### Cambiar Credenciales por Defecto

```bash
# En producción, usar credenciales seguras
POSTGRES_DB=tickkk_prod
POSTGRES_USER=tickkk_prod_user
POSTGRES_PASSWORD=password_super_seguro_123!
```

### Configurar SSL

```bash
# Para conexiones externas, usar SSL
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### Restringir Acceso

```sql
-- Crear usuario con permisos limitados
CREATE USER tickkk_app WITH PASSWORD 'secure_app_password';

-- Solo permisos necesarios
GRANT CONNECT ON DATABASE tickkk TO tickkk_app;
GRANT USAGE ON SCHEMA public TO tickkk_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO tickkk_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tickkk_app;
```

### Configurar Firewall

```bash
# Solo permitir conexiones desde aplicación
# En ufw (Ubuntu)
sudo ufw allow from 10.0.0.0/8 to any port 5432

# En iptables
iptables -A INPUT -p tcp --dport 5432 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 5432 -j DROP
```

---

## 📊 Optimización

### Índices Recomendados

```sql
-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_client_email ON tickets(client_email);
CREATE INDEX IF NOT EXISTS idx_comments_ticket_id ON comments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
```

### Configuración PostgreSQL

```bash
# En docker-compose.yml, añadir configuraciones
database:
  command: postgres -c shared_preload_libraries=pg_stat_statements -c max_connections=200 -c shared_buffers=256MB
```

### Monitoreo de Performance

```sql
-- Queries más lentas
SELECT
    query,
    calls,
    total_time,
    mean_time,
    stddev_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Uso de índices
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

**¡PostgreSQL configurado y optimizado!** 🗄️✨

Tu base de datos está lista para soportar tanto el backend de TickKK como n8n de manera eficiente y segura.