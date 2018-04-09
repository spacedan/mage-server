FROM node:8

RUN apt update && apt upgrade -y && apt install -y graphicsmagick git wget unzip

RUN chown -R node /home/node \
&& mkdir /opt/mage \
&& chown -R node /opt/mage \
&& mkdir /var/lib/mage \
&& chown node /var/lib/mage

USER node

WORKDIR /opt/mage

RUN mkdir /tmp/files \
&& wget https://github.com/ngageoint/mage-server/archive/5.1.0.zip \
&& unzip 5.1.0.zip \
&& mv /opt/mage/mage-server-5.1.0/* /opt/mage/ \
&& npm install && npm run build 

EXPOSE 4242

CMD ["node", "app.js"]
