# Reporte de Cambios y Correcciones (2025-10-10)

**Resumen**
- Se corrigió el arranque del backend con Gunicorn usando `wsgi.py`.
- Se ajustó la configuración de Nginx en el frontend y sus healthchecks.
- Se resolvió el error de dependencia faltante (`jwt` → `PyJWT`).
- Se instalaron herramientas de verificación (`curl`) en imágenes para healthchecks.
- Se reconstruyeron contenedores y se validó la salud de servicios en puertos `9000` y `9100`.

**Cambios en Backend**
- Archivo `backend/wsgi.py`: creado para exponer la app Flask a Gunicorn (`app=flask_app`).
- Archivo `backend/Dockerfile`:
  - `CMD` actualizado a `gunicorn --bind 0.0.0.0:5000 --workers 4 wsgi:app`.
  - Se añadió instalación de `curl` para healthchecks.
  - `HEALTHCHECK` usa `curl -f http://localhost:5000/api/health`.
- Archivo `backend/requirements.txt`:
  - Se añadió `PyJWT==2.8.0` para resolver `ModuleNotFoundError: No module named 'jwt'`.

**Cambios en Frontend**
- Archivo `frontend/nginx.conf`:
  - Se eliminó el parámetro no soportado `must-revalidate` dentro de `gzip_proxied`.
  - Se definió endpoint de health `location /health { return 200 "healthy\n"; }`.
- Archivo `frontend/Dockerfile`:
  - Se retiró el `USER nginx` para evitar permisos en `/var/cache/nginx`.
  - Se instaló `curl` con `apk add --no-cache curl`.
  - `HEALTHCHECK` actualizado a `curl -fsS http://localhost:3000/health` (más fiable que flags de BusyBox `wget`).

**Cambios en Docker Compose**
- Archivo `docker-compose.yml`:
  - Healthcheck de `frontend` actualizado a `curl -fsS http://localhost:3000/health`.
  - Se mantienen mapeos de puertos: `backend` → `0.0.0.0:9000:5000`, `frontend` → `0.0.0.0:9100:3000`.

**Reconstrucción y Estado**
- Comandos ejecutados:
  - `docker compose build backend`
  - `docker compose build frontend`
  - `docker compose up -d backend frontend`
  - `docker compose ps`
- Resultados:
  - Backend: `Up (healthy)` en `http://localhost:9000/api/health`.
  - Frontend: `Up (healthy)` tras cambiar healthcheck a `curl`.

**Validación de Salud**
- Backend:
  - `GET http://localhost:9000/api/health` → `{"status":"healthy"}`.
- Frontend:
  - `GET http://localhost:9100/health` → `healthy`.
  - `GET http://localhost:9100/` → `200`.

**Acceso y URLs**
- Frontend (local): `http://localhost:9100/`
- Backend API (local): `http://localhost:9000/api/`
- Health endpoints:
  - Backend: `http://localhost:9000/api/health`
  - Frontend: `http://localhost:9100/health`
- Acceso externo por IP:
  - Reemplazar `localhost` por la IP del host (`ipconfig` → `IPv4 Address`).
  - Ejemplos: `http://<IP_DEL_HOST>:9100/`, `http://<IP_DEL_HOST>:9000/api/`.
  - Asegurar puertos abiertos en Firewall de Windows (inbound `9100` y `9000`).

**Advertencias Observadas**
- `docker-compose.yml`: el atributo `version` está obsoleto; se recomienda eliminar la línea `version: '3.8'`.
- `SENDGRID_API_KEY` no definido: aparece como advertencia; sólo necesario si se envían emails vía SendGrid.

**Notas Técnicas**
- El proxy del frontend (`/api`) usa `proxy_pass http://backend:5000/api/` dentro de la red de Docker; para acceder externamente, usar directamente `http://<IP>:9000/api/`.
- Evitar `&&` en comandos encadenados en PowerShell; usar comandos separados.

**Próximos Pasos (opcionales)**
- Eliminar `version: '3.8'` de `docker-compose.yml` para evitar la advertencia.
- Documentar apertura de puertos en Firewall de Windows en `docs/DEPLOYMENT.md`.