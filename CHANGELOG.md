# Changelog

All notable changes to this project will be documented in this file.

## [v1.0.0] - 2025-10-12

- Initial public release (cleaned for GitHub).
- Added detailed documentation: `DOCUMENTACION_DOCKER.md`, ERD and n8n diagrams, migrations section.
- Included n8n workflows: Nuevo Ticket, Actualizar con Delay, Cierre Ticket, Asignar Agente.
- Packaging scripts: `scripts/create-github-release.ps1`, `scripts/publish-github-release.ps1`.
- Provided example `.env.example` and Docker Compose files for local and production.
- Frontend and backend cleaned of secrets, caches, and vendor directories.

### Notes

- Replace placeholder values in `.env.example` before deployment.
- Ensure `gh` CLI is authenticated for publishing releases.