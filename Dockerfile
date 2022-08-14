FROM registry.fpi-inc.site/library/node-dind:14.18.3-alpine as BUILD
# FROM registry.fpi-inc.site/library/node-dind:16.14.0-alpine as BUILD
WORKDIR /build/
COPY . /build/

RUN yarn config set registry https://registry.npmmirror.com && \
    npm config set registry https://registry.npmmirror.com && \
    yarn && \
    # npm install && \
    yarn build:h5 && \
    mv /build/version /build/dist/version

FROM registry.fpi-inc.site/library/nginx:1.15.0
LABEL maintainer="梅纪飞<jifei_mei@fpi-inc.com>"
COPY --from=BUILD /build/dist/build/h5 /home/fe/PROJECT_NAME
