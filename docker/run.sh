#!/bin/sh
# sed -i "s/APPID = '\(.*\)'/APPID = '$WX_APP_ID'/g" key.js
cp nginx.conf /etc/nginx/
nginx