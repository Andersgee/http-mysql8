#with data directory ouside container
#docker run --name some-mysql -v /my/own/datadir:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag

#node app.js

#EXPOSE 3306 33060 4004

#docker run --name my-own-mysql8-with-node-app -p 127.0.0.1:8000:8000 test:latest

#docker run --name my-own-mysql8-with-node-app -v ./dbdata:/var/lib/mysql test:latest



#docker run --name my-own-mysql8-with-node-app -e MYSQL_ROOT_PASSWORD=somerootpw -e MYSQL_USER=anders -e MYSQL_PASSWORD=somepw test:latest



