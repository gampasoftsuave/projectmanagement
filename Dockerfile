FROM node:20.9.0-alpine AS builder
WORKDIR /apps
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
 
# Stage 2: 
FROM node:20.9.0-alpine 
WORKDIR /apps 
COPY --from=builder /apps/. .
EXPOSE 3000 
CMD ["npm","run" ,"dev"]