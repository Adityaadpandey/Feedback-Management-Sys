# Stage 1: Builder
FROM oven/bun:canary-alpine AS builder

WORKDIR /app

# Copy package.json, bun.lockb, and other files
COPY package.json bun.lockb ./
COPY .env ./

RUN bun install

COPY . .

RUN bun run build

# Stage 2: Production
FROM oven/bun:canary-alpine AS runner

WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lockb ./bun.lockb

# Optional: Copy next.config.js if it exists

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "start"]
