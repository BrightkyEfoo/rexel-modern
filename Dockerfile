# 1. Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# 2. Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/db.json ./db.json

RUN ls -al

COPY --from=builder /app/db.json ./db.json

RUN mkdir -p /app/public

RUN ls -al

RUN npm i -g concurrently

EXPOSE 3000
