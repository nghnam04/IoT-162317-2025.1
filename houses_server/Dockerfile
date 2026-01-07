# ---------- Build stage ----------
    FROM node:18-alpine AS build

    WORKDIR /app
    
    COPY package*.json ./
    COPY .babelrc ./
    
    RUN npm install
    
    COPY src ./src
    
    RUN npm run build
    
    # ---------- Production stage ----------
    FROM node:18-alpine
    
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install --only=production
    
    COPY --from=build /app/dist ./dist
    
    ENV NODE_ENV=production
    ENV PORT=5000
    
    EXPOSE 5000
    
    CMD ["node", "dist/app.js"]
    