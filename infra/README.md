# Alkatatib Infrastructure (Docker-Only VPS)

This project runs **everything inside Docker containers**.

- ✅ Docker owns everything (including ports **80/443** via docker-proxy)

---

## 1) Stack Overview

### Containers

- **nginx** — reverse proxy + TLS
- **backend** — Spring Boot API
- **toystore-mysql** — MySQL 8 database
- **phpmyadmin** — DB UI
- **store** — Store frontend
- **admin** — Admin panel

### Public Domains

| Service    | URL                           |
| ---------- | ----------------------------- |
| Store      | https://store.alkatatib.cloud |
| Admin      | https://admin.alkatatib.cloud |
| API        | https://api.alkatatib.cloud   |
| phpMyAdmin | https://pma.alkatatib.cloud   |

### Important Constraints

- Ports **80 / 443** are owned only by Docker (`docker-proxy`)
- Nginx runs **inside** Docker
- TLS certificates are **host files** mounted into nginx container

---

## 2) What’s in this `infra/` folder

### Tracked (safe to commit)

- `docker-compose.yml`
- `nginx/conf.d/*.conf`
- `nginx/nginx.conf` (if used)
- `env/*.env.example` (templates only, no secrets)

### Not tracked (never commit)

- Real `.env` files with secrets
- `/etc/letsencrypt` private keys
- Database dumps with real data
- SSH passwords / keys

## Git token

The git token is stored under: `/opt/toy-store-infra/.ghcr-token`
update token via: `ssh root@82.180.155.197 "printf '%s' 'NEW_TOKEN' > /opt/toy-store-infra/.ghcr-token"`

## ENV variable

toy-store-infra → Actions tab
You should see "Update Customer Env Variable" in the left sidebar. Click it → Run workflow button (top right) → fill in the fields.
