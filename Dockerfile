FROM node:23-alpine

WORKDIR /app

# Create volume directory explicitly
RUN mkdir -p /app/node_modules && chown -R node:node /app/node_modules
VOLUME /app/node_modules

COPY package*.json ./

USER node

CMD ["sh"]
