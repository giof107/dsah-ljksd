FROM node:20-alpine

RUN apk add --no-cache \
    mysql-client \
    shadow \
    docker-cli

WORKDIR /app

ARG DOCKER_GID=998
RUN groupadd -g ${DOCKER_GID} docker && \
    usermod -aG docker node

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 5173

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

RUN chown -R node:node /app

USER node

CMD ["sh", "/app/start.sh"]