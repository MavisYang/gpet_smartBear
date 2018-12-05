FROM hub.docker.gemii.cc:7443/python/nginx-mini:1.12

RUN mkdir /code
ADD www/build /code
ADD docker /code
WORKDIR /code

CMD ./run.sh