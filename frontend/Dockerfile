FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y curl patch

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app
COPY package.json /app/

RUN npm install

COPY . /app/

RUN npm run build

CMD [ "npm", "run", "start" ]