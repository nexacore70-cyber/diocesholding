const PREVIEW_REQUEST_KEY = "nexacore_password_reset_preview_v1";

function apiBase() {
  return String(import.meta.env?.VITE_API_BASE_URL || "").replace(/\/$/, "");
}

export function isPasswordPreviewMode() {
  return String(import.meta.env?.VITE_NEXACORE_PASSWORD_PREVIEW_MODE || "").toLowerCase() === "true";
}

function previewToken() {
  return globalThis.crypto?.randomUUID
    ? `preview-${globalThis.crypto.randomUUID()}`
    : `preview-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function requestPasswordReset(email) {
  const normalisedEmail = String(email || "").trim().toLowerCase();
  if (!normalisedEmail) throw new Error("Enter your email address.");

  if (isPasswordPreviewMode()) {
    const token = previewToken();
    sessionStorage.setItem(
      PREVIEW_REQUEST_KEY,
      JSON.stringify({ email: normalisedEmail, token, expiresAt: Date.now() + 30 * 60 * 1000, used: false }),
    );
    return { previewResetUrl: `/reset-password?token=${encodeURIComponent(token)}` };
  }

  const response = await fetch(`${apiBase()}/api/auth/password/forgot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: normalisedEmail }),
  });

  if (response.status === 429) throw new Error("Too many requests. Please wait before trying again.");
  if (!response.ok && response.status >= 500) throw new Error("The password service is temporarily unavailable.");
  return {};
}

export async function resetPassword({ token, password }) {
  const safeToken = String(token || "").trim();
  if (!safeToken) throw new Error("The password-reset link is missing or invalid.");

  if (isPasswordPreviewMode()) {
    let request = null;
    try {
      request = JSON.parse(sessionStorage.getItem(PREVIEW_REQUEST_KEY) || "null");
    } catch {
      request = null;
    }

    if (!request || request.token !== safeToken || request.used || Date.now() > Number(request.expiresAt || 0)) {
      throw new Error("This preview reset link is invalid, expired or already used.");
    }

    sessionStorage.setItem(
      PREVIEW_REQUEST_KEY,
      JSON.stringify({ ...request, used: true, completedAt: new Date().toISOString() }),
    );
    return {};
  }

  const response = await fetch(`${apiBase()}/api/auth/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token: safeToken, password }),
  });

  if (response.ok) return {};
  if (response.status === 400 || response.status === 410) {
    throw new Error("This password-reset link is invalid or has expired.");
  }
  if (response.status === 429) throw new Error("Too many attempts. Please wait before trying again.");
  throw new Error("Your password could not be reset. Please request a new link.");
}

export function validateNewPassword(password) {
  const value = String(password || "");
  const checks = {
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  };
  return { checks, valid: Object.values(checks).every(Boolean) };
}
