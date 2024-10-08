FROM node

WORKDIR /usr/src/app

COPY  package*.json ./

RUN npm i

COPY . .

COPY ./dev.sh /scripts/dev.sh

COPY ./waitforit.sh /scripts/waitforit.sh

RUN chmod +x /scripts/dev.sh /scripts/waitforit.sh

RUN npm run build entrypoint
RUN npm run build upload
RUN npm run build deploy

EXPOSE 5002

CMD [ "/bin/bash","/scripts/dev.sh" ]
