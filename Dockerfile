# Base image
FROM node:20-alpine

# Create app directory
WORKDIR ./

# Bundle app source
COPY . .

RUN npm install

RUN npm run build

EXPOSE 8080

# Start the server using the production build
CMD [ "npm", "start" ]
