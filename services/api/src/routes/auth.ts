import type { FastifyInstance } from "fastify";
import {
  authSessionSchema,
  signInCompleteRequestSchema,
  signInCompleteResponseSchema,
  signInRequestResponseSchema,
  signInRequestSchema,
  updateNotificationProfileSchema
} from "@civiq/contracts";
import {
  buildMagicLink,
  completeSignIn,
  createSignInRequest,
  extractBearerToken,
  getSession,
  updateSessionProfile
} from "../auth-store.js";

const allowOrigin = "*";

function setCorsHeaders(reply: {
  header(name: string, value: string): unknown;
}) {
  reply.header("Access-Control-Allow-Origin", allowOrigin);
  reply.header("Access-Control-Allow-Headers", "content-type, authorization");
  reply.header("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
}

function authTokenFromRequest(request: { headers: { authorization?: string } }) {
  return extractBearerToken(request.headers.authorization);
}

export function registerAuthRoutes(server: FastifyInstance) {
  server.options("*", async (_, reply) => {
    setCorsHeaders(reply);
    return reply.code(204).send();
  });

  server.post("/auth/request-link", async (request, reply) => {
    setCorsHeaders(reply);
    const body = signInRequestSchema.parse(request.body);
    const redirectTo = body.redirectTo ?? "http://localhost:4173/auth/complete";
    const pending = createSignInRequest(body.email, redirectTo);
    const magicLink = buildMagicLink(pending);

    const response = signInRequestResponseSchema.parse({
      ok: true,
      email: pending.email,
      magicLink,
      expiresAt: pending.expiresAt
    });

    return reply.send(response);
  });

  server.post("/auth/complete", async (request, reply) => {
    setCorsHeaders(reply);
    const body = signInCompleteRequestSchema.parse(request.body);
    const session = completeSignIn(body.token);

    if (!session) {
      return reply.code(400).send({ message: "Invalid or expired sign-in token" });
    }

    const response = signInCompleteResponseSchema.parse({
      ok: true,
      session
    });

    return reply.send(response);
  });

  server.get("/auth/me", async (request, reply) => {
    setCorsHeaders(reply);
    const sessionToken = authTokenFromRequest(request);

    if (!sessionToken) {
      return reply.code(401).send({ message: "Missing bearer token" });
    }

    const session = getSession(sessionToken);

    if (!session) {
      return reply.code(401).send({ message: "Session expired or invalid" });
    }

    return reply.send(authSessionSchema.parse(session));
  });

  server.put("/auth/profile", async (request, reply) => {
    setCorsHeaders(reply);
    const sessionToken = authTokenFromRequest(request);

    if (!sessionToken) {
      return reply.code(401).send({ message: "Missing bearer token" });
    }

    const profile = updateNotificationProfileSchema.parse(request.body);
    const session = updateSessionProfile(sessionToken, profile);

    if (!session) {
      return reply.code(401).send({ message: "Session expired or invalid" });
    }

    return reply.send(authSessionSchema.parse(session));
  });
}
