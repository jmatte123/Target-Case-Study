FROM node:12.6.0

WORKDIR /usr/src/app

COPY . .

EXPOSE 4000

RUN npm install

CMD ["npm", "start"]