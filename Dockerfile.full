FROM harbor.haodai.net/ops/official-node:10
COPY ./ /app
WORKDIR /app
RUN yarn config set registry https://registry.npm.taobao.org && \
    yarn install && yarn run build

FROM harbor.haodai.net/ops/official-nginx:1.17.3
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf