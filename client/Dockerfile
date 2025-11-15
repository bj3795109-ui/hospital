FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --production=false

# Copy source and build
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Install a minimal set for start
COPY package*.json ./
RUN npm ci --production=false --omit=dev

# Copy build output and public files
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
