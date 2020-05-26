#!/bin/bash

#$1 param: 
#if you want to copy files to server 
#or just deploy to docker 
_copy=$1

#STEP 1

yarn install

yarn build

#STEP 2

echo "Copying files to server..."
#DIR=$(ls -I "node_modules" -I "dist" -I "OUTPUT")
#if $_copy; then
#    for file in $DIR; 
#      do
#        rsync -t -r "$file" $VENDOR_HOST:demo
#      done
#  else
#    echo "no file copy needed"
#fi

rsync -t -r dist $VENDOR_HOST:dist

#STEP 2
echo "Deploy script started to docker..."

ssh -o StrictHostKeyChecking=no -i ~/.ssh/tk_rsa $VENDOR_HOST \
"(cd ~/demo && sh deploy_to_docker.sh 4444)"

echo "Deploy script finished execution!"