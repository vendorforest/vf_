 kill -9 $(lsof -i:4444 -t) 2> /dev/null;
 kill -9 $(lsof -i:8081 -t) 2> /dev/null;

 #remove the old code
 #rm -rf dist/;

