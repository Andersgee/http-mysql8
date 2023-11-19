# http-mysql8

Adapted from the regular [mysq:8.0 image](https://github.com/docker-library/mysql/blob/84ba05eaa75e1f0e1d33185e23f95a9cdc607b51/8.0/Dockerfile.debian) but also runs the npm package you put inside `/app` folder.

### run on another machine

copy `docker-compose.yml` and `.env`
then run `sudo docker compose up`
(pull updated image with: `sudo docker compose pull db`)

### dev

copy paste package.json and build output of some npm project and then

```sh
docker compose build
docker push andersgee/http-mysql8
```

### other

shell to running container
`sudo docker exec -it SOME_CONTAINER_ID /bin/bash`
remove volumes (delete db data)
`sudo docker compose down -v`
