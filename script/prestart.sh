#!/usr/bin/env bash

exec_cleancss=./node_modules/clean-css/bin/cleancss
exec_uglifyjs=./node_modules/uglify-js/bin/uglifyjs
# creating css directory for first deployement
mkdir -p ./client/css;
mkdir -p ./client/js;

# minifying resources
$exec_cleancss websrc/css/main.css -o ./client/css/main-min.css


$exec_uglifyjs ./websrc/js/line-chart.js -o ./client/js/line-chart-min.js