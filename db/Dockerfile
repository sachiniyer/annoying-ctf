FROM postgres:alpine

ADD migrations/1_schema.sql /docker-entrypoint-initdb.d
ADD migrations/2_data.sql /docker-entrypoint-initdb.d

RUN chmod a+r /docker-entrypoint-initdb.d/*
