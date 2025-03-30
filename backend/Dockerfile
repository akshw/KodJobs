FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./prisma ./prisma

COPY . .

RUN npx prisma generate


EXPOSE 4000

CMD ["npm", "start"]

// docker build -t kodjobs-backend .
// docker run -p 4000:4000 kodjobs-backend

//docker push akah606/kodjobs-backend:v1