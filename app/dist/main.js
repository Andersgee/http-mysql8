import "./validate-process-env.js";
import Fastify from "fastify";
import { executeQueryOrThrow } from "./db.js";
const server = Fastify();
server.addHook("onRequest", (request, _reply, done) => {
  if (
    !process.env.DB_HTTP_AUTH_HEADER ||
    request.headers.authorization !== process.env.DB_HTTP_AUTH_HEADER
  ) {
    throw { statusCode: 401, message: "UNAUTHORIZED" };
  }
  done();
});
server.route({
  method: "GET",
  url: "/",
  handler: async (request, _reply) => {
    try {
      const str = await executeQueryOrThrow(request.query.q);
      return str;
    } catch {
      throw { statusCode: 400, message: "BAD_REQUEST" };
    }
  },
});
async function start() {
  const [host, port] = process.env.DB_HTTP_LISTEN_ADRESS.split(":");
  try {
    console.log(`http-db listening on ${process.env.DB_HTTP_LISTEN_ADRESS}`);
    await server.listen({
      host: host,
      port: Number(port ?? "3000"),
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
void start();
