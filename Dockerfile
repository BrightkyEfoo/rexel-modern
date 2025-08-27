ARG NODE_IMAGE=node:20-alpine

FROM $NODE_IMAGE AS base

# All deps stage
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm i --legacy-peer-deps

# Production only deps stage  
FROM base AS production-deps
WORKDIR /app
COPY package*.json ./
RUN npm i --legacy-peer-deps --omit=dev --only=production

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .

# Copy environment file if it exists
COPY .env.production .env.production 2>/dev/null || echo "No .env.production file found"

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=production-deps --chown=nextjs:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone /app/
COPY --from=build --chown=nextjs:nodejs /app/.next/static /app/.next/static
COPY --from=build --chown=nextjs:nodejs /app/public /app/public
# Copy environment file
COPY --from=build --chown=nextjs:nodejs /app/.env.production /app/.env.production 2>/dev/null || echo "No .env.production file to copy"

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
