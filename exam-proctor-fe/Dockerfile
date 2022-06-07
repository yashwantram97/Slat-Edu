FROM node:16 AS builder

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install --force

COPY . .

RUN npm run build 

FROM caddy:2-alpine

ARG CADDYFILE 
COPY ${CADDYFILE} /etc/caddy/Caddyfile

COPY --from=builder /usr/src/app/build/ /srv

EXPOSE 80

EXPOSE 443