import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ADMIN_PERMISSIONS,
  ADMIN_ROLE_LABELS,
  ADMIN_STORAGE_KEYS,
  authenticateAdmin,
  clearAdminSession,
  defaultAdminAudit,
  defaultAdminCategories,
  defaultAdminCourses,
  defaultAdminNotifications,
  defaultAdminSettings,
  defaultAdminStaff,
  defaultAdminUsers,
  defaultDisputes,
  defaultKycCases,
  fallbackPayments,
  fallbackProjects,
  fallbackSupportTickets,
  hasAdminPermission,
  isAdminPreviewEnabled,
  loadAdminValue,
  logoutAdmin,
  resolveAdminSession,
  saveAdminValue,
} from "./adminData";

import {
  AdminIcon,
  AdminWorkspace,
  getAdminNavigation,
} from "./AdminWorkspace";
import ThemeToggle from "../../theme/ThemeToggle";

export function isAdminPortalPath(pathname) {
  return (
    pathname === "/admin" ||
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/")
  );
}

function useAdminState(key, fallback) {
  const [value, setValue] = useState(() =>
    loadAdminValue(key, fallback),
  );

  const updateValue = (nextValue) => {
    setValue((currentValue) => {
      const resolved =
        typeof nextValue === "function"
          ? nextValue(currentValue)
          : nextValue;

      saveAdminValue(key, resolved);
      return resolved;
    });
  };

  return [value, updateValue];
}

