FROM node:16-alpine

WORKDIR /usr/app

COPY ./package.json .

RUN npm install

COPY . .

RUN npx prisma generate && npx prisma migrate deploy

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]