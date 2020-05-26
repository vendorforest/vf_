docker images

echo "Building the docker image."

#clean up
# To stop the running container
docker stop vendorforest-demov1.0
docker rm vendorforest-demov1.0
docker rmi -f vendorforest/demov1.0 

docker stop vendorforestapp-build
docker rm vendorforestapp-build
docker rmi -f vendorforestapp-build 

docker rm -f  $(docker ps -a -q)

#build
# echo "app dependencies."
docker build -t vendorforestapp-build -f Dockerfile.build . 

#deploy app resources
docker run vendorforestapp-build > node_modules.tar.gz
yarn install --frozen-lockfile --production;

docker build -t vendorforest/demov1.0 -f Dockerfile.dist .

echo "Done building image."

echo "Set docker image to run."

docker run --name vendorforest-demov1.0 --expose="$1" -p "$1:$1" -d vendorforest/demov1.0

echo "Image is exposed on port: $1"

docker ps --all

echo "Verify port: "

sudo lsof -i -P -n | grep LISTE

#NODE_ENV=development nodemon dist