FROM registry.cn-hangzhou.aliyuncs.com/aifactory/tools:nginx.1.0.0

COPY ./docker/site.conf /etc/nginx/conf.d/default.conf
COPY ./dist /app

