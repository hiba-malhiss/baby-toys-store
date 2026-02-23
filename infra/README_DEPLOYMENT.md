# ToyStore / AlKatatib — Docker Deployment (matches current VPS setup)

This README matches **your current deployment** under:

- **Stack folder:** `/opt/toystore-docker`
- **Source code folder:** `/opt/toystore-repo`
- **Docker services:** `nginx`, `toystore-mysql`, `backend`, `store`, `admin`, `phpmyadmin`
- **Domains (current):**
  - `store.alkatatib.cloud` → Store UI (store-docker)
  - `admin.alkatatib.cloud` → Admin UI (admin-docker) served under `/admin/`
  - `api.alkatatib.cloud` → Backend API (backend-docker:8080)
  - `pma.alkatatib.cloud` → phpMyAdmin (phpmyadmin)

✅ **Ports 80/443 are owned by Docker only** (docker-proxy), and nginx runs **inside Docker**.

---

## 1) Current architecture (exactly like your configs)

### Public entrypoint

- Internet → **Docker nginx container** (`nginx-docker`) → routes by domain:
  - `store.alkatatib.cloud` → `store-docker:80` and `/api/` → `backend-docker:8080`
  - `admin.alkatatib.cloud` → `admin-docker:80` and redirects `/` → `/admin/`
  - `api.alkatatib.cloud` → `backend-docker:8080` (with CORS handling in nginx)
  - `pma.alkatatib.cloud` → `phpmyadmin:80`

### Internal services

- `backend-docker` (Spring Boot) connects to:
  - `toystore-mysql:3306` (Docker network)

### Persistence

- MySQL data persists in Docker volume:
  - `mysql-data`

---

## 2) Important config files (this is your real list)

Inside `/opt/toystore-docker`:

- `docker-compose.yml`  
  (defines nginx + mysql + backend + store + admin + phpmyadmin)

- `backend/.env` ❌ **NOT SAFE to commit** (contains secrets)
  - used by compose via: `env_file: ./backend/.env`

- `nginx/conf.d/admin.conf`
- `nginx/conf.d/store.conf`
- `nginx/conf.d/api.conf`
- `nginx/conf.d/pma.conf`
- `nginx/conf.d/pwn.alkatatib.cloud.conf`
- `/opt/toystore-docker/docker-compose.yml`

after updating any of the nginx conf file
reload `docker exec -it nginx-docker nginx -s reload`
=> docker compose logs -f nginx

Host paths used by nginx container (mounted read-only):

- `/etc/letsencrypt` → TLS certificates
- `/var/www/letsencrypt` → ACME challenge webroot (for certbot)

## 4) Deploy on a NEW VPS — step by step (same setup)

### 4.1 Requirements

- Ubuntu VPS
- Root access
- Open ports: `22`, `80`, `443`
- DNS control for domain/subdomains

### 4.2 Login

```bash
ssh root@NEW_SERVER_IP
```

### 4.3 Update server + basic packages

```bash
apt update && apt upgrade -y
apt install -y ca-certificates curl git ufw
```

(Optional firewall)

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

### 4.4 Install Docker + Compose plugin

```bash
apt install -y docker.io docker-compose-plugin
systemctl enable docker
systemctl start docker

docker --version
docker compose version
```

### 4.5 Create folders

```bash
mkdir -p /opt
cd /opt
```

### 4.6 Get your code repo

Your compose builds from these exact paths:

- backend build context: `/opt/toystore-repo/toy-store-backend`
- frontend build context: `/opt/toystore-repo/baby-toys-store`

So clone to that exact location:

```bash
cd /opt
git clone <YOUR_APP_REPO_URL> toystore-repo
```

### 4.7 Put infra files in `/opt/toystore-docker`

If your infra is inside the same repo (example: `/opt/toystore-repo/infra`):

```bash
cp -r /opt/toystore-repo/infra /opt/toystore-docker
```

Or if infra is a separate repo:

```bash
cd /opt
git clone <YOUR_INFRA_REPO_URL> toystore-docker
```

Verify:

```bash
ls -la /opt/toystore-docker
ls -la /opt/toystore-docker/nginx/conf.d
```

---

## 5) DNS (must be done before SSL)

Point these A records to `NEW_SERVER_IP`:

- `store.alkatatib.cloud`
- `admin.alkatatib.cloud`
- `api.alkatatib.cloud`
- `pma.alkatatib.cloud`

Check on VPS (optional):

