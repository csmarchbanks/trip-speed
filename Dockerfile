# Stage 1 - the build process
FROM node:9.2 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY public/ ./public
COPY src ./src
RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.13-alpine
COPY config/trip-speed.template /etc/nginx/conf.d/trip-speed.template
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD /bin/sh -c "envsubst < /etc/nginx/conf.d/trip-speed.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
