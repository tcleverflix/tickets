# TickKK (Release para GitHub)

Esta carpeta contiene una copia limpia del proyecto lista para publicar en GitHub. Incluye Docker para desarrollo y producciÃ³n, documentaciÃ³n y workflows de n8n.

## Contenido principal
- docker-compose.yml / docker-compose.prod.yml
- backend/ (cÃ³digo del API y esquema SQL)
- frontend/ (React + Nginx)
- n8n/workflows/ (JSON de workflows)
- docs/ y documentaciÃ³n adicional

## Preparar publicaciÃ³n

```powershell
# Ir a la carpeta release
cd release/tickkk-github

# Inicializar repo
git init
git add .
git commit -m "PublicaciÃ³n inicial"
git branch -M main

# Configurar remoto (reemplaza la URL)
git remote add origin https://github.com/<tu-usuario>/<nombre-repo>.git
git push -u origin main
```

## Importante
- No subir archivos .env (ya estÃ¡ ignorado por .gitignore).
- Configura secretos en GitHub (Actions/Environments) si automatizas despliegue.
- Revisa DOCUMENTACION_DOCKER.md para puertos, servicios y workflows.
