FROM node:lts as build

WORKDIR /usr/src/app
COPY package.json yarn.lock lerna.json ./
COPY packages/simpleserialize.com/package.json packages/simpleserialize.com/yarn.lock packages/simpleserialize.com/


RUN yarn install --non-interactive --frozen-lockfile --ignore-scripts
RUN yarn lerna bootstrap --hoist --ignore-scripts

COPY . .
RUN npm rebuild node-sass
RUN cd packages/simpleserialize.com && yarn build


FROM nginx:alpine
COPY --from=build /usr/src/app/packages/simpleserialize.com/dist /usr/share/nginx/html
EXPOSE 80
