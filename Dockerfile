FROM ubuntu:16.04

RUN apt-get update && apt-get install -y nodejs npm 

RUN mkdir /opt/mage && mkdir /var/lib/mage 

#RUN apt-get install -y wget unzip && wget https://codeload.github.com/ngageoint/mage-server/zip/master -O temp.zip; unzip temp.zip -d /opt/mage; rm temp.zip

COPY ./ /opt/mage/

WORKDIR /opt/mage

RUN npm install

ENTRYPOINT ["nodejs", "app.js"]
