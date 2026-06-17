FROM node:22-alpine AS builder

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/prisma ./packages/prisma
COPY packages/shared ./packages/shared
COPY packages/utils ./packages/utils
COPY apps/api ./apps/api

RUN corepack enable && pnpm install --frozen-lockfile

RUN cd packages/prisma && pnpm exec prisma generate
RUN cd apps/api && pnpm exec nest build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/prisma ./packages/prisma
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

RUN corepack enable

EXPOSE 7001

CMD ["node", "apps/api/dist/main.js"]
