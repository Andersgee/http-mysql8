# W?

idea: do the mysql8 docker file but add the http node app in it

so...

- prob just build the simple "api app" with esbuild into standalone single .js file
- copy that "api.js", (Dockerfile)
- install node? (Dockerfile)
  - actually instead of debian:bullseye-slim
  - just use node:20-bullseye-slim since that is based on debian:bullseye-slim but with node already installed

might not even need docker compose? Im liking it less and less every time I use it
now even docker-compose v3 specification is considered legacy now and they shifted to some sort of swarm deployment tool. bleh. I mean prob usable but still...

so I dont accidentally close tabs of all this googling, resources:

official mysql docker hub
https://hub.docker.com/_/mysql

the 8.0 version links here:
https://github.com/docker-library/mysql/blob/84ba05eaa75e1f0e1d33185e23f95a9cdc607b51/8.0/Dockerfile.oracle

mysql 8.0 reference:
https://dev.mysql.com/doc/refman/8.0/en/server-configuration-validation.html

using command line args in bash:
https://www.baeldung.com/linux/use-command-line-arguments-in-bash-script

NOTES TO SELF:
in Dockerfile, the CMD means " pass this list as args to entrypoint "
if no entrypoint is specified then CMD means " pass this list as args to '/bin/sh -c' "

## ok

build and run

```sh
sudo docker build -t test:latest .
sudo docker run --name andy-node-mysql -e MYSQL_ROOT_PASSWORD=somerootpw -e MYSQL_USER=anders -e MYSQL_PASSWORD=somepw test:latest
```

stop and remove

```sh
sudo docker container stop andy-node-mysql
sudo docker container rm andy-node-mysql
```
