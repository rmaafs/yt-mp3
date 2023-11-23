FROM node:16.6.0-alpine3.14

WORKDIR /app

COPY . .

RUN apk update && apk add --no-cache ffmpeg libxslt-dev libxml2-dev
RUN npm install --no-optional --no-shrinkwrap --no-package-lock

CMD ["npm", "start"]