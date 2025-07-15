# Stage 1: Build the Next.js app
FROM node:20.9.0-alpine AS builder
 
# Set working directory
WORKDIR /apps
 
# Install dependencies
COPY package*.json ./
RUN npm install
 
# Copy rest of the app
COPY . .
 
# Build Next.js app
RUN npm run build
 
# Stage 2: Run the app with Next.js built-in server
FROM node:20.9.0-alpine
 
WORKDIR /apps
 
# Copy node_modules and .next build from builder
COPY --from=builder /apps/node_modules ./node_modules
COPY --from=builder /apps/.next ./.next
COPY --from=builder /apps/public ./public
COPY --from=builder /apps/package.json ./package.json
COPY --from=builder /apps/next.config.ts ./next.config.ts
COPY --from=builder /apps/tsconfig.json ./tsconfig.json
 
EXPOSE 3000
 
# Run Next.js production server
CMD ["npm","run" ,"dev"]