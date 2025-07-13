# STAGE 1
FROM node:22-alpine as builder

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

USER node
RUN yarn install --frozen-lockfile

COPY --chown=node:node . .
RUN yarn build

# STAGE 2
FROM node:22-alpine as app

RUN apk add dumb-init

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

USER node
RUN yarn install --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

ENV PORT 3000
EXPOSE 3000

CMD ["dumb-init", "node", "--enable-source-maps", "dist/main.js"]