FROM  node:latest AS builder
WORKDIR /app

# Copy the package.json file to my current directory to install the necessary dependence  
COPY package.json .
RUN npm install

# Copy other files to my current directory and build
COPY . .
RUN npm run build

# Copy the static file to my Nginx folder to serve static container
FROM nginx:1.25.2-alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]