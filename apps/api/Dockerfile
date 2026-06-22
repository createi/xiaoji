FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/prisma ./packages/prisma
COPY packages/shared ./packages/shared
COPY packages/utils ./packages/utils
COPY apps/api ./apps/api
RUN pnpm install --frozen-lockfile || pnpm install
RUN cd packages/prisma && npx prisma generate
RUN pnpm --filter @xiaoji/shared build || true
RUN pnpm --filter @xiaoji/api build

FROM node:22-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/prisma ./packages/prisma
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
RUN mkdir -p uploads
EXPOSE 7001
CMD ["node", "apps/api/dist/main.js"]
