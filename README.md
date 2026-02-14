# Deployment Guide

This repository contains a full-stack app:
- Backend: Spring Boot (Java 17) with PostgreSQL
- Frontend: React (Node 18 build) served by Nginx
- Orchestration: Docker Compose

## Prerequisites
- Docker and Docker Compose installed
- A server with open ports: 80 (HTTP), 8080 (optional for direct backend access), 5432 (optional for DB access)

## Configuration
1. Copy environment template and fill values:
   cp .env.example .env
   # Edit .env and provide real secrets/values

   Required variables in `.env`:
   - DB_PASSWORD= (Postgres password for user `postgres`)
   - JWT_SECRET= (random string for token signing)
   - CLOUD_NAME= (Cloudinary/cloud storage name)
   - CLOUD_API_KEY= (Cloudinary API key)
   - CLOUD_API_SECRET= (Cloudinary API secret)
   - REACT_APP_API_URL= (frontend build-time API base URL, e.g. http://your-domain/api)
   - ADMIN_USERNAME= (bootstrap admin username)
   - ADMIN_PASSWORD= (bootstrap admin password)
   - ADMIN_EMAIL= (bootstrap admin email)

2. Verify Nginx proxy:
   - `client/nginx.conf` proxies `/api` to `backend:8080`. If your external API URL is `/api`, set `REACT_APP_API_URL=http://your-domain/api`.
   - Alternatively, if you want to call backend directly, set `REACT_APP_API_URL=http://your-domain:8080` and adjust Nginx/config accordingly.

## Build and Run
From the repository root:

```bash
# Build images and start services
docker compose up -d --build

# Check service status
docker compose ps

# Tail logs (optional)
docker compose logs -f --tail=100
```

Services:
- db: Postgres 15 (port 5432, data persisted in named volume `db_data`)
- backend: Java 17 (port 8080, depends on db)
- frontend: Nginx serving React build (port 80), proxies `/api` to backend

## Data persistence
- PostgreSQL data is stored in Docker volume `db_data`. It survives container restarts.
- Uploaded files are currently not mapped to a host path in Compose. If you need persistence for uploads, add a volume/bind:

```yaml
# Example: persist server uploads
services:
  backend:
    volumes:
      - ./server/uploads:/app/uploads
```

Ensure your backend writes to `/app/uploads` or adjust path accordingly.

## Health checks & smoke tests
- Frontend: open `http://your-domain/` in a browser; app should load.
- Backend: `curl http://your-domain/api/auth/signin` (or your health endpoint) to confirm routing via Nginx.
- DB: `docker exec -it $(docker compose ps -q db) psql -U postgres -d diploma_db -c "\dt"`

## Common adjustments
- SSL/HTTPS: terminate TLS with a reverse proxy (e.g., Nginx on host or a load balancer). For containerized Nginx, add certs and listen on 443.
- Admin bootstrap: environment variables `APP_ADMIN_*` seed an admin user; ensure values are set in `.env`.
- JVM memory: tune `JAVA_TOOL_OPTIONS` or `-Xmx` via `ENTRYPOINT` if needed.

## Updating
```bash
docker compose pull
docker compose build
docker compose up -d
```

## Troubleshooting
- If frontend shows blank page, verify `REACT_APP_API_URL` at build time and Nginx `try_files` rule.
- If API calls fail in the browser, check CORS on backend and Nginx proxy target.
- If DB fails to start, confirm `DB_PASSWORD` and that port 5432 is not occupied.

