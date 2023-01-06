FROM node:lts as build

WORKDIR /usr/src/app
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/simpleserialize.com/package.json packages/simpleserialize.com/yarn.lock packages/simpleserialize.com/


RUN corepack enable
RUN yarn install --immutable

COPY . .
RUN npm rebuild node-sass
RUN cd packages/simpleserialize.com && yarn build


FROM nginx:alpine
COPY --from=build /usr/src/app/packages/simpleserialize.com/dist /usr/share/nginx/html
EXPOSE 80
