# syntax=docker/dockerfile:1
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

CMD ["node", "dist/ping.js"]

