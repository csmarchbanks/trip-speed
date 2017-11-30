# Stage 1 - the build process
FROM node:9.2 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.13-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
