FROM node:21

WORKDIR /usr/app
COPY package*.json .
RUN npm install --quiet
COPY . .
RUN npm run build

ENTRYPOINT [ "npm", "start" ]