```bash
apt install -y dnsutils
dig +short store.alkatatib.cloud
dig +short admin.alkatatib.cloud
dig +short api.alkatatib.cloud
dig +short pma.alkatatib.cloud
```

---

## 6) Create required host folders for certs

Your nginx container mounts these:

- `/etc/letsencrypt`
- `/var/www/letsencrypt`

Create them:

```bash
mkdir -p /etc/letsencrypt
mkdir -p /var/www/letsencrypt
```

---

## 7) Create backend secrets file (required)

Your compose expects:

- `/opt/toystore-docker/backend/.env`

Create from a template:

```bash
mkdir -p /opt/toystore-docker/backend
cp /opt/toystore-docker/env/backend.env.example /opt/toystore-docker/backend/.env
nano /opt/toystore-docker/backend/.env
```

Save nano:

- `Ctrl + O` → Enter
- `Ctrl + X`

### 7.1 Variables you MUST review/update in `backend/.env`

These are critical for running correctly:

- Database (must match your MySQL container):
  - `SPRING_DATASOURCE_URL=jdbc:mysql://toystore-mysql:3306/toystore?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC`
  - `SPRING_DATASOURCE_USERNAME=...`
  - `SPRING_DATASOURCE_PASSWORD=...`

- Frontend / CORS:
  - `FRONTEND_URL=https://store.alkatatib.cloud/`
  - `CORS_ALLOWED_ORIGINS=https://store.alkatatib.cloud,https://www.store.alkatatib.cloud,https://admin.alkatatib.cloud`

- Security secrets:
  - `JWT_SECRET=...`
  - `CART_TOKEN_SECRET=...`

- Integrations:
  - `CLOUDINARY_*`
  - `BREVO_*`

---

## 8) First start — IMPORTANT note about SSL on a fresh server

Your nginx conf files already contain `listen 443 ssl;` and reference cert files like:

- `/etc/letsencrypt/live/<domain>/fullchain.pem`

On a **new** VPS those files do not exist yet.

So you have two safe approaches:

### Approach A (recommended): Issue certs first, then start full HTTPS configs

1. Start a temporary HTTP-only nginx that serves ACME challenge
2. Run certbot to create certs
3. Start your normal docker-compose with HTTPS configs

### Approach B: Temporarily comment the `443` blocks in nginx conf, start, issue certs, restore

- Edit files in: `/opt/toystore-docker/nginx/conf.d/*.conf`
- Temporarily disable the `server { listen 443 ssl; ... }` blocks
- Start stack → issue certs → restore HTTPS blocks → restart nginx

---

## 9) Build & start the stack (same as your current setup)

```bash
cd /opt/toystore-docker
docker compose up -d --build
```

Check:

```bash
docker ps
docker compose ps
```

Confirm 80/443 are docker-proxy:

```bash
ss -lntup | egrep ':80|:443' || true
```

---

## 10) Get SSL certificates (Let’s Encrypt) using webroot

Your nginx confs already expose:

- `/.well-known/acme-challenge/` via `/var/www/letsencrypt`

Install certbot:

```bash
apt install -y certbot
```

Issue certs:

```bash
certbot certonly --webroot -w /var/www/letsencrypt -d store.alkatatib.cloud
certbot certonly --webroot -w /var/www/letsencrypt -d admin.alkatatib.cloud
certbot certonly --webroot -w /var/www/letsencrypt -d api.alkatatib.cloud
certbot certonly --webroot -w /var/www/letsencrypt -d pma.alkatatib.cloud
```

Verify cert folders:

```bash
ls -la /etc/letsencrypt/live/
```

Restart nginx container:

```bash
cd /opt/toystore-docker
docker compose restart nginx
```

---

## 11) Verify everything works

```bash
curl -I http://store.alkatatib.cloud
curl -k -I https://store.alkatatib.cloud
curl -k -I https://admin.alkatatib.cloud
curl -k -I https://api.alkatatib.cloud
curl -k -I https://pma.alkatatib.cloud
```

---

## 12) Updating your services later (same server)

### 12.1 Pull latest code

```bash
cd /opt/toystore-repo
git pull
```

### 12.2 Rebuild/restart one service

Backend:

```bash
cd /opt/toystore-docker
docker compose build --no-cache backend
docker compose up -d --force-recreate backend
docker logs -f --tail 80 backend-docker
```

Store:

```bash
cd /opt/toystore-docker
docker compose build store
docker compose up -d store
```

