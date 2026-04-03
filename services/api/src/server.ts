import Fastify from "fastify";
import { healthResponseSchema } from "@civiq/contracts";

export function buildServer() {
  const server = Fastify({
    logger: true
  });

  server.get("/health", async () => {
    return healthResponseSchema.parse({
      ok: true,
      service: "api"
    });
  });

  return server;
}
