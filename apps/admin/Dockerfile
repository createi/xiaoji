FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/shared ./packages/shared
COPY packages/utils ./packages/utils
COPY apps/admin ./apps/admin
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @xiaoji/shared build || true
RUN pnpm --filter @xiaoji/admin build

FROM nginx:alpine
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
