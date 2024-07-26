FROM  node:20-alpine3.17
WORKDIR /app

RUN apk update 
RUN apk add --no-cache tzdata
 
COPY package.json .
RUN npm install
COPY . .

EXPOSE 3001
CMD ["npm", "start"]