# http-mysql8

The regular [mysq:8.0 image](https://hub.docker.com/_/mysql) but also with a http interface.

### Example usage - docker run

with an `.env` file like this

```
#for db
MYSQL_USER=someuser
MYSQL_PASSWORD=somepassword
MYSQL_DATABASE=db
MYSQL_ROOT_PASSWORD=somepassword
#for http-db
DB_HTTP_AUTH_HEADER=Basic someauthheader
DB_HTTP_LISTEN_ADRESS=0.0.0.0:3000
DATABASE_URL=mysql://someuser:somepassword@127.0.0.1:3306/db
```

run

```sh
docker pull andersgee/http-mysql8
docker run --env-file ./.env -p 4000:3000 -p 3306:3306 andersgee/http-mysql8
```

Database now available at `mysql://someuser:somepassword@localhost:3306/db` and `http://localhost:4000`

### Example usage - docker compose

docker compose is usually more convenient. Using same `.env` file as above, `docker-compose.yml`:

```
version: "3.8"

services:
  db:
    image: andersgee/http-mysql8
    restart: unless-stopped
    env_file:
      - ./.env
    ports:
      - 4000:3000
      - 3306:3306
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

```sh
docker compose pull db #pull latest image
docker compose up
```

Database now available at `mysql://someuser:somepassword@localhost:3306/db` and `http://localhost:4000`

### communicate via http interface - javascript

This is a self contained example in vanilla javascript. You will likely want to use a typesafe query builder like `kysely`.

```js
import { parse, stringify } from "devalue";

async function execute(q) {
  const url = `http://localhost:4000?q=${stringify(q)}`;
  const res = await fetch(url, {
    headers: { Authorization: "Basic someauthheader" },
  });
  if (res.ok) {
    return parse(await res.text());
  } else {
    throw new Error(`${res.status}: ${res.statusText}`);
  }
}

const createResult = await execute({
  sql: `CREATE TABLE Post (
    id int NOT NULL AUTO_INCREMENT,
    text varchar(255) NOT NULL,
    PRIMARY KEY (id)
)`,
  parameters: [],
});
console.log(createResult);
//{
//  insertId: undefined,
//  numUpdatedOrDeletedRows: 0n,
//  numAffectedRows: 0n,
//  numChangedRows: 0n,
//  rows: []
//}

const insertResult = await execute({
  sql: "INSERT INTO Post (text) VALUES (?)",
  parameters: ["hello"],
});
console.log(insertResult);
//{
//  insertId: 1n,
//  numUpdatedOrDeletedRows: 1n,
//  numAffectedRows: 1n,
//  numChangedRows: 0n,
//  rows: []
//}

const selectResult = await execute({
  sql: "SELECT * FROM Post ORDER BY id DESC",
  parameters: [],
});
console.log(selectResult);
//{ rows: [ { id: 1, text: 'hello' } ] }

const updateResult = await execute({
  sql: "UPDATE Post SET text = ? WHERE id = ?",
  parameters: ["world", insertResult.insertId],
});
console.log(updateResult);
//{
//  insertId: undefined,
//  numUpdatedOrDeletedRows: 1n,
//  numAffectedRows: 1n,
//  numChangedRows: 1n,
//  rows: []
//}

const selectResult2 = await execute({
  sql: "SELECT * FROM Post ORDER BY id DESC",
  parameters: [],
});
console.log(selectResult2);
//{ rows: [ { id: 1, text: 'world' } ] }
```

### dev

Its easy to build another image with a different http interface if you dont fancy `devalue` as serializer.

```sh
#step 1: copy paste package.json and build output of some npm project and then
#step 2: build image
docker compose build
#step 3: upload image
#docker push andersgee/http-mysql8
docker push yourusername/someimagename

#also push a tag
docker tag andersgee/http-mysql8 andersgee/http-mysql8:1.0
docker push andersgee/http-mysql8:1.0

```

other

```sh
#shell to running container
docker exec -it SOME_CONTAINER_ID /bin/bash
#remove volumes (delete db data)
docker compose down -v
```
