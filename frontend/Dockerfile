FROM alpine:3.23

RUN apk add --no-cache nginx \
    && mkdir -p /usr/share/nginx/html \
    && rm -f /etc/nginx/http.d/default.conf

COPY nginx.conf /etc/nginx/http.d/default.conf
COPY index.html /usr/share/nginx/html/
COPY style.css  /usr/share/nginx/html/
COPY app.js     /usr/share/nginx/html/
COPY config.js  /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
