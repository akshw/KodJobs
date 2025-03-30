FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./

COPY ./prisma ./prisma/

RUN pnpm install

RUN pnpm prisma generate

COPY . .

EXPOSE 5000

CMD ["pnpm", "start"]
