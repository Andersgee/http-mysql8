import "./validate-process-env.js";
import Fastify from "fastify";
import { executeQueryOrThrow } from "./db.js";
const server = Fastify();
server.addHook("onRequest", (request, _reply, done) => {
    if (!process.env.DB_HTTP_AUTH_HEADER ||
        request.headers.authorization !== process.env.DB_HTTP_AUTH_HEADER) {
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
        }
        catch {
            throw { statusCode: 400, message: "BAD_REQUEST" };
        }
    },
});
async function start() {
    const PORT = 3000;
    try {
        console.log(`----------------\nhttp server listening on port ${PORT}\n----------------`);
        await server.listen({
            host: "0.0.0.0",
            port: PORT,
        });
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
void start();
