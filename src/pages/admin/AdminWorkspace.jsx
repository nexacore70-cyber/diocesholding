import { useMemo, useState } from "react";

import {
  ADMIN_PERMISSIONS,
  ADMIN_ROLE_LABELS,
  ADMIN_ROLES,
  ADMIN_STORAGE_KEYS,
  defaultAdminAudit,
  defaultAdminCategories,
  defaultAdminCourses,
  defaultAdminSettings,
  defaultAdminStaff,
  defaultAdminUsers,
  defaultDisputes,
  defaultKycCases,
  exportRowsToCsv,
  fallbackPayments,
  fallbackProjects,
  fallbackSupportTickets,
  formatAdminMoney,
  hasAdminPermission,
  writeAuditLog,
} from "./adminData";
import ThemeToggle from "../../theme/ThemeToggle";

const navItems = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: "dashboard",
    permission: ADMIN_PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: "users",
    permission: ADMIN_PERMISSIONS.USERS_VIEW,
  },
  {
    label: "KYC / Verification",
    href: "/admin/kyc",
    icon: "shield",
    permission: ADMIN_PERMISSIONS.KYC_VIEW,
  },
  {
    label: "Course Management",
    href: "/admin/courses",
    icon: "courses",
    permission: ADMIN_PERMISSIONS.COURSES_VIEW,
  },
  {
    label: "Project Monitoring",
    href: "/admin/projects",
    icon: "projects",
    permission: ADMIN_PERMISSIONS.PROJECTS_VIEW,
  },
  {
    label: "Disputes",
    href: "/admin/disputes",
    icon: "disputes",
    permission: ADMIN_PERMISSIONS.DISPUTES_VIEW,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: "payments",
    permission: ADMIN_PERMISSIONS.PAYMENTS_VIEW,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: "reports",
    permission: ADMIN_PERMISSIONS.REPORTS_VIEW,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: "categories",
    permission: ADMIN_PERMISSIONS.CATEGORIES_VIEW,
  },
  {
    label: "Support Tickets",
    href: "/admin/support",
    icon: "support",
    permission: ADMIN_PERMISSIONS.SUPPORT_VIEW,
  },
  {
    label: "Staff & Roles",
    href: "/admin/staff",
    icon: "staff",
    permission: ADMIN_PERMISSIONS.STAFF_VIEW,
  },
  {
    label: "Audit Log",
    href: "/admin/audit",
    icon: "audit",
    permission: ADMIN_PERMISSIONS.AUDIT_VIEW,
  },
  {
    label: "Platform Settings",
    href: "/admin/settings",
    icon: "settings",
    permission: ADMIN_PERMISSIONS.SETTINGS_VIEW,
  },
];

export function useAdminStoredState(
  key,
  fallback,
  saveAdminValue,
) {
  const [value, setValue] = useState(fallback);

  const update = (nextValue) => {
    setValue((current) => {
      const resolved =
        typeof nextValue === "function"
          ? nextValue(current)
          : nextValue;

      saveAdminValue(key, resolved);
      return resolved;
    });
  };

  return [value, update];
}

