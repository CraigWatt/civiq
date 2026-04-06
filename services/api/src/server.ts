import Fastify from "fastify";
import { healthResponseSchema } from "@civiq/contracts";
import { registerAuthRoutes } from "./routes/auth.js";

export function buildServer() {
  const server = Fastify({
    logger: true
  });

  server.addHook("onRequest", async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Headers", "content-type, authorization");
    reply.header("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");

    if (request.method === "OPTIONS") {
      return reply.code(204).send();
    }
  });

  server.get("/health", async () => {
    return healthResponseSchema.parse({
      ok: true,
      service: "api"
    });
  });

  registerAuthRoutes(server);

  return server;
}
