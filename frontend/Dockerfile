# Dockerfile

# Stage 1: Build the React app
FROM node:18.12.1 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . ./

RUN npm run build

# Stage 2: Serve the built React app
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]