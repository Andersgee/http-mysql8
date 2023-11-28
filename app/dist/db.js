import { parse, stringify } from "devalue";
import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
const [, , , user, password, host, port, database] =
  process.env.DATABASE_URL.split(/:|\/|@/);
const db = new Kysely({
  dialect: new MysqlDialect({
    pool: createPool({
      user,
      password,
      host,
      port: Number(port),
      database,
      connectionLimit: 1,
    }),
  }),
});
export async function executeQueryOrThrow(q) {
  if (typeof q !== "string") throw "not string";
  const compiledQuery = parse(q);
  if (!compiledQuery) throw "couldnt parse";
  if (process.env.DEBUG_LOG_QUERYS) {
    console.log("query: ", compiledQuery);
  }
  const result = await db.executeQuery(compiledQuery);
  return stringify(result);
}
