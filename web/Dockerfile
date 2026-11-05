# Built from the repository root: see docker-compose.yml.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY app.json index.js ./
COPY assets ./assets
COPY src ./src
# EXPO_PUBLIC_ values are compiled into the bundle, so anyone can read them from the site.
ARG EXPO_PUBLIC_GEMINI_API_KEY=
ENV EXPO_PUBLIC_GEMINI_API_KEY=$EXPO_PUBLIC_GEMINI_API_KEY
RUN npx expo export --platform web --output-dir dist

FROM nginx:1.29-alpine
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
