#!/bin/sh

# Just a script that runs our graphql server

port=8080

# In order to query the server from localhost:8080 or 127.0.0.1:8080 strings in javascript,
# the server needs to be explicitly ran using '127.0.0.1:8080' since running the server with
# 'localhost:8080' will make it so that both of those string won't connect to the server since the
# server is ran in using some ipv6 address
php -S "127.0.0.1:$port" src/server.php -d auto_prepend_file=src/server-init.php -n
