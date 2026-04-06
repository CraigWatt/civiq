import crypto from "node:crypto";
import {
  authSessionSchema,
  notificationProfileSchema,
  type AuthSession,
  type NotificationProfile
} from "@civiq/contracts";

const TOKEN_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type PendingSignIn = {
  email: string;
  redirectTo: string;
  token: string;
  createdAt: string;
  expiresAt: string;
};

const defaultProfile: NotificationProfile = {
  notificationMode: "instant",
  digestFrequency: "daily",
  watchPoliticians: [],
  watchTickers: [],
  sendBuyAlerts: true,
  sendSellAlerts: true
};

const pendingSignIns = new Map<string, PendingSignIn>();
const sessions = new Map<string, AuthSession>();

function isoFromNow(offsetMs = 0) {
  return new Date(Date.now() + offsetMs).toISOString();
}

export function createSignInRequest(email: string, redirectTo: string) {
  const token = crypto.randomUUID().replaceAll("-", "");
  const createdAt = isoFromNow();
  const expiresAt = isoFromNow(TOKEN_TTL_MS);
  const pending: PendingSignIn = {
    email,
    redirectTo,
    token,
    createdAt,
    expiresAt
  };

  pendingSignIns.set(token, pending);

  return pending;
}

export function buildMagicLink(pending: PendingSignIn) {
  const redirectUrl = new URL(pending.redirectTo);
  redirectUrl.searchParams.set("token", pending.token);

  return redirectUrl.toString();
}

export function completeSignIn(token: string) {
  const pending = pendingSignIns.get(token);

  if (!pending) {
    return null;
  }

  if (Date.parse(pending.expiresAt) < Date.now()) {
    pendingSignIns.delete(token);
    return null;
  }

  pendingSignIns.delete(token);

  const sessionToken = crypto.randomUUID().replaceAll("-", "");
  const createdAt = isoFromNow();
  const expiresAt = isoFromNow(SESSION_TTL_MS);

  const session = authSessionSchema.parse({
    sessionToken,
    email: pending.email,
    createdAt,
    expiresAt,
    profile: defaultProfile
  });

  sessions.set(sessionToken, session);

  return session;
}

export function getSession(sessionToken: string) {
  const session = sessions.get(sessionToken);

  if (!session) {
    return null;
  }

  if (Date.parse(session.expiresAt) < Date.now()) {
    sessions.delete(sessionToken);
    return null;
  }

  return session;
}

export function updateSessionProfile(
  sessionToken: string,
  profile: NotificationProfile
) {
  const session = getSession(sessionToken);

  if (!session) {
    return null;
  }

  const updated = authSessionSchema.parse({
    ...session,
    profile: notificationProfileSchema.parse(profile)
  });

  sessions.set(sessionToken, updated);
  return updated;
}

export function extractBearerToken(authorizationHeader: string | undefined) {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token.trim();
}
