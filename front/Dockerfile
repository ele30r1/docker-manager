FROM node:14.21-alpine

ADD ./app /opt/app

WORKDIR /opt/app

RUN npm install -g pm2

RUN npm run build

EXPOSE 4000

CMD ["pm2", "start"]

# CMD ["npm", "start"]