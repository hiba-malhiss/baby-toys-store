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
# Vite bakes these into the bundle at build time.
# Pass them via --build-arg in docker build / GitHub Actions.
ARG VITE_API_BASE_URL
ARG VITE_APP_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_URL=$VITE_APP_URL

WORKDIR /app

COPY . .
RUN pnpm --filter ${APP} run build:ci

# ===== Runtime =====
FROM nginx:alpine AS runner
ARG APP

COPY --from=builder /app/apps/${APP}/dist /usr/share/nginx/html
COPY docker/nginx-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
