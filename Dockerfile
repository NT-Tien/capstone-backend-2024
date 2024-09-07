# Base image
FROM node:20-alpine

# Install tzdata for timezone management
RUN apk add --no-cache tzdata

# Set timezone
ENV TZ=Asia/Ho_Chi_Minh

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose port
EXPOSE 8080

# Start the server using the production build
CMD [ "npm", "start" ]