function AdminLoginPage({
  onAuthenticated,
}) {
  const [form, setForm] = useState({
    email: "",
    accessCode: "",
  });

  const [submitting, setSubmitting] =
    useState(false);
  const [error, setError] = useState("");

  const previewMode = isAdminPreviewEnabled();

  const submit = async (event) => {
    event.preventDefault();

    if (
      !form.email.trim() ||
      !form.accessCode
    ) {
      setError(
        "Enter the authorised staff email and access code.",
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const session = await authenticateAdmin(form);
      onAuthenticated(session);
    } catch (loginError) {
      setError(
        loginError?.message ||
          "Administrator authentication failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 px-5 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-black shadow-[0_50px_160px_rgba(0,0,0,0.6)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <img
            src="/images/hero/banner1.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/78" />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-red-950/70" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <div>
              <img
                src="/images/logo/nexacore-logo-light.png"
                alt="NexaCore"
                className="h-14 w-auto max-w-[220px] object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
                Restricted operations system
              </p>
              <h1 className="mt-5 max-w-2xl text-5xl font-black leading-tight">
                Private control for NexaCore owners and authorised staff.
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-8 text-white/55">
                Administrative access is separate from public, student, tutor, client and talent authentication.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                "Role-based access",
                "Audit logging",
                "MFA-ready",
                "Backend protected",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-xs font-black text-white/65"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-10 lg:p-12">
          <form
            onSubmit={submit}
            className="w-full"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600">
              <AdminIcon
                name="lock"
                className="h-7 w-7"
              />
            </div>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-red-500">
              Staff authentication
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Admin sign in
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/45">
              Use an administrator account issued by the NexaCore owner. Public user accounts cannot enter this workspace.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-black text-white/70">
                  Staff email
                </label>
                <input
                  type="email"
                  autoComplete="username"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-white/70">
                  Password or access code
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={form.accessCode}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      accessCode:
                        event.target.value,
                    }))
                  }
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                />
              </div>
            </div>

            {error && (
              <p className="mt-5 rounded-2xl bg-red-600/15 p-4 text-sm font-bold text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Authenticating..."
                : "Enter private dashboard"}
              <AdminIcon name="chevron" />
            </button>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-black uppercase tracking-[0.13em] text-white/35">
                Security mode
              </p>
              <p className="mt-2 text-xs leading-6 text-white/45">
                {previewMode
                  ? "Local preview mode is enabled. Never deploy the preview credentials or preview mode to production."
                  : "Production mode requires /api/admin/auth/login and a secure HttpOnly staff session."}
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function AccessDeniedPage({
  session,
  currentPath,
}) {
  return (
    <section className="rounded-[30px] border border-red-200 bg-red-50 p-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white">
        <AdminIcon
          name="lock"
          className="h-7 w-7"
        />
      </div>
      <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-red-600">
        Access denied
      </p>
      <h2 className="mt-2 text-3xl font-black">
        Your staff role cannot open this module.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-red-900/65">
        {ADMIN_ROLE_LABELS[session.role] ||
          session.role}{" "}
        does not have permission for {currentPath}. Ask the owner or super administrator to change the staff role.
      </p>
      <a
        href="/admin/dashboard"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-black text-white hover:bg-red-600"
      >
        Return to overview
      </a>
    </section>
  );
}

function AdminShell({
  session,
  notifications,
  currentPath,
  onLogout,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] =
    useState(false);

  const navigation = getAdminNavigation(session);
  const unreadCount = notifications.filter(
    (item) => !item.read,
  ).length;

  const activeItem =
    navigation.find(
      (item) => item.href === currentPath,
    ) || navigation[0];

  const initials = session.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-neutral-950">
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[310px] flex-col bg-neutral-950 text-white shadow-2xl transition-transform lg:translate-x-0 ${
          menuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">
          <a href="/admin/dashboard">
            <img
              src="/images/logo/nexacore-logo-light.png"
              alt="NexaCore"
              className="h-11 w-auto max-w-[175px] object-contain"
            />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] lg:hidden"
          >
            <AdminIcon name="close" />
          </button>
        </div>

        <div className="m-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-black">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">
                {session.name}
              </p>
              <p className="mt-1 truncate text-[11px] text-white/40">
                {ADMIN_ROLE_LABELS[session.role] ||
                  session.role}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-500/10 p-3 text-[10px] font-black uppercase tracking-[0.12em] text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Private staff session
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-5">
          <div className="space-y-1">
            {navigation.map((item) => {
              const active =
                currentPath === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    active
                      ? "bg-red-600 text-white"
                      : "text-white/50 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <AdminIcon name={item.icon} />
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white/[0.06] text-sm font-black text-white/65 hover:bg-red-600 hover:text-white"
          >
            <AdminIcon name="logout" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[310px]">
        <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
          <div className="flex h-[88px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
            <div className="flex min-w-0 items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setMenuOpen((current) => !current)
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white lg:hidden"
              >
                <AdminIcon name="menu" />
              </button>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-red-600">
                  Private admin
                </p>
                <h1 className="mt-1 truncate text-lg font-black sm:text-xl">
                  {activeItem?.label || "Control Center"}
                </h1>
              </div>
            </div>

            <div className="hidden max-w-lg flex-1 lg:block">
              <div className="relative">
                <AdminIcon
                  name="search"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="search"
                  placeholder="Search users, projects, payments or cases..."
                  className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-12 pr-5 text-sm outline-none focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
                />
              </div>
            </div>

            <a
              href="/admin/disputes"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white"
            >
              <AdminIcon name="notification" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </a>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    (current) => !current,
                  )
                }
                className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white p-1.5 pr-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">
                  {initials}
                </div>
                <div className="hidden text-left xl:block">
                  <p className="max-w-[160px] truncate text-xs font-black">
                    {session.name}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {ADMIN_ROLE_LABELS[session.role]}
                  </p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-72 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl">
                  <p className="font-black">
                    {session.name}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {session.email}
                  </p>
                  <p className="mt-3 rounded-xl bg-neutral-100 p-3 text-xs font-bold text-neutral-600">
                    {session.previewMode
                      ? "Local preview session"
                      : "Backend staff session"}
                  </p>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="mt-3 h-11 w-full rounded-xl bg-red-600 text-xs font-black text-white"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="px-5 py-7 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}

const pathPermission = {
  "/admin/dashboard":
    ADMIN_PERMISSIONS.DASHBOARD_VIEW,
  "/admin/users": ADMIN_PERMISSIONS.USERS_VIEW,
  "/admin/kyc": ADMIN_PERMISSIONS.KYC_VIEW,
  "/admin/courses":
    ADMIN_PERMISSIONS.COURSES_VIEW,
  "/admin/projects":
    ADMIN_PERMISSIONS.PROJECTS_VIEW,
  "/admin/disputes":
    ADMIN_PERMISSIONS.DISPUTES_VIEW,
  "/admin/payments":
    ADMIN_PERMISSIONS.PAYMENTS_VIEW,
  "/admin/reports":
    ADMIN_PERMISSIONS.REPORTS_VIEW,
  "/admin/categories":
    ADMIN_PERMISSIONS.CATEGORIES_VIEW,
  "/admin/support":
    ADMIN_PERMISSIONS.SUPPORT_VIEW,
  "/admin/staff": ADMIN_PERMISSIONS.STAFF_VIEW,
  "/admin/audit": ADMIN_PERMISSIONS.AUDIT_VIEW,
  "/admin/settings":
    ADMIN_PERMISSIONS.SETTINGS_VIEW,
};

export default function AdminPortal() {
  const currentPath = window.location.pathname;
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] =
    useState(true);

  const [users, setUsers] = useAdminState(
    ADMIN_STORAGE_KEYS.users,
    defaultAdminUsers,
  );

  const [kyc, setKyc] = useAdminState(
    ADMIN_STORAGE_KEYS.kyc,
    defaultKycCases,
  );

  const [courses, setCourses] = useAdminState(
    ADMIN_STORAGE_KEYS.courses,
    defaultAdminCourses,
  );

  const [projects, setProjects] = useAdminState(
    ADMIN_STORAGE_KEYS.clientProjects,
    fallbackProjects,
  );

  const [disputes, setDisputes] = useAdminState(
    ADMIN_STORAGE_KEYS.disputes,
    defaultDisputes,
  );

  const [payments, setPayments] = useAdminState(
    ADMIN_STORAGE_KEYS.clientPayments,
    fallbackPayments,
  );

  const [categories, setCategories] =
    useAdminState(
      ADMIN_STORAGE_KEYS.categories,
      defaultAdminCategories,
    );

  const [support, setSupport] = useAdminState(
    ADMIN_STORAGE_KEYS.clientSupport,
    fallbackSupportTickets,
  );

  const [staff, setStaff] = useAdminState(
    ADMIN_STORAGE_KEYS.staff,
    defaultAdminStaff,
  );

  const [audit, setAudit] = useAdminState(
    ADMIN_STORAGE_KEYS.audit,
    defaultAdminAudit,
  );

  const [settings, setSettings] = useAdminState(
    ADMIN_STORAGE_KEYS.settings,
    defaultAdminSettings,
  );

  const [notifications] = useAdminState(
    ADMIN_STORAGE_KEYS.notifications,
    defaultAdminNotifications,
  );

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const resolved = await resolveAdminSession();

      if (active) {
        setSession(resolved);
        setSessionLoading(false);
      }
    };

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  const nextPath = useMemo(() => {
    const query = new URLSearchParams(
      window.location.search,
    );

    const next = query.get("next");

    return next?.startsWith("/admin/")
      ? next
      : "/admin/dashboard";
  }, []);

  const handleAuthenticated = (
    authenticatedSession,
  ) => {
    setSession(authenticatedSession);
    window.location.replace(nextPath);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setSession(null);
    window.location.replace("/admin/login");
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-red-600" />
          <p className="mt-5 text-sm font-black">
            Verifying staff session
          </p>
        </div>
      </div>
    );
  }

  if (currentPath === "/admin") {
    window.location.replace(
      session
        ? "/admin/dashboard"
        : "/admin/login",
    );
    return null;
  }

  if (currentPath === "/admin/login") {
    if (session) {
      window.location.replace(
        "/admin/dashboard",
      );
      return null;
    }

    return (
      <AdminLoginPage
        onAuthenticated={handleAuthenticated}
      />
    );
  }

  if (!session) {
    const target = encodeURIComponent(
      `${currentPath}${window.location.search}`,
    );

    window.location.replace(
      `/admin/login?next=${target}`,
    );

    return null;
  }

  const requiredPermission =
    pathPermission[currentPath];

  const allowed =
    !requiredPermission ||
    hasAdminPermission(
      session,
      requiredPermission,
    );

  return (
    <AdminShell
      session={session}
      notifications={notifications}
      currentPath={currentPath}
      onLogout={handleLogout}
    >
      {allowed ? (
        <AdminWorkspace
          session={session}
          currentPath={currentPath}
          users={users}
          setUsers={setUsers}
          kyc={kyc}
          setKyc={setKyc}
          courses={courses}
          setCourses={setCourses}
          projects={projects}
          setProjects={setProjects}
          disputes={disputes}
          setDisputes={setDisputes}
          payments={payments}
          setPayments={setPayments}
          categories={categories}
          setCategories={setCategories}
          support={support}
          setSupport={setSupport}
          staff={staff}
          setStaff={setStaff}
          audit={audit}
          setAudit={setAudit}
          settings={settings}
          setSettings={setSettings}
          notifications={notifications}
        />
      ) : (
        <AccessDeniedPage
          session={session}
          currentPath={currentPath}
        />
      )}
    </AdminShell>
  );
}

export {
  clearAdminSession,
};
