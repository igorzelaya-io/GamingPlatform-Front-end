FROM node:12-slim as build-stage

WORKDIR /app/

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build -- --output-path=./dist/out --prod

FROM nginx:1.18-alpine

COPY --from=build-stage /app/dist/out/ /var/www/d1gaming

COPY ./nginx.conf /etc/nginx/conf.d/default/conf
EXPOSE 80