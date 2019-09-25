FROM harbor.haodai.net/ops/official-nginx:1.17.3
RUN mkdir /app
COPY dist /app
COPY nginx.conf /etc/nginx/nginx.conf