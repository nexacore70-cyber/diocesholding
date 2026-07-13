import { useMemo, useState } from "react";
import {
  isPasswordPreviewMode,
  requestPasswordReset,
  resetPassword,
  validateNewPassword,
} from "../auth/passwordRecovery";

function LockIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RecoveryShell({ children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950">
      <div className="fixed inset-0">
        <img src="/images/hero/banner2.png" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-red-950/50" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
            <a href="/" aria-label="Go to NexaCore homepage">
              <img
                src="/images/logo/nexacore-logo-light.png"
                alt="NexaCore"
                className="h-14 w-auto max-w-[230px] object-contain"
              />
            </a>
            <a
              href="/login"
              className="rounded-full border border-white/25 bg-white/5 px-5 py-3 text-xs font-black text-white transition hover:bg-white hover:text-neutral-950"
            >
              Back to login
            </a>
          </div>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-[1440px] items-center justify-center px-5 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white p-7 shadow-[0_35px_120px_rgba(0,0,0,0.5)] dark:bg-neutral-900 sm:p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white">
              <LockIcon />
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [previewResetUrl, setPreviewResetUrl] = useState("");
  const previewMode = isPasswordPreviewMode();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await requestPasswordReset(email);
      setSubmitted(true);
      setPreviewResetUrl(result.previewResetUrl || "");
    } catch (requestError) {
      setError(requestError?.message || "The reset request could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RecoveryShell>
      <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-red-600">Password recovery</p>
      <h1 className="mt-3 text-3xl font-black text-neutral-950 dark:text-white sm:text-4xl">Forgot your password?</h1>
      <p className="mt-4 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
        Enter the email connected to your NexaCore account. A secure, time-limited reset link will be sent when an eligible account exists.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="mt-8">
          <label htmlFor="reset-email" className="mb-2 block text-sm font-black text-neutral-800 dark:text-neutral-200">
            Email address
          </label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            required
            className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
          />

          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white transition hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Sending reset link..." : "Send password-reset link"}
          </button>
        </form>
      ) : (
        <div className="mt-8">
          <div className="rounded-2xl bg-green-50 p-5 dark:bg-green-950/30">
            <p className="font-black text-green-700 dark:text-green-300">Check your email</p>
            <p className="mt-2 text-sm leading-7 text-green-900/70 dark:text-green-200/70">
              When an account exists for that address, a password-reset link will be sent. Check the spam or junk folder as well.
            </p>
          </div>

          {previewMode && previewResetUrl && (
            <a
              href={previewResetUrl}
              className="mt-4 inline-flex h-14 w-full items-center justify-center rounded-2xl border border-red-600 text-sm font-black text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              Open local preview reset page
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setEmail("");
              setPreviewResetUrl("");
            }}
            className="mt-4 h-12 w-full rounded-2xl border border-neutral-300 text-sm font-black text-neutral-700 hover:border-red-600 hover:text-red-600 dark:border-neutral-700 dark:text-neutral-200"
          >
            Use another email
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-xs leading-6 text-neutral-400">
        For security, NexaCore does not reveal whether an email is registered.
      </p>
    </RecoveryShell>
  );
}

export function ResetPassword() {
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token") || "", []);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const validation = validateNewPassword(form.password);

  const requirements = [
    ["length", "At least 8 characters"],
    ["uppercase", "One uppercase letter"],
    ["lowercase", "One lowercase letter"],
    ["number", "One number"],
    ["symbol", "One symbol"],
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!token) return setError("The password-reset link is missing its security token.");
    if (!validation.valid) return setError("Your new password does not meet all security requirements.");
    if (form.password !== form.confirmPassword) return setError("The two passwords do not match.");

    setSubmitting(true);
    try {
      await resetPassword({ token, password: form.password });
      setCompleted(true);
      setForm({ password: "", confirmPassword: "" });
    } catch (resetError) {
      setError(resetError?.message || "Your password could not be reset.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RecoveryShell>
      {!completed ? (
        <>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-red-600">Secure password reset</p>
          <h1 className="mt-3 text-3xl font-black text-neutral-950 dark:text-white sm:text-4xl">Create a new password</h1>
          <p className="mt-4 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
            Use a strong password that you have not used for another account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <label htmlFor="new-password" className="mb-2 block text-sm font-black text-neutral-800 dark:text-neutral-200">New password</label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
                className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 pr-20 text-sm text-neutral-950 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-red-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <label htmlFor="confirm-password" className="mb-2 mt-5 block text-sm font-black text-neutral-800 dark:text-neutral-200">Confirm new password</label>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
              required
              className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            />

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {requirements.map(([key, label]) => {
                const passed = validation.checks[key];
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-2 rounded-xl p-3 text-xs font-bold ${
                      passed
                        ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${passed ? "bg-green-600 text-white" : "border border-neutral-300 dark:border-neutral-600"}`}>
                      {passed && <CheckIcon className="h-3 w-3" />}
                    </span>
                    {label}
                  </div>
                );
              })}
            </div>

            {error && (
              <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Updating password..." : "Reset password"}
            </button>
          </form>
        </>
      ) : (
        <div className="mt-7 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300">
            <CheckIcon className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-neutral-950 dark:text-white">Password updated</h1>
          <p className="mt-4 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
            Your password has been changed. Sign in with the new password.
          </p>
          <a href="/login" className="mt-7 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950">
            Continue to login
          </a>
        </div>
      )}
    </RecoveryShell>
  );
}
