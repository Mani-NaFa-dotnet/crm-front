# ---------- BUILD ----------
FROM node:20-alpine AS build

WORKDIR /app
COPY crm-entry/package*.json ./
RUN npm install

COPY crm-entry/ .
RUN npm run build


# ---------- SERVE ----------
FROM nginx:alpine

# DevOps creates this config
COPY crm-entry/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]