import {
  authSessionSchema,
  notificationProfileSchema,
  signInCompleteResponseSchema,
  signInRequestResponseSchema,
  type AuthSession,
  type NotificationProfile
} from "@civiq/contracts";

const storageKey = "civiq.auth.session";
const defaultApiBase = "http://127.0.0.1:3000";

export const defaultProfile = notificationProfileSchema.parse({
  notificationMode: "instant",
  digestFrequency: "daily",
  watchPoliticians: [],
  watchTickers: [],
  sendBuyAlerts: true,
  sendSellAlerts: true
});

function getApiBaseUrl() {
  return import.meta.env.VITE_CIVIQ_API_BASE_URL ?? defaultApiBase;
}

function getCallbackUrl() {
  return new URL("auth/complete", window.location.href).toString();
}

export function loadStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return null;
  }

  try {
    return authSessionSchema.parse(JSON.parse(raw));
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function storeSession(session: AuthSession) {
  window.localStorage.setItem(storageKey, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(storageKey);
}

export async function requestMagicLink(email: string) {
  const response = await fetch(`${getApiBaseUrl()}/auth/request-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      redirectTo: getCallbackUrl()
    })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message ?? "Failed to request sign-in link");
  }

  return signInRequestResponseSchema.parse(payload);
}

export async function completeMagicLink(token: string) {
  const response = await fetch(`${getApiBaseUrl()}/auth/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message ?? "Failed to complete sign-in");
  }

  return signInCompleteResponseSchema.parse(payload).session;
}

export async function saveNotificationProfile(
  sessionToken: string,
  profile: NotificationProfile
) {
  const response = await fetch(`${getApiBaseUrl()}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`
    },
    body: JSON.stringify(profile)
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message ?? "Failed to update notification profile");
  }

  return authSessionSchema.parse(payload);
}
