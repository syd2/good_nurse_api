FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock", "npm-shrinkwrap.json*", "./"]
RUN yarn install && mv node_modules ../
RUN yarn add @types/node --dev
# RUN yarn build && mv dist ../
COPY . .
EXPOSE 9000
RUN chown -R node /usr/src/app
USER node

# RUN yarn build
CMD ["yarn", "start"]