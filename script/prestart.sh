#!/usr/bin/env bash

DEV_MODE=0;
if [[ $NODE_ENV == "development" ]]; then
    DEV_MODE=1;
fi;

exec_cleancss=./node_modules/clean-css/bin/cleancss
exec_uglifyjs=./node_modules/uglify-js/bin/uglifyjs
# creating css directory for first deployement
mkdir -p ./client/css;
mkdir -p ./client/js;

# minifying resources
$exec_cleancss websrc/css/main.css websrc/css/list-item.css -o ./client/css/main-min.css


$exec_uglifyjs ./websrc/js/reports.js  -o ./client/js/bundle.js

# moving node_modules resources to vendor
vendor_dir="client/vendor/"
cp node_modules/angular/angular.min.js $vendor_dir
cp node_modules/angular-chart.js/dist/angular-chart.min.js $vendor_dir
cp node_modules/chart.js/dist/Chart.min.js $vendor_dir

if [[ $DEV_MODE == 1 ]]; then
     cp node_modules/angular/angular.min.js.map $vendor_dir
     cp node_modules/angular-chart.js/dist/angular-chart.min.js.map $vendor_dir
fi