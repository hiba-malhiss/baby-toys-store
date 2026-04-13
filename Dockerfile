# ===== Base =====
FROM node:18-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

# ===== Dependency install =====
# Copy only manifests first so this layer is cached unless deps change
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ui-kit/package.json             ./packages/ui-kit/
COPY apps/store-front/package.json            ./apps/store-front/
COPY apps/store-admin/package.json            ./apps/store-admin/
COPY apps/store-game/package.json             ./apps/store-game/

RUN pnpm install --frozen-lockfile

# ===== Build =====
FROM deps AS builder
ARG APP
WORKDIR /app

COPY . .
RUN pnpm --filter ${APP} run build:ci

# ===== Runtime =====
FROM nginx:alpine AS runner
ARG APP

COPY --from=builder /app/apps/${APP}/dist /usr/share/nginx/html
# store-admin is built with base:/admin/ so it needs its own nginx config
COPY docker/nginx-spa.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx-admin.conf /etc/nginx/conf.d/nginx-admin.conf.bak
RUN if [ "$APP" = "store-admin" ]; then \
      cp /etc/nginx/conf.d/nginx-admin.conf.bak /etc/nginx/conf.d/default.conf; \
    fi && \
    rm /etc/nginx/conf.d/nginx-admin.conf.bak

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
