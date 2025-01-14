FROM node:23-alpine AS base 

FROM base AS dev 
WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .
EXPOSE 3000 
CMD ["npm", "run",  "dev"]

FROM base AS builder 

ENV NODE_ENV=production 
WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .
EXPOSE 3000 
RUN npm run build 



FROM builder AS prod 
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

CMD npm start