Admin:

```bash
cd /opt/toystore-docker
docker compose build --no-cache admin
docker compose up -d admin
```

Nginx (after nginx conf edits):

```bash
cd /opt/toystore-docker
docker compose restart nginx
docker logs --tail 200 nginx-docker
```

---

## 13) Changing domain names (what exactly to update)

If you change from `*.alkatatib.cloud` to new domains:

### 13.1 Update nginx conf files

Edit these:

- `/opt/toystore-docker/nginx/conf.d/store.conf`
- `/opt/toystore-docker/nginx/conf.d/admin.conf`
- `/opt/toystore-docker/nginx/conf.d/api.conf`
- `/opt/toystore-docker/nginx/conf.d/pma.conf`

Change:

- `server_name ...;`
- certificate paths:
  - `/etc/letsencrypt/live/<NEW_DOMAIN>/fullchain.pem`
  - `/etc/letsencrypt/live/<NEW_DOMAIN>/privkey.pem`

Then restart nginx:

```bash
docker compose restart nginx
```

### 13.2 Update backend CORS + frontend url

Edit:

- `/opt/toystore-docker/backend/.env`

Update:

- `FRONTEND_URL=https://<NEW_STORE_DOMAIN>/`
- `CORS_ALLOWED_ORIGINS=https://<NEW_STORE_DOMAIN>,https://www.<NEW_STORE_DOMAIN>,https://<NEW_ADMIN_DOMAIN>`

Recreate backend:

```bash
docker compose up -d --force-recreate backend
```

### 13.3 Update your frontend build-time envs (in your repo)

Update those to new API/domain if you use them, then rebuild store/admin.

### 13.4 Update DNS A records

Point new domain(s) to new server IP.

### 13.5 Issue new certificates (certbot)

Run certbot for new domains then restart nginx.

---

## 14) Database migration to a new server (important)

Your DB is inside Docker volume: `mysql-data`.
If you move servers, you must backup and restore.

Example (simple dump):

```bash
# dump from old server
docker exec -i toystore-mysql mysqldump -uroot -proot toystore > toystore_dump.sql

# copy to new server (from your laptop)
scp toystore_dump.sql root@NEW_SERVER_IP:/opt/

# restore on new server
cat /opt/toystore_dump.sql | docker exec -i toystore-mysql mysql -uroot -proot toystore
```

(If your root password is not `root`, use the correct one from your compose.)

---

## 15) Quick troubleshooting

Logs:

```bash
docker logs -f --tail 200 nginx-docker
docker logs -f --tail 200 backend-docker
docker logs -f --tail 200 toystore-mysql
```

Check nginx config inside container:

```bash
docker exec -it nginx-docker sh -lc "nginx -T | head -n 200"
```

Test internal connectivity (nginx → backend):

```bash
docker exec -it nginx-docker sh -lc "curl -sS -o /dev/null -w 'backend:%{http_code}\n' http://backend-docker:8080/"
```

---

If you updated the package.json file run OR --frozen-lockfile issue

```bash
pnpm install
git status
git add pnpm-lock.yaml
git commit -m "Update pnpm lockfile"
git push
```

---

A. Update Store Frontend

```bash
cd /opt/toystore-repo/baby-toys-store
git pull

cd /opt/toystore-docker
docker compose build store
docker compose up -d store
docker compose logs -f --tail 80 store
```

---

## B. Update Admin Panel

```bash
cd /opt/toystore-repo/baby-toys-store
git pull

cd /opt/toystore-docker
docker compose build admin
docker compose up -d admin
docker compose logs -f --tail 80 admin
```

---

## C. Update Backend API

```bash
cd /opt/toystore-repo/toy-store-backend
git pull

cd /opt/toystore-docker
docker compose build --no-cache backend
docker compose up -d backend
docker logs -f --tail 120 backend-docker
```

### ℹ️ Notes

- Use `--no-cache` **only** for clean rebuilds

- Faster rebuilds: after updating the docker call:

```bash
cd /opt/toystore-repo/toy-store-backend
nano Dockerfile
```

run nginx
```bash
docker exec -it nginx-docker nginx -s reload
```

clean radius:
```bash
docker exec -it redis redis-cli FLUSHALL
```

check redis record
```bash
docker exec -it redis redis-cli KEYS 'rl:password-reset:*'
```

after update .env
```bash
docker compose down
docker compose up -d --build
docker compose ps
docker exec -it nginx-docker nginx -s reload
```