FROM node:21-alpine

WORKDIR /web

# Install app dependencies
COPY package.json .
RUN npm install
RUN npm install -g serve

# Bundle app source
COPY src ./src
COPY public ./public
COPY tsconfig.json .


# Build the app
ENV REACT_APP_BACKEND_URL=localhost 
# RUN printenv > .env
RUN npm run build

EXPOSE 3000

CMD ["serve", "-C", "build"]