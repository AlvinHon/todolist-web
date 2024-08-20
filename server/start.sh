#!/bin/bash

until mysqladmin ping -h"mysqldb" --user=user --password=password --silent
do
  echo "checking mysql readiness..."
  sleep 1
done
echo "mysql done"

java -jar /todolist-backend.jar