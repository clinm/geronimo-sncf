#!/usr/bin/env bash
# creating css directory for first deployement
mkdir -p ./client/css;

# minifying resources
./node_modules/clean-css/bin/cleancss websrc/main.css -o ./client/css/main-min.css