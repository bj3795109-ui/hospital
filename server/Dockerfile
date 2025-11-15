FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --production=false

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
