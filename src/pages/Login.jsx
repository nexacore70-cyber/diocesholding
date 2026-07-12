import { useState } from "react";
import {
  getStudentLandingPath,
} from "./student/studentData";
import {
  getTutorLandingPath,
} from "./tutor/tutorData";
import {
  getClientLandingPath,
} from "./client/clientData";

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M19 12H5M11 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.4 2.9-7.3Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.7-2.5L15.4 17c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.8A6 6 0 0 1 6.1 12c0-.6.1-1.2.3-1.8V7.6H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.4l3.4-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 12 2a10 10 0 0 0-9 5.6l3.4 2.6C7.2 7.8 9.4 6 12 6Z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#F25022" d="M2 2h9.5v9.5H2V2Z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5V2Z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2v-9.5Z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5v-9.5Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.91c-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 7.03c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9v2.75c0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
    </svg>
  );
}

const loginRoles = [
  {
    id: "student",
    title: "Student",
    description: "Access courses, assignments, projects and certificates.",
  },
  {
    id: "tutor",
    title: "Tutor",
    description: "Manage courses, students, classes and grading.",
  },
  {
    id: "client",
    title: "Client",
    description: "Manage projects, proposals, payments and hired talent.",
  },
  {
    id: "talent",
    title: "Talent",
    description: "Access matched jobs, proposals, projects and earnings.",
  },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("student");  
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const loginData = {
      ...formData,
      selectedRole,
    };

    console.log("Login details:", loginData);

    if (selectedRole === "student") {
      window.location.href = getStudentLandingPath();
      return;
    }

    if (selectedRole === "tutor") {
      window.location.href = getTutorLandingPath();
      return;
    }

    if (selectedRole === "client") {
  window.location.href = getClientLandingPath();
  return;
}

    alert(
      `Logging in as ${selectedRole}. Backend authentication comes next.`,
    );
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login is ready for backend OAuth integration.`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950">
      {/* FULL-PAGE BANNER */}
      <div className="fixed inset-0">
        <img
          src="/images/hero/banner2.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/70" />
      </div>

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/15 blur-[180px]" />

      <div className="relative z-10">
        {/* TOP NAVIGATION */}
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
            <a
              href="/"
              aria-label="Go to NexaCore homepage"
              className="inline-flex items-center transition duration-300 hover:scale-105"
            >
              <img
                src="/images/logo/nexacore-logo-light.png"
                alt="NexaCore"
                className="h-14 w-auto max-w-[230px] object-contain"
              />
            </a>

            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-white/55 sm:block">
                New to NexaCore?
              </span>

              <a
                href="/signup"
                className="rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-red-600"
              >
                Create account
              </a>

              <a
                href="/"
                className="hidden items-center gap-2 rounded-full border border-white/30 bg-black/30 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black md:inline-flex"
              >
                <BackIcon />
                Home
              </a>
            </div>
          </div>
        </header>

        {/* PAGE INTRODUCTION */}
        <section className="px-5 pb-10 pt-12 text-center sm:px-8 sm:pb-14 sm:pt-16">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-red-500" />

              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-400 sm:text-sm">
                Welcome back
              </p>

              <span className="h-px w-10 bg-red-500" />
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              Continue your journey
              <span className="block text-red-500">
                inside NexaCore.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Access your courses, projects, messages, payments, opportunities
              and professional dashboard.
            </p>
          </div>
        </section>

        {/* LOGIN CARD */}
        <section className="px-5 pb-16 sm:px-8 sm:pb-24 lg:px-12">
          <div className="mx-auto max-w-[1050px]">
            <div className="overflow-hidden rounded-[34px] border border-white/15 bg-white/95 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                {/* LEFT PANEL */}
                <aside className="relative overflow-hidden bg-neutral-950 p-8 text-white sm:p-10 lg:p-12">
                  <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-600/25 blur-[100px]" />

                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600">
                      <svg
                        className="h-7 w-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5V11Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 15v2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-red-500">
                      Secure account access
                    </p>

                    <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                      Everything you need is waiting in your dashboard.
                    </h2>

                    <p className="mt-5 text-sm leading-7 text-white/55">
                      Log in to continue learning, teaching, hiring or
                      delivering professional technology projects.
                    </p>

                    <div className="mt-9 space-y-4">
                      {[
                        "Access your personal dashboard",
                        "Continue courses and assignments",
                        "Manage projects and messages",
                        "Review payments and opportunities",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                            <CheckIcon />
                          </div>

                          <p className="text-sm leading-6 text-white/70">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                      <p className="text-sm leading-7 text-white/55">
                        Do not have a NexaCore account yet?
                      </p>

                      <a
                        href="/signup"
                        className="group mt-4 inline-flex items-center gap-3 font-black text-white transition hover:text-red-400"
                      >
                        Create your account
                        <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </aside>

                {/* LOGIN FORM */}
                <div className="p-8 sm:p-10 lg:p-12">
                  <div className="border-b border-neutral-200 pb-7">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
                      Account login
                    </p>

                    <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
                      Welcome back
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-neutral-500">
                      Log in with an existing account or use your email and
                      password.
                    </p>
                  </div>

                  {/* ACCOUNT TYPE */}
<div className="mt-8">
  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-sm font-black text-neutral-900">
        Choose your account type
      </p>

      <p className="mt-1 text-sm text-neutral-500">
        Select the dashboard you want to access.
      </p>
    </div>

    <span className="w-fit rounded-full bg-red-50 px-3 py-1.5 text-xs font-black capitalize text-red-600">
      {selectedRole} login
    </span>
  </div>

  <div className="mt-4 grid gap-3 sm:grid-cols-2">
    {loginRoles.map((role) => {
      const isSelected = selectedRole === role.id;

      return (
        <button
          key={role.id}
          type="button"
          onClick={() => setSelectedRole(role.id)}
          className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
            isSelected
              ? "border-red-600 bg-red-50 shadow-[0_10px_30px_rgba(220,38,38,0.1)]"
              : "border-neutral-200 bg-white hover:border-neutral-400"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <h3
              className={`font-black ${
                isSelected ? "text-red-600" : "text-neutral-950"
              }`}
            >
              {role.title}
            </h3>

            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                isSelected
                  ? "border-red-600 bg-red-600"
                  : "border-neutral-300 bg-white"
              }`}
            >
              {isSelected && (
                <span className="h-2 w-2 rounded-full bg-white" />
              )}
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-neutral-500">
            {role.description}
          </p>
        </button>
      );
    })}
  </div>
