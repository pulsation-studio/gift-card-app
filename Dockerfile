FROM node:22

COPY ["libreoffice-install.sh", "./"]

RUN chmod +x libreoffice-install.sh && ./libreoffice-install.sh

WORKDIR /app
COPY . . 

RUN npm ci --ignore-scripts
RUN node ace build