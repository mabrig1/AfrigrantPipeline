FROM node:20-alpine AS builder

WORKDIR /app

# Copy server package files (build context is repo root)
COPY server/package*.json ./
RUN npm ci

COPY server/tsconfig.json ./
COPY server/src/ ./src/

RUN npm run build

# ── Production image ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/index.js"]
