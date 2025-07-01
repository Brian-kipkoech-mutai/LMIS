 # ─── Stage 1: Install Dependencies (Builder) ───────────────────────
FROM node:22-alpine AS deps
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─── Stage 2: Build the Application ───────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm
COPY .env.production.local .env.production.local   
RUN pnpm run build

# ─── Stage 3: Create Final Slim Runtime Image ────────────────────
FROM node:22-slim AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.env.production.local .env.production.local   
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
