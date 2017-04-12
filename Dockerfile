FROM docker.io/node:onbuild

RUN npm install

EXPOSE 3232
CMD npm start