</div>

<div className="my-8 h-px bg-neutral-200" />

                  {/* SOCIAL LOGIN */}
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Google")}
                      className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-black text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-950 hover:shadow-lg"
                    >
                      <GoogleIcon />
                      Google
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Microsoft")}
                      className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-black text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-950 hover:shadow-lg"
                    >
                      <MicrosoftIcon />
                      Microsoft
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin("GitHub")}
                      className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-neutral-950 bg-neutral-950 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-lg"
                    >
                      <GitHubIcon />
                      GitHub
                    </button>
                  </div>

                  <div className="my-8 flex items-center gap-4">
                    <span className="h-px flex-1 bg-neutral-200" />

                    <span className="text-xs font-black uppercase tracking-[0.18em] text-neutral-400">
                      Or use your email
                    </span>

                    <span className="h-px flex-1 bg-neutral-200" />
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-black text-neutral-800"
                      >
                        Email address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                        className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                      />
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <label
                          htmlFor="password"
                          className="block text-sm font-black text-neutral-800"
                        >
                          Password
                        </label>

                        <a
                          href="/forgot-password"
                          className="text-sm font-black text-red-600 transition hover:text-neutral-950"
                        >
                          Forgot password?
                        </a>
                      </div>

                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          required
                          className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 pr-20 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((current) => !current)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-red-600 transition hover:text-neutral-950"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <label className="mt-5 flex w-fit cursor-pointer items-center gap-3">
                      <input
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="h-4 w-4 accent-red-600"
                      />

                      <span className="text-sm font-medium text-neutral-600">
                        Keep me signed in
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="group mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 text-sm font-black text-white shadow-[0_15px_45px_rgba(220,38,38,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-neutral-950"
                    >
                      Log in as {selectedRole}

                      <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>

                    <p className="mt-6 text-center text-sm text-neutral-500">
                      New to NexaCore?{" "}
                      <a
                        href="/signup"
                        className="font-black text-red-600 transition hover:text-neutral-950"
                      >
                        Create an account
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-xs leading-6 text-white/40">
              © {new Date().getFullYear()} NexaCore. Secure access to your
              academy and professional service workspace.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}