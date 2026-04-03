import { buildServer } from "./server.js";

const server = buildServer();

const start = async () => {
  try {
    const port = Number(process.env.PORT ?? 3000);
    const host = process.env.HOST ?? "0.0.0.0";

    await server.listen({ port, host });
    server.log.info({ port, host }, "API server listening");
  } catch (error) {
    server.log.error(error, "Failed to start API server");
    process.exit(1);
  }
};

void start();