export function AdminIcon({
  name,
  className = "h-5 w-5",
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M2 21c1-5 3-7 7-7s6 2 7 7M16 4a4 4 0 0 1 0 8M17 14c3 .4 5 2.5 5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6v5c0 5 3 8 8 10 5-2 8-5 8-10V6l-8-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="m8 12 2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    courses: (
      <>
        <path d="m3 5 9-3 9 3-9 3-9-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M5 8v7l7 3 7-3V8M21 5v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    projects: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    disputes: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v6M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    payments: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 9h18M7 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    reports: (
      <>
        <path d="M5 20V10M12 20V4M19 20v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    categories: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    support: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-1 .8-1.7 1.4-1.7 2.7M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    staff: (
      <>
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M2 20c.7-4 2.8-6 6-6s5.3 2 6 6M13 20c.5-3.2 2-5 4-5 2.5 0 4.2 1.7 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    audit: (
      <>
        <path d="M5 3h14v18H5z" stroke="currentColor" strokeWidth="2" />
        <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-4l-.4 3.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L6 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 3.1h4l.4-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
    close: <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    notification: (
      <>
        <path d="M6 9a6 6 0 1 1 12 0v5l2 3H4l2-3V9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M10 20h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    chevron: <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    check: <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
    plus: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
    export: (
      <>
        <path d="M12 3v12M7 10l5 5 5-5M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    pause: (
      <>
        <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
        <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7V5Z" fill="currentColor" />,
    edit: <path d="m4 16 10-10 4 4-10 10H4v-4ZM13 7l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

function statusClass(status) {
  const green = [
    "active",
    "verified",
    "published",
    "resolved",
    "answered",
    "reconciled",
    "clear",
    "completed",
    "released",
  ];

  const amber = [
    "pending",
    "review",
    "investigating",
    "open",
    "in_progress",
    "on_hold",
    "draft",
    "escalated",
    "medium",
    "normal",
  ];

  if (green.includes(status)) {
    return "bg-green-50 text-green-700";
  }

  if (amber.includes(status)) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-red-50 text-red-700";
}

export function StatusPill({ value }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.11em] ${statusClass(
        String(value || "").toLowerCase(),
      )}`}
    >
      {String(value || "unknown").replaceAll("_", " ")}
    </span>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-neutral-950 px-7 py-10 text-white sm:px-9 lg:px-11">
      <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-red-700/35 blur-2xl" />
      <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-red-600/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
            {description}
          </p>
        </div>
        {action}
      </div>
    </section>
  );
}

function EmptyState({
  icon = "dashboard",
  title,
  description,
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AdminIcon name={icon} className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-neutral-500">
        {description}
      </p>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled = false,
  tone = "dark",
  type = "button",
}) {
  const tones = {
    dark: "bg-neutral-950 text-white hover:bg-red-600",
    red: "bg-red-600 text-white hover:bg-neutral-950",
    light:
      "border border-neutral-300 bg-white text-neutral-700 hover:border-red-600 hover:text-red-600",
    green:
      "bg-green-600 text-white hover:bg-neutral-950",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function PermissionNotice() {
  return (
    <div className="rounded-[28px] border border-red-200 bg-red-50 p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white">
        <AdminIcon name="lock" className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-black">
        Permission required
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-red-900/65">
        This staff role can view the administrative workspace but does not have authority to perform this action.
      </p>
    </div>
  );
}

function DashboardPage({
  users,
  kyc,
  courses,
  projects,
  disputes,
  payments,
  support,
  notifications,
}) {
  const totalRevenue = payments
    .filter(
      (payment) =>
        ["verified", "released", "retained"].includes(
          payment.status,
        ) &&
        !["talent_payout", "refund"].includes(
          payment.type,
        ),
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0,
    );

  const pendingKyc = kyc.filter(
    (item) =>
      !["verified", "rejected"].includes(item.status),
  ).length;

  const openDisputes = disputes.filter(
    (item) =>
      !["resolved", "closed"].includes(item.status),
  ).length;

  const openTickets = support.filter(
    (item) =>
      !["answered", "resolved", "closed"].includes(
        item.status,
      ),
  ).length;

  const projectStatusRows = [
    "bids_received",
    "in_progress",
    "fully_funded",
    "completed",
    "disputed",
  ].map((status) => ({
    status,
    count: projects.filter(
      (project) => project.status === status,
    ).length,
  }));

  const maxStatusCount = Math.max(
    1,
    ...projectStatusRows.map((row) => row.count),
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="Private operations control"
        title="Monitor the complete NexaCore academy and service marketplace."
        description="This workspace centralises users, verification, courses, projects, disputes, escrow, support, reports and staff permissions."
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total users", users.length, "users"],
          ["Pending verification", pendingKyc, "shield"],
          ["Open disputes", openDisputes, "disputes"],
          [
            "Recorded inflow",
            formatAdminMoney(totalRevenue, "USD"),
            "payments",
          ],
        ].map(([label, value, icon]) => (
          <article
            key={label}
            className="rounded-[24px] border border-neutral-200 bg-white p-5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AdminIcon name={icon} />
            </div>
            <p className="mt-6 text-3xl font-black">{value}</p>
            <p className="mt-1 text-sm font-black text-neutral-700">
              {label}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                Operations queue
              </p>
              <h3 className="mt-2 text-2xl font-black">
                Items needing attention
              </h3>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              {
                label: "KYC cases",
                value: pendingKyc,
                href: "/admin/kyc",
                tone: "Verification",
              },
              {
                label: "Open disputes",
                value: openDisputes,
                href: "/admin/disputes",
                tone: "Escrow holds",
              },
              {
                label: "Support tickets",
                value: openTickets,
                href: "/admin/support",
                tone: "User support",
              },
              {
                label: "Draft courses",
                value: courses.filter(
                  (course) => course.status === "draft",
                ).length,
                href: "/admin/courses",
                tone: "Academy content",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="grid gap-4 rounded-2xl border border-neutral-200 p-5 transition hover:border-red-600 md:grid-cols-[1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-black">{item.label}</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {item.tone}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-red-600">
                    {item.value}
                  </span>
                  <AdminIcon name="chevron" />
                </div>
              </a>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Project status
          </p>
          <h3 className="mt-2 text-2xl font-black">
            Marketplace workflow
          </h3>

          <div className="mt-7 space-y-5">
            {projectStatusRows.map((row) => (
              <div key={row.status}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold capitalize text-white/60">
                    {row.status.replaceAll("_", " ")}
                  </span>
                  <span className="font-black">{row.count}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-red-600"
                    style={{
                      width: `${
                        (row.count / maxStatusCount) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-2xl bg-white/[0.06] p-5">
            <p className="text-xs font-black uppercase tracking-[0.13em] text-white/35">
              Security rule
            </p>
            <p className="mt-3 text-sm leading-7 text-white/55">
              Payment, KYC, dispute and role changes must be authorised by the backend and written to the audit log.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
          Administrative notifications
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className="rounded-2xl border border-neutral-200 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <AdminIcon name="notification" />
                </div>
                <div>
                  <p className="font-black">
                    {notification.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-neutral-500">
                    {notification.message}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function UsersPage({
  session,
  users,
  setUsers,
  addAudit,
}) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");

  const canManage = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.USERS_MANAGE,
  );

  const canSuspend = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.USERS_SUSPEND,
  );

  const filtered = users.filter((user) => {
    const matchesQuery =
      `${user.name} ${user.email} ${user.id}`
        .toLowerCase()
        .includes(query.toLowerCase());

    return (
      matchesQuery &&
      (role === "all" || user.role === role)
    );
  });

  const changeStatus = (user, status) => {
    if (
      status === "suspended" &&
      !canSuspend
    ) {
      return;
    }

    if (!canManage) {
      return;
    }

    setUsers((current) =>
      current.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );

    addAudit({
      action: "user.status_changed",
      targetType: "user",
      targetId: user.id,
      summary: `${user.name} changed from ${user.status} to ${status}.`,
    });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Users and account control"
        title="Manage every platform role from one directory."
        description="Search students, tutors, clients and talent, inspect verification state, activate accounts or apply a controlled suspension."
        action={
          <ActionButton
            tone="light"
            onClick={() =>
              exportRowsToCsv(
                "nexacore-users.csv",
                filtered,
              )
            }
          >
            <AdminIcon name="export" />
            Export users
          </ActionButton>
        }
      />

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <AdminIcon
              name="search"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
            />
            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search name, email or user ID..."
              className="h-14 w-full rounded-2xl border border-neutral-300 pl-12 pr-4 text-sm outline-none focus:border-red-600"
            />
          </div>

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            className="h-14 rounded-2xl border border-neutral-300 bg-white px-4 text-sm font-bold outline-none focus:border-red-600"
          >
            <option value="all">All roles</option>
            <option value="student">Students</option>
            <option value="tutor">Tutors</option>
            <option value="client">Clients</option>
            <option value="talent">Talent</option>
          </select>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full">
            <thead className="bg-neutral-950 text-left text-xs uppercase tracking-[0.12em] text-white/55">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Verification</th>
                <th className="px-5 py-4">Risk</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Last active</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-neutral-200"
                >
                  <td className="px-5 py-5">
                    <p className="font-black">{user.name}</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {user.email} · {user.id}
                    </p>
                  </td>
                  <td className="px-5 py-5 capitalize">
                    {user.role}
                  </td>
                  <td className="px-5 py-5">
                    <StatusPill
                      value={user.verificationStatus}
                    />
                  </td>
                  <td className="px-5 py-5">
                    <StatusPill value={user.riskLevel} />
                  </td>
                  <td className="px-5 py-5">
                    <StatusPill value={user.status} />
                  </td>
                  <td className="px-5 py-5 text-sm text-neutral-500">
                    {user.lastActiveAt}
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      {user.status === "suspended" ? (
                        <ActionButton
                          disabled={!canManage}
                          onClick={() =>
                            changeStatus(user, "active")
                          }
                          tone="green"
                        >
                          Activate
                        </ActionButton>
                      ) : (
                        <ActionButton
                          disabled={!canSuspend}
                          onClick={() =>
                            changeStatus(
                              user,
                              "suspended",
                            )
                          }
                          tone="light"
                        >
                          Suspend
                        </ActionButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function KycPage({
  session,
  kyc,
  setKyc,
  users,
  setUsers,
  addAudit,
}) {
  const [selectedId, setSelectedId] = useState(
    kyc[0]?.id || "",
  );

  const [notes, setNotes] = useState("");

  const selected = kyc.find(
    (item) => item.id === selectedId,
  );

  const canReview = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.KYC_REVIEW,
  );

  const resolve = (status) => {
    if (!canReview || !selected) {
      return;
    }

    const reviewedAt = new Date().toISOString();

    setKyc((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status,
              notes,
              reviewedBy: session.name,
              reviewedAt,
              documentCheck:
                status === "verified"
                  ? "passed"
                  : item.documentCheck,
              addressCheck:
                status === "verified"
                  ? "passed"
                  : item.addressCheck,
            }
          : item,
      ),
    );

    setUsers((current) =>
      current.map((user) =>
        user.id === selected.userId
          ? {
              ...user,
              verificationStatus:
                status === "verified"
                  ? "verified"
                  : status === "rejected"
                    ? "kyc_rejected"
                    : user.verificationStatus,
              status:
                status === "verified"
                  ? "active"
                  : user.status,
            }
          : user,
      ),
    );

    addAudit({
      action: `kyc.${status}`,
      targetType: "kyc_case",
      targetId: selected.id,
      summary: `${selected.userName} KYC marked ${status}.`,
    });

    setNotes("");
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="KYC and verification"
        title="Review identity, address and professional-verification cases."
        description="Approval controls access to tutor, talent, payout and high-trust marketplace features."
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-3">
          {kyc.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full rounded-[24px] border p-5 text-left transition ${
                item.id === selectedId
                  ? "border-red-600 bg-red-50"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">
                  {item.userName}
                </p>
                <StatusPill value={item.status} />
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                {item.role} · {item.country}
              </p>
              <p className="mt-3 text-xs font-bold text-neutral-600">
                {item.documentType}{" "}
                {item.documentNumberMasked}
              </p>
            </button>
          ))}
        </aside>

        {selected ? (
          <article className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                  {selected.id}
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {selected.userName}
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  {selected.email} · {selected.role}
                </p>
              </div>
              <StatusPill value={selected.status} />
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Document",
                  selected.documentCheck,
                ],
                ["Selfie", selected.selfieCheck],
                ["Address", selected.addressCheck],
                ["Country", selected.country],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-neutral-50 p-4"
                >
                  <p className="text-xs text-neutral-400">
                    {label}
                  </p>
                  <p className="mt-2 font-black capitalize">
                    {String(value).replaceAll("_", " ")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200 p-5">
              <p className="text-sm font-black">Risk flags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.riskFlags.length ? (
                  selected.riskFlags.map((flag) => (
                    <StatusPill key={flag} value={flag} />
                  ))
                ) : (
                  <span className="text-sm text-neutral-500">
                    No current risk flags.
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-black">
                Reviewer notes
              </label>
              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={5}
                className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton
                disabled={!canReview}
                onClick={() => resolve("verified")}
                tone="green"
              >
                <AdminIcon name="check" />
                Verify
              </ActionButton>
              <ActionButton
                disabled={!canReview}
                onClick={() =>
                  resolve("more_information")
                }
                tone="light"
              >
                Request information
              </ActionButton>
              <ActionButton
                disabled={!canReview}
                onClick={() => resolve("rejected")}
                tone="red"
              >
                Reject
              </ActionButton>
            </div>
          </article>
        ) : (
          <EmptyState
            icon="shield"
            title="No verification case selected"
            description="Select a KYC case to review its checks and evidence."
          />
        )}
      </section>
    </>
  );
}

function CoursesPage({
  session,
  courses,
  setCourses,
  addAudit,
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    level: "Professional Certificate",
    modules: 10,
    durationWeeks: 16,
    priceNgn: 350000,
    priceUsd: 229,
  });

  const canManage = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.COURSES_MANAGE,
  );

  const addCourse = (event) => {
    event.preventDefault();

    if (
      !canManage ||
      !form.title.trim() ||
      !form.category.trim()
    ) {
      return;
    }

    const course = {
      id: `COURSE-${Date.now()}`,
      ...form,
      title: form.title.trim(),
      category: form.category.trim(),
      modules: Number(form.modules),
      durationWeeks: Number(form.durationWeeks),
      priceNgn: Number(form.priceNgn),
      priceUsd: Number(form.priceUsd),
      status: "draft",
      tutorCount: 0,
      enrollmentCount: 0,
      certificateEnabled: true,
      updatedAt: new Date().toISOString(),
    };

    setCourses((current) => [course, ...current]);
    addAudit({
      action: "course.created",
      targetType: "course",
      targetId: course.id,
      summary: `${course.title} created as draft.`,
    });

    setShowForm(false);
  };

  const changeStatus = (course, status) => {
    if (!canManage) {
      return;
    }

    setCourses((current) =>
      current.map((item) =>
        item.id === course.id
          ? {
              ...item,
              status,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );

    addAudit({
      action: "course.status_changed",
      targetType: "course",
      targetId: course.id,
      summary: `${course.title} changed to ${status}.`,
    });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Academy control"
        title="Create, publish and maintain the NexaCore course catalogue."
        description="Manage course visibility, prices, duration, curriculum size, tutors, enrollment and certificate eligibility."
        action={
          <ActionButton
            disabled={!canManage}
            onClick={() => setShowForm(true)}
            tone="red"
          >
            <AdminIcon name="plus" />
            New course
          </ActionButton>
        }
      />

      {showForm && (
        <form
          onSubmit={addCourse}
          className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["title", "Course title", "text"],
              ["category", "Category", "text"],
              ["modules", "Modules", "number"],
              [
                "durationWeeks",
                "Duration weeks",
                "number",
              ],
              ["priceNgn", "Price NGN", "number"],
              ["priceUsd", "Price USD", "number"],
            ].map(([name, label, type]) => (
              <div key={name}>
                <label className="mb-2 block text-xs font-black">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[name]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [name]: event.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-2xl border border-red-200 bg-white px-4 text-sm outline-none focus:border-red-600"
                />
              </div>
            ))}

            <div>
              <label className="mb-2 block text-xs font-black">
                Level
              </label>
              <select
                value={form.level}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    level: event.target.value,
                  }))
                }
                className="h-12 w-full rounded-2xl border border-red-200 bg-white px-4 text-sm outline-none"
              >
                <option>Professional Foundation</option>
                <option>Career Foundation</option>
                <option>Professional Certificate</option>
                <option>Advanced Professional</option>
                <option>Specialist Programme</option>
                <option>Career Intensive</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <ActionButton type="submit" tone="red">
              Create draft
            </ActionButton>
            <ActionButton
              onClick={() => setShowForm(false)}
              tone="light"
            >
              Cancel
            </ActionButton>
          </div>
        </form>
      )}

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        {courses.map((course) => (
          <article
            key={course.id}
            className="rounded-[28px] border border-neutral-200 bg-white p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <StatusPill value={course.status} />
                <h2 className="mt-4 text-2xl font-black">
                  {course.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  {course.category} · {course.level}
                </p>
              </div>
              <span className="text-xs font-black text-neutral-400">
                {course.id}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Modules", course.modules],
                [
                  "Duration",
                  `${course.durationWeeks} weeks`,
                ],
                ["Tutors", course.tutorCount],
                ["Students", course.enrollmentCount],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-neutral-50 p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                    {label}
                  </p>
                  <p className="mt-2 font-black">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-red-50 p-4">
                <p className="text-xs text-red-500">Nigeria</p>
                <p className="mt-2 font-black text-red-700">
                  {formatAdminMoney(
                    course.priceNgn,
                    "NGN",
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-neutral-950 p-4 text-white">
                <p className="text-xs text-white/40">
                  International
                </p>
                <p className="mt-2 font-black">
                  {formatAdminMoney(
                    course.priceUsd,
                    "USD",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {course.status !== "published" ? (
                <ActionButton
                  disabled={!canManage}
                  onClick={() =>
                    changeStatus(course, "published")
                  }
                  tone="green"
                >
                  Publish
                </ActionButton>
              ) : (
                <ActionButton
                  disabled={!canManage}
                  onClick={() =>
                    changeStatus(course, "archived")
                  }
                  tone="light"
                >
                  Archive
                </ActionButton>
              )}
              <ActionButton
                disabled={!canManage}
                onClick={() =>
                  changeStatus(course, "draft")
                }
                tone="light"
              >
                Return to draft
              </ActionButton>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function ProjectsPage({
  session,
  projects,
  setProjects,
  disputes,
  setDisputes,
  addAudit,
}) {
  const canIntervene = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.PROJECTS_INTERVENE,
  );

  const pauseProject = (project) => {
    if (!canIntervene) {
      return;
    }

    const nextStatus =
      project.status === "admin_paused"
        ? "in_progress"
        : "admin_paused";

    setProjects((current) =>
      current.map((item) =>
        item.id === project.id
          ? {
              ...item,
              status: nextStatus,
              payoutStatus:
                nextStatus === "admin_paused"
                  ? "on_hold"
                  : item.payoutStatus,
            }
          : item,
      ),
    );

    addAudit({
      action: "project.admin_status_changed",
      targetType: "project",
      targetId: project.id,
      summary: `${project.title} changed to ${nextStatus}.`,
    });
  };

  const openDispute = (project) => {
    if (!canIntervene) {
      return;
    }

    const existing = disputes.find(
      (item) => item.projectId === project.id,
    );

    if (existing) {
      window.location.href = "/admin/disputes";
      return;
    }

    const dispute = {
      id: `DSP-${Date.now()}`,
      projectId: project.id,
      openedByUserId: session.staffId,
      openedByName: session.name,
      againstUserId:
        project.selectedTalentId || "UNKNOWN",
      againstName: "Project participant",
      reason: "Administrative intervention",
      description:
        "Operations opened this case for project review.",
      amountAtRisk: Number(project.budget || 0),
      currency: project.currency || "USD",
      status: "open",
      priority: "high",
      payoutPaused: true,
      finalReleasePaused: true,
      assignedTo: session.staffId,
      evidence: [],
      createdAt: new Date().toISOString(),
      resolvedAt: "",
      resolution: "",
    };

    setDisputes((current) => [
      dispute,
      ...current,
    ]);

    setProjects((current) =>
      current.map((item) =>
        item.id === project.id
          ? {
              ...item,
              status: "disputed",
              disputeId: dispute.id,
              payoutStatus: "on_hold",
            }
          : item,
      ),
    );

    addAudit({
      action: "dispute.opened_by_admin",
      targetType: "project",
      targetId: project.id,
      summary: `Administrative dispute ${dispute.id} opened.`,
    });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Project operations"
        title="Monitor every marketplace project and intervention point."
        description="Inspect funding, selected talent, delivery, payout and dispute status without becoming a project participant."
      />

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.id}
            className="rounded-[28px] border border-neutral-200 bg-white p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusPill value={project.status} />
              <span className="text-xs font-black text-neutral-400">
                {project.id}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-black">
              {project.title}
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              {project.service}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                  Budget
                </p>
                <p className="mt-2 font-black">
                  {formatAdminMoney(
                    project.budget,
                    project.currency,
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                  Deposit
                </p>
                <p className="mt-2 font-black">
                  {formatAdminMoney(
                    project.depositPaid,
                    project.currency,
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                  Final paid
                </p>
                <p className="mt-2 font-black">
                  {formatAdminMoney(
                    project.finalPaid,
                    project.currency,
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                  Payout
                </p>
                <p className="mt-2 font-black capitalize">
                  {project.payoutStatus.replaceAll("_", " ")}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-400">
                  Client
                </p>
                <p className="mt-2 font-black">
                  {project.clientId || "Not recorded"}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 p-4">
                <p className="text-xs text-neutral-400">
                  Selected talent
                </p>
                <p className="mt-2 font-black">
                  {project.selectedTalentId ||
                    "Not selected"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton
                disabled={!canIntervene}
                onClick={() => pauseProject(project)}
                tone={
                  project.status === "admin_paused"
                    ? "green"
                    : "light"
                }
              >
                <AdminIcon
                  name={
                    project.status === "admin_paused"
                      ? "play"
                      : "pause"
                  }
                  className="h-4 w-4"
                />
                {project.status === "admin_paused"
                  ? "Resume"
                  : "Pause project"}
              </ActionButton>
              <ActionButton
                disabled={!canIntervene}
                onClick={() => openDispute(project)}
                tone="red"
              >
                Open dispute
              </ActionButton>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function DisputesPage({
  session,
  disputes,
  setDisputes,
  projects,
  setProjects,
  payments,
  setPayments,
  addAudit,
}) {
  const [selectedId, setSelectedId] = useState(
    disputes[0]?.id || "",
  );

  const [resolution, setResolution] = useState("");

  const selected = disputes.find(
    (item) => item.id === selectedId,
  );

  const canResolve = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.DISPUTES_RESOLVE,
  );

  const resolveDispute = (outcome) => {
    if (!canResolve || !selected) {
      return;
    }

    const resolvedAt = new Date().toISOString();

    setDisputes((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status: "resolved",
              payoutPaused: false,
              finalReleasePaused: false,
              resolution:
                resolution.trim() ||
                `Resolved with outcome: ${outcome}`,
              outcome,
              resolvedAt,
            }
          : item,
      ),
    );

    setProjects((current) =>
      current.map((project) =>
        project.id === selected.projectId
          ? {
              ...project,
              status:
                outcome === "refund_client"
                  ? "cancelled"
                  : outcome === "release_talent"
                    ? "completed"
                    : "in_progress",
              payoutStatus:
                outcome === "release_talent"
                  ? "released"
                  : outcome === "refund_client"
                    ? "cancelled"
                    : "partial_hold",
            }
          : project,
      ),
    );

    if (outcome === "refund_client") {
      setPayments((current) => [
        {
          id: `REFUND-${Date.now()}`,
          projectId: selected.projectId,
          userId: selected.openedByUserId,
          type: "refund",
          amount: selected.amountAtRisk,
          currency: selected.currency,
          status: "pending",
          reference: `NX-REFUND-${Date.now()}`,
          provider: "Manual review",
          settlementStatus: "pending",
          destination: selected.openedByName,
          riskStatus: "dispute_resolution",
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
    }

    addAudit({
      action: "dispute.resolved",
      targetType: "dispute",
      targetId: selected.id,
      summary: `${selected.id} resolved with ${outcome}.`,
    });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Dispute resolution"
        title="Protect users, evidence and escrow while cases are reviewed."
        description="Opening a dispute pauses payout and final release. Resolution must record evidence, outcome, staff actor and financial effect."
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <aside className="space-y-3">
          {disputes.map((dispute) => (
            <button
              key={dispute.id}
              type="button"
              onClick={() => setSelectedId(dispute.id)}
              className={`w-full rounded-[24px] border p-5 text-left transition ${
                dispute.id === selectedId
                  ? "border-red-600 bg-red-50"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">{dispute.id}</p>
                <StatusPill value={dispute.status} />
              </div>
              <p className="mt-3 text-sm font-black">
                {dispute.reason}
              </p>
              <p className="mt-2 text-xs text-neutral-400">
                {dispute.projectId} ·{" "}
                {formatAdminMoney(
                  dispute.amountAtRisk,
                  dispute.currency,
                )}
              </p>
            </button>
          ))}
        </aside>

        {selected ? (
          <article className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                  {selected.id}
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {selected.reason}
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Project {selected.projectId}
                </p>
              </div>
              <StatusPill value={selected.status} />
            </div>

            <p className="mt-6 rounded-2xl bg-neutral-50 p-5 text-sm leading-8 text-neutral-600">
              {selected.description}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Opened by", selected.openedByName],
                ["Against", selected.againstName],
                [
                  "Amount at risk",
                  formatAdminMoney(
                    selected.amountAtRisk,
                    selected.currency,
                  ),
                ],
                ["Priority", selected.priority],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-neutral-200 p-4"
                >
                  <p className="text-xs text-neutral-400">
                    {label}
                  </p>
                  <p className="mt-2 font-black capitalize">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-black text-red-700">
                Active safeguards
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.payoutPaused && (
                  <StatusPill value="payout paused" />
                )}
                {selected.finalReleasePaused && (
                  <StatusPill
                    value="final release paused"
                  />
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-black">
                Evidence
              </p>
              <div className="mt-3 space-y-2">
                {selected.evidence.map((file) => (
                  <div
                    key={file}
                    className="rounded-2xl bg-neutral-50 p-4 text-sm font-bold"
                  >
                    {file}
                  </div>
                ))}
              </div>
            </div>

            {selected.status !== "resolved" ? (
              <>
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-black">
                    Resolution record
                  </label>
                  <textarea
                    value={resolution}
                    onChange={(event) =>
                      setResolution(event.target.value)
                    }
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600"
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <ActionButton
                    disabled={!canResolve}
                    onClick={() =>
                      resolveDispute("release_talent")
                    }
                    tone="green"
                  >
                    Release to talent
                  </ActionButton>
                  <ActionButton
                    disabled={!canResolve}
                    onClick={() =>
                      resolveDispute("refund_client")
                    }
                    tone="red"
                  >
                    Refund client
                  </ActionButton>
                  <ActionButton
                    disabled={!canResolve}
                    onClick={() =>
                      resolveDispute("split_resolution")
                    }
                    tone="light"
                  >
                    Split / revise
                  </ActionButton>
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-2xl bg-green-50 p-5">
                <p className="font-black text-green-700">
                  Resolution
                </p>
                <p className="mt-2 text-sm leading-7 text-green-900/65">
                  {selected.resolution}
                </p>
              </div>
            )}
          </article>
        ) : (
          <EmptyState
            icon="disputes"
            title="No dispute selected"
            description="Select a dispute to review its evidence and financial safeguards."
          />
        )}
      </section>
    </>
  );
}

function PaymentsPage({
  session,
  payments,
  setPayments,
  disputes,
  addAudit,
}) {
  const [filter, setFilter] = useState("all");

  const canReconcile = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.PAYMENTS_RECONCILE,
  );

  const canRelease = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.PAYMENTS_RELEASE,
  );

  const rows =
    filter === "all"
      ? payments
      : payments.filter(
          (payment) => payment.type === filter,
        );

  const changePayment = (
    payment,
    status,
    settlementStatus,
  ) => {
    const hasOpenDispute = disputes.some(
      (dispute) =>
        dispute.projectId === payment.projectId &&
        !["resolved", "closed"].includes(
          dispute.status,
        ),
    );

    if (
      status === "released" &&
      (!canRelease || hasOpenDispute)
    ) {
      return;
    }

    if (
      settlementStatus === "reconciled" &&
      !canReconcile
    ) {
      return;
    }

    setPayments((current) =>
      current.map((item) =>
        item.id === payment.id
          ? {
              ...item,
              status,
              settlementStatus,
            }
          : item,
      ),
    );

    addAudit({
      action: "payment.status_changed",
      targetType: "payment",
      targetId: payment.id,
      summary: `${payment.id} changed to ${status}/${settlementStatus}.`,
    });
  };

  const totalVerified = payments
    .filter(
      (payment) =>
        ["verified", "released", "retained"].includes(
          payment.status,
        ),
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0,
    );

  const totalHeld = payments
    .filter((payment) =>
      ["on_hold", "pending"].includes(payment.status),
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0,
    );

  return (
    <>
      <AdminPageHeader
        eyebrow="Finance and escrow"
        title="Reconcile company receipts, holds, refunds and payouts."
        description="No project dispatch, course access or payout release should occur until the backend verifies the provider transaction and company settlement."
        action={
          <ActionButton
            tone="light"
            onClick={() =>
              exportRowsToCsv(
                "nexacore-payments.csv",
                rows,
              )
            }
          >
            <AdminIcon name="export" />
            Export ledger
          </ActionButton>
        }
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Transactions", payments.length],
          [
            "Verified volume",
            formatAdminMoney(totalVerified, "USD"),
          ],
          [
            "Held / pending",
            formatAdminMoney(totalHeld, "USD"),
          ],
          [
            "Dispute holds",
            disputes.filter(
              (item) =>
                item.payoutPaused &&
                item.status !== "resolved",
            ).length,
          ],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-[24px] border border-neutral-200 bg-white p-5"
          >
            <p className="text-xs font-black uppercase tracking-[0.13em] text-neutral-400">
              {label}
            </p>
            <p className="mt-4 text-3xl font-black">
              {value}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-5">
        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
          className="h-12 rounded-2xl border border-neutral-300 bg-white px-4 text-sm font-bold outline-none focus:border-red-600"
        >
          <option value="all">All transactions</option>
          <option value="deposit">Project deposits</option>
          <option value="final">Final funding</option>
          <option value="talent_payout">
            Talent payouts
          </option>
          <option value="course_payment">
            Course payments
          </option>
          <option value="refund">Refunds</option>
        </select>
      </section>

      <section className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full">
            <thead className="bg-neutral-950 text-left text-xs uppercase tracking-[0.12em] text-white/55">
              <tr>
                <th className="px-5 py-4">Transaction</th>
                <th className="px-5 py-4">Project / user</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Provider</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Settlement</th>
                <th className="px-5 py-4">Risk</th>
                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((payment) => {
                const hasOpenDispute = disputes.some(
                  (dispute) =>
                    dispute.projectId ===
                      payment.projectId &&
                    !["resolved", "closed"].includes(
                      dispute.status,
                    ),
                );

                return (
                  <tr
                    key={payment.id}
                    className="border-t border-neutral-200"
                  >
                    <td className="px-5 py-5">
                      <p className="font-black capitalize">
                        {payment.type.replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        {payment.id} · {payment.reference}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm">
                      {payment.projectId ||
                        payment.userId ||
                        "Platform"}
                    </td>
                    <td className="px-5 py-5 font-black">
                      {formatAdminMoney(
                        payment.amount,
                        payment.currency,
                      )}
                    </td>
                    <td className="px-5 py-5 text-sm">
                      {payment.provider}
                    </td>
                    <td className="px-5 py-5">
                      <StatusPill value={payment.status} />
                    </td>
                    <td className="px-5 py-5">
                      <StatusPill
                        value={
                          payment.settlementStatus
                        }
                      />
                    </td>
                    <td className="px-5 py-5">
                      <StatusPill
                        value={payment.riskStatus}
                      />
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        {payment.settlementStatus !==
                          "reconciled" && (
                          <ActionButton
                            disabled={!canReconcile}
                            onClick={() =>
                              changePayment(
                                payment,
                                payment.status,
                                "reconciled",
                              )
                            }
                            tone="light"
                          >
                            Reconcile
                          </ActionButton>
                        )}

                        {payment.type ===
                          "talent_payout" &&
                          payment.status !==
                            "released" && (
                            <ActionButton
                              disabled={
                                !canRelease ||
                                hasOpenDispute
                              }
                              onClick={() =>
                                changePayment(
                                  payment,
                                  "released",
                                  "reconciled",
                                )
                              }
                              tone="green"
                            >
                              Release
                            </ActionButton>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function ReportsPage({
  session,
  users,
  courses,
  projects,
  disputes,
  payments,
  support,
  kyc,
}) {
  const canExport = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.REPORTS_EXPORT,
  );

  const roleRows = ["student", "tutor", "client", "talent"].map(
    (role) => ({
      role,
      count: users.filter((user) => user.role === role)
        .length,
    }),
  );

  const maxRoleCount = Math.max(
    1,
    ...roleRows.map((row) => row.count),
  );

  const projectRevenue = payments
    .filter((payment) =>
      ["deposit", "final", "nexacore_fee"].includes(
        payment.type,
      ),
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0,
    );

  const academyRevenue = payments
    .filter(
      (payment) =>
        payment.type === "course_payment",
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0,
    );

  const reportCards = [
    {
      title: "User and verification report",
      description:
        "Role distribution, status, verification and account-risk summary.",
      rows: users,
      filename: "users-report.csv",
    },
    {
      title: "Academy report",
      description:
        "Course publication, pricing, tutor count and enrollment summary.",
      rows: courses,
      filename: "academy-report.csv",
    },
    {
      title: "Marketplace report",
      description:
        "Project status, funding, assignment and delivery summary.",
      rows: projects,
      filename: "marketplace-report.csv",
    },
    {
      title: "Financial report",
      description:
        "Payment, reconciliation, payout, hold and refund ledger.",
      rows: payments,
      filename: "financial-report.csv",
    },
    {
      title: "Dispute and support report",
      description:
        "Open disputes, outcomes, ticket status and response workload.",
      rows: [...disputes, ...support],
      filename: "operations-report.csv",
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Reports and analytics"
        title="Export operational, financial and academy intelligence."
        description="Reports are filtered by staff permission and should be generated server-side for authoritative production data."
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Marketplace inflow", projectRevenue],
          ["Academy inflow", academyRevenue],
          [
            "Verification completion",
            `${Math.round(
              (kyc.filter(
                (item) => item.status === "verified",
              ).length /
                Math.max(1, kyc.length)) *
                100,
            )}%`,
          ],
          [
            "Dispute rate",
            `${Math.round(
              (disputes.length /
                Math.max(1, projects.length)) *
                100,
            )}%`,
          ],
        ].map(([label, value], index) => (
          <article
            key={label}
            className="rounded-[24px] border border-neutral-200 bg-white p-5"
          >
            <p className="text-xs font-black uppercase tracking-[0.13em] text-neutral-400">
              {label}
            </p>
            <p className="mt-4 text-3xl font-black">
              {typeof value === "number"
                ? formatAdminMoney(value, "USD")
                : value}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            User mix
          </p>
          <div className="mt-7 space-y-5">
            {roleRows.map((row) => (
              <div key={row.role}>
                <div className="flex items-center justify-between">
                  <span className="capitalize text-white/55">
                    {row.role}
                  </span>
                  <span className="font-black">{row.count}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-red-600"
                    style={{
                      width: `${
                        (row.count / maxRoleCount) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4 lg:grid-cols-2">
          {reportCards.map((report) => (
            <article
              key={report.title}
              className="rounded-[28px] border border-neutral-200 bg-white p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AdminIcon name="reports" />
              </div>
              <h3 className="mt-5 text-xl font-black">
                {report.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-500">
                {report.description}
              </p>
              <ActionButton
                disabled={!canExport}
                onClick={() =>
                  exportRowsToCsv(
                    report.filename,
                    report.rows,
                  )
                }
                tone="dark"
              >
                <AdminIcon name="export" />
                Export CSV
              </ActionButton>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function CategoriesPage({
  session,
  categories,
  setCategories,
  addAudit,
}) {
  const [name, setName] = useState("");
  const [area, setArea] = useState(
    "academy_and_services",
  );

  const canManage = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.CATEGORIES_MANAGE,
  );

  const addCategory = (event) => {
    event.preventDefault();

    if (!canManage || !name.trim()) {
      return;
    }

    const category = {
      id: `CAT-${Date.now()}`,
      name: name.trim(),
      area,
      status: "active",
      courseCount: 0,
      serviceCount: 0,
      matchingEnabled:
        area !== "academy",
      sortOrder: categories.length + 1,
    };

    setCategories((current) => [
      ...current,
      category,
    ]);

    addAudit({
      action: "category.created",
      targetType: "category",
      targetId: category.id,
      summary: `${category.name} category created.`,
    });

    setName("");
  };

  const toggle = (category, field) => {
    if (!canManage) {
      return;
    }

    setCategories((current) =>
      current.map((item) =>
        item.id === category.id
          ? {
              ...item,
              [field]:
                typeof item[field] === "boolean"
                  ? !item[field]
                  : item[field] === "active"
                    ? "inactive"
                    : "active",
            }
          : item,
      ),
    );

    addAudit({
      action: "category.updated",
      targetType: "category",
      targetId: category.id,
      summary: `${category.name} ${field} changed.`,
    });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue categories"
        title="Control academy and service matching categories."
        description="Category status affects course navigation, service discovery, matching jobs and public catalogue visibility."
      />

      <form
        onSubmit={addCategory}
        className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6"
      >
        <div className="grid gap-4 md:grid-cols-[1fr_260px_auto]">
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="New category name"
            className="h-12 rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
          />
          <select
            value={area}
            onChange={(event) =>
              setArea(event.target.value)
            }
            className="h-12 rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none"
          >
            <option value="academy_and_services">
              Academy and services
            </option>
            <option value="academy">Academy only</option>
            <option value="services">
              Services only
            </option>
          </select>
          <ActionButton
            type="submit"
            disabled={!canManage}
            tone="red"
          >
            <AdminIcon name="plus" />
            Add category
          </ActionButton>
        </div>
      </form>

      <section className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {categories
          .slice()
          .sort(
            (a, b) => a.sortOrder - b.sortOrder,
          )
          .map((category) => (
            <article
              key={category.id}
              className="rounded-[28px] border border-neutral-200 bg-white p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <StatusPill value={category.status} />
                <span className="text-xs text-neutral-400">
                  #{category.sortOrder}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-black">
                {category.name}
              </h2>
              <p className="mt-2 text-xs capitalize text-neutral-400">
                {category.area.replaceAll("_", " ")}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs text-neutral-400">
                    Courses
                  </p>
                  <p className="mt-2 text-xl font-black">
                    {category.courseCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs text-neutral-400">
                    Services
                  </p>
                  <p className="mt-2 text-xl font-black">
                    {category.serviceCount}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <ActionButton
                  disabled={!canManage}
                  onClick={() =>
                    toggle(category, "status")
                  }
                  tone="light"
                >
                  {category.status === "active"
                    ? "Disable"
                    : "Enable"}
                </ActionButton>
                <ActionButton
                  disabled={!canManage}
                  onClick={() =>
                    toggle(
                      category,
                      "matchingEnabled",
                    )
                  }
                  tone={
                    category.matchingEnabled
                      ? "green"
                      : "light"
                  }
                >
                  Matching{" "}
                  {category.matchingEnabled
                    ? "on"
                    : "off"}
                </ActionButton>
              </div>
            </article>
          ))}
      </section>
    </>
  );
}

function SupportPage({
  session,
  support,
  setSupport,
  addAudit,
}) {
  const [selectedId, setSelectedId] = useState(
    support[0]?.id || "",
  );

  const [response, setResponse] = useState("");

  const selected = support.find(
    (item) => item.id === selectedId,
  );

  const canManage = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.SUPPORT_MANAGE,
  );

  const resolve = () => {
    if (
      !canManage ||
      !selected ||
      !response.trim()
    ) {
      return;
    }

    setSupport((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status: "answered",
              assignedTo: session.staffId,
              response: response.trim(),
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );

    addAudit({
      action: "support.answered",
      targetType: "support_ticket",
      targetId: selected.id,
      summary: `${selected.id} answered by ${session.name}.`,
    });

    setResponse("");
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Support operations"
        title="Assign, answer and escalate user support tickets."
        description="Support agents can see only the records needed to resolve assigned issues. Private messages remain restricted unless reported or attached to a dispute."
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[370px_1fr]">
        <aside className="space-y-3">
          {support.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => setSelectedId(ticket.id)}
              className={`w-full rounded-[24px] border p-5 text-left ${
                ticket.id === selectedId
                  ? "border-red-600 bg-red-50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">{ticket.id}</p>
                <StatusPill value={ticket.status} />
              </div>
              <p className="mt-3 font-black">
                {ticket.subject}
              </p>
              <p className="mt-2 text-xs text-neutral-400">
                {ticket.userName} · {ticket.category}
              </p>
            </button>
          ))}
        </aside>

        {selected ? (
          <article className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              {selected.category}
            </p>
            <h2 className="mt-3 text-3xl font-black">
              {selected.subject}
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              {selected.userName} · {selected.id}
            </p>

            <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
              <p className="text-sm leading-8 text-neutral-600">
                {selected.message}
              </p>
            </div>

            {selected.response && (
              <div className="mt-5 rounded-2xl bg-green-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.13em] text-green-700">
                  Existing response
                </p>
                <p className="mt-3 text-sm leading-7 text-green-900/70">
                  {selected.response}
                </p>
              </div>
            )}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-black">
                Staff response
              </label>
              <textarea
                value={response}
                onChange={(event) =>
                  setResponse(event.target.value)
                }
                rows={6}
                className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton
                disabled={!canManage}
                onClick={resolve}
                tone="green"
              >
                Answer ticket
              </ActionButton>
              <ActionButton
                disabled={!canManage}
                onClick={() =>
                  setSupport((current) =>
                    current.map((item) =>
                      item.id === selected.id
                        ? {
                            ...item,
                            status: "escalated",
                            assignedTo:
                              session.staffId,
                          }
                        : item,
                    ),
                  )
                }
                tone="red"
              >
                Escalate
              </ActionButton>
            </div>
          </article>
        ) : (
          <EmptyState
            icon="support"
            title="No support ticket selected"
            description="Select a ticket to review and respond."
          />
        )}
      </section>
    </>
  );
}

function StaffPage({
  session,
  staff,
  setStaff,
  addAudit,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: ADMIN_ROLES.SUPPORT_AGENT,
  });

  const canManage = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.STAFF_MANAGE,
  );

  const addStaff = (event) => {
    event.preventDefault();

    if (
      !canManage ||
      !form.name.trim() ||
      !form.email.trim()
    ) {
      return;
    }

    const member = {
      id: `STAFF-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      status: "invited",
      mfaEnabled: false,
      lastLoginAt: "",
      createdAt: new Date().toISOString(),
    };

    setStaff((current) => [
      member,
      ...current,
    ]);

    addAudit({
      action: "staff.invited",
      targetType: "staff",
      targetId: member.id,
      summary: `${member.email} invited as ${member.role}.`,
    });

    setForm({
      name: "",
      email: "",
      role: ADMIN_ROLES.SUPPORT_AGENT,
    });
  };

  const toggleStaff = (member) => {
    if (
      !canManage ||
      member.role === ADMIN_ROLES.SUPER_ADMIN
    ) {
      return;
    }

    const status =
      member.status === "active"
        ? "disabled"
        : "active";

    setStaff((current) =>
      current.map((item) =>
        item.id === member.id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );

    addAudit({
      action: "staff.status_changed",
      targetType: "staff",
      targetId: member.id,
      summary: `${member.email} changed to ${status}.`,
    });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Staff and permissions"
        title="Give staff only the access required for their work."
        description="Separate KYC, finance, academy, support, reporting and operations permissions instead of using one unrestricted administrator role."
      />

      <form
        onSubmit={addStaff}
        className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6"
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_260px_auto]">
          <input
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            placeholder="Staff name"
            className="h-12 rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
          />
          <input
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            placeholder="Work email"
            className="h-12 rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
          />
          <select
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                role: event.target.value,
              }))
            }
            className="h-12 rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none"
          >
            {Object.values(ADMIN_ROLES).map((role) => (
              <option key={role} value={role}>
                {ADMIN_ROLE_LABELS[role]}
              </option>
            ))}
          </select>
          <ActionButton
            type="submit"
            disabled={!canManage}
            tone="red"
          >
            Invite staff
          </ActionButton>
        </div>
      </form>

      <section className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full">
            <thead className="bg-neutral-950 text-left text-xs uppercase tracking-[0.12em] text-white/55">
              <tr>
                <th className="px-5 py-4">Staff member</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">MFA</th>
                <th className="px-5 py-4">Last login</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-neutral-200"
                >
                  <td className="px-5 py-5">
                    <p className="font-black">
                      {member.name}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {member.email} · {member.id}
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    {ADMIN_ROLE_LABELS[member.role]}
                  </td>
                  <td className="px-5 py-5">
                    <StatusPill
                      value={
                        member.mfaEnabled
                          ? "verified"
                          : "pending"
                      }
                    />
                  </td>
                  <td className="px-5 py-5 text-sm text-neutral-500">
                    {member.lastLoginAt || "Never"}
                  </td>
                  <td className="px-5 py-5">
                    <StatusPill value={member.status} />
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex justify-end">
                      <ActionButton
                        disabled={
                          !canManage ||
                          member.role ===
                            ADMIN_ROLES.SUPER_ADMIN
                        }
                        onClick={() =>
                          toggleStaff(member)
                        }
                        tone="light"
                      >
                        {member.status === "active"
                          ? "Disable"
                          : "Activate"}
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function AuditPage({ audit }) {
  const [query, setQuery] = useState("");

  const filtered = audit.filter((entry) =>
    `${entry.actorName} ${entry.action} ${entry.targetId} ${entry.summary}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="Audit and accountability"
        title="Trace sensitive actions by actor, target and time."
        description="Production audit records should be append-only and include previous state, new state, IP, device and correlation identifiers."
        action={
          <ActionButton
            onClick={() =>
              exportRowsToCsv(
                "nexacore-audit-log.csv",
                filtered,
              )
            }
            tone="light"
          >
            <AdminIcon name="export" />
            Export audit
          </ActionButton>
        }
      />

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-5">
        <div className="relative">
          <AdminIcon
            name="search"
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search actor, action or target..."
            className="h-14 w-full rounded-2xl border border-neutral-300 pl-12 pr-4 text-sm outline-none focus:border-red-600"
          />
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {filtered.map((entry) => (
          <article
            key={entry.id}
            className="grid gap-4 rounded-[24px] border border-neutral-200 bg-white p-5 lg:grid-cols-[220px_220px_1fr_auto] lg:items-center"
          >
            <div>
              <p className="font-black">
                {entry.actorName}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                {entry.actorId}
              </p>
            </div>
            <div>
              <p className="text-sm font-black text-red-600">
                {entry.action}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                {entry.targetType} · {entry.targetId}
              </p>
            </div>
            <p className="text-sm leading-7 text-neutral-600">
              {entry.summary}
            </p>
            <p className="text-xs text-neutral-400">
              {entry.createdAt}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}

function SettingsPage({
  session,
  settings,
  setSettings,
  addAudit,
}) {
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState("");

  const canManage = hasAdminPermission(
    session,
    ADMIN_PERMISSIONS.SETTINGS_MANAGE,
  );

  const updateField = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const save = (event) => {
    event.preventDefault();

    if (!canManage) {
      return;
    }

    setSettings(form);

    addAudit({
      action: "platform.settings_updated",
      targetType: "platform_settings",
      targetId: "GLOBAL",
      summary:
        "Commercial and operational settings updated.",
    });

    setMessage(
      "Platform settings saved in the local preview.",
    );
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Super-admin controls"
        title="Control platform rules, revenue and emergency safeguards."
        description="Only the owner or authorised super administrators should change commercial percentages, registration state, payout controls or maintenance mode."
      />

      {!canManage && <PermissionNotice />}

      <form
        onSubmit={save}
        className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <section>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Commercial rules
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              {[
                [
                  "academyTutorSharePercent",
                  "Tutor share %",
                ],
                [
                  "academyPlatformSharePercent",
                  "Academy platform %",
                ],
                [
                  "serviceDepositPercent",
                  "Project deposit %",
                ],
                [
                  "serviceFinalPercent",
                  "Final funding %",
                ],
                [
                  "serviceTalentSharePercent",
                  "Talent share %",
                ],
                [
                  "servicePlatformSharePercent",
                  "Marketplace fee %",
                ],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="mb-2 block text-sm font-black">
                    {label}
                  </label>
                  <input
                    name={name}
                    type="number"
                    min="0"
                    max="100"
                    value={form[name]}
                    onChange={updateField}
                    disabled={!canManage}
                    className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 disabled:bg-neutral-100"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Platform safeguards
            </p>

            <div className="mt-5 space-y-3">
              {[
                [
                  "registrationsEnabled",
                  "Registrations enabled",
                ],
                [
                  "courseEnrollmentEnabled",
                  "Course enrollment enabled",
                ],
                [
                  "projectPostingEnabled",
                  "Project posting enabled",
                ],
                [
                  "automaticPayoutEnabled",
                  "Automatic payout enabled",
                ],
                [
                  "emergencyPaymentHold",
                  "Emergency payment hold",
                ],
                [
                  "maintenanceMode",
                  "Maintenance mode",
                ],
              ].map(([name, label]) => (
                <label
                  key={name}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-50 p-4"
                >
                  <span className="text-sm font-black">
                    {label}
                  </span>
                  <input
                    name={name}
                    type="checkbox"
                    checked={Boolean(form[name])}
                    onChange={updateField}
                    disabled={!canManage}
                    className="h-5 w-5 accent-red-600"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-black text-red-700">
            Production restriction
          </p>
          <p className="mt-2 text-sm leading-7 text-red-900/65">
            Revenue percentages already attached to active contracts must not be changed retroactively. Production settings require versioning, approval and audit records.
          </p>
        </section>

        <button
          type="submit"
          disabled={!canManage}
          className="mt-6 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save platform settings
        </button>

        {message && (
          <p className="mt-4 rounded-2xl bg-green-50 p-4 text-center text-sm font-bold text-green-700">
            {message}
          </p>
        )}
      </form>
    </>
  );
}

export function AdminWorkspace({
  session,
  currentPath,
  users,
  setUsers,
  kyc,
  setKyc,
  courses,
  setCourses,
  projects,
  setProjects,
  disputes,
  setDisputes,
  payments,
  setPayments,
  categories,
  setCategories,
  support,
  setSupport,
  staff,
  setStaff,
  audit,
  setAudit,
  settings,
  setSettings,
  notifications,
}) {
  const addAudit = ({
    action,
    targetType,
    targetId,
    summary,
  }) => {
    const entry = writeAuditLog({
      session,
      action,
      targetType,
      targetId,
      summary,
    });

    setAudit((current) => [entry, ...current]);
  };

  if (currentPath === "/admin/dashboard") {
    return (
      <DashboardPage
        users={users}
        kyc={kyc}
        courses={courses}
        projects={projects}
        disputes={disputes}
        payments={payments}
        support={support}
        notifications={notifications}
      />
    );
  }

  if (currentPath === "/admin/users") {
    return (
      <UsersPage
        session={session}
        users={users}
        setUsers={setUsers}
        addAudit={addAudit}
      />
    );
  }

  if (currentPath === "/admin/kyc") {
    return (
      <KycPage
        session={session}
        kyc={kyc}
        setKyc={setKyc}
        users={users}
        setUsers={setUsers}
        addAudit={addAudit}
      />
    );
  }

  if (currentPath === "/admin/courses") {
    return (
      <CoursesPage
        session={session}
        courses={courses}
        setCourses={setCourses}
        addAudit={addAudit}
      />
    );
  }

  if (currentPath === "/admin/projects") {
    return (
      <ProjectsPage
        session={session}
        projects={projects}
        setProjects={setProjects}
        disputes={disputes}
        setDisputes={setDisputes}
        addAudit={addAudit}
      />
    );
  }

  if (currentPath === "/admin/disputes") {
    return (
      <DisputesPage
        session={session}
        disputes={disputes}
        setDisputes={setDisputes}
        projects={projects}
        setProjects={setProjects}
        payments={payments}
        setPayments={setPayments}
        addAudit={addAudit}
      />
    );
  }

  if (currentPath === "/admin/payments") {
    return (
      <PaymentsPage
        session={session}
        payments={payments}
        setPayments={setPayments}
        disputes={disputes}
        addAudit={addAudit}
      />
    );
  }

  if (currentPath === "/admin/reports") {
    return (
      <ReportsPage
        session={session}
        users={users}
        courses={courses}
        projects={projects}
        disputes={disputes}
        payments={payments}
        support={support}
        kyc={kyc}
      />
    );
  }

  if (currentPath === "/admin/categories") {
    return (
      <CategoriesPage
        session={session}
        categories={categories}
        setCategories={setCategories}
        addAudit={addAudit}
      />
    );
  }

  if (currentPath === "/admin/support") {
    return (
      <SupportPage
        session={session}
        support={support}
        setSupport={setSupport}
        addAudit={addAudit}
      />
    );
  }

  if (currentPath === "/admin/staff") {
    return (
      <StaffPage
        session={session}
        staff={staff}
        setStaff={setStaff}
        addAudit={addAudit}
      />
    );
  }

  if (currentPath === "/admin/audit") {
    return <AuditPage audit={audit} />;
  }

  if (currentPath === "/admin/settings") {
    return (
      <SettingsPage
        session={session}
        settings={settings}
        setSettings={setSettings}
        addAudit={addAudit}
      />
    );
  }

  return (
    <EmptyState
      icon="dashboard"
      title="Administrative page not found"
      description="Return to the private operations overview."
    />
  );
}

export function getAdminNavigation(session) {
  return navItems.filter((item) =>
    hasAdminPermission(session, item.permission),
  );
}

export const adminDefaults = {
  users: defaultAdminUsers,
  kyc: defaultKycCases,
  courses: defaultAdminCourses,
  projects: fallbackProjects,
  disputes: defaultDisputes,
  payments: fallbackPayments,
  categories: defaultAdminCategories,
  support: fallbackSupportTickets,
  staff: defaultAdminStaff,
  audit: defaultAdminAudit,
  settings: defaultAdminSettings,
};
