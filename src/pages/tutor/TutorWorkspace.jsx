import { useEffect, useMemo, useRef, useState } from "react";

import {
  TUTOR_REVENUE_SHARE,
  TUTOR_STORAGE_KEYS,
  calculateTutorRating,
  defaultAssignments,
  defaultEarnings,
  defaultMaterials,
  defaultReviews,
  defaultStudentRequests,
  defaultSubmissions,
  defaultTutorClasses,
  defaultTutorMessages,
  defaultTutorProfile,
  formatMoney,
  getAllTutorStudents,
  getStudentById,
  getTutorCourse,
  loadTutorValue,
  saveTutorValue,
  tutorCourses,
} from "./tutorData";

const tutorNavigation = [
  { label: "Overview", href: "/tutor/dashboard", icon: "home" },
  { label: "Student Requests", href: "/tutor/requests", icon: "requests" },
  { label: "My Classes", href: "/tutor/classes", icon: "classes" },
  { label: "Materials", href: "/tutor/materials", icon: "materials" },
  { label: "Assignments", href: "/tutor/assignments", icon: "assignment" },
  { label: "Grading", href: "/tutor/grading", icon: "grading" },
  { label: "Earnings", href: "/tutor/earnings", icon: "earnings" },
  { label: "Messages", href: "/tutor/messages", icon: "messages" },
  { label: "Reviews", href: "/tutor/reviews", icon: "reviews" },
];

export function isTutorWorkspacePath(pathname) {
  return (
    pathname === "/tutor/dashboard" ||
    pathname === "/tutor/requests" ||
    pathname === "/tutor/classes" ||
    pathname === "/tutor/materials" ||
    pathname === "/tutor/assignments" ||
    pathname === "/tutor/grading" ||
    pathname === "/tutor/earnings" ||
    pathname === "/tutor/messages" ||
    pathname === "/tutor/reviews" ||
    pathname === "/tutor/profile" ||
    pathname === "/tutor/settings" ||
    /^\/tutor\/classes\/\d+\/room$/.test(pathname)
  );
}

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => loadTutorValue(key, fallback));

  const updateValue = (nextValue) => {
    setValue((currentValue) => {
      const resolved =
        typeof nextValue === "function" ? nextValue(currentValue) : nextValue;

      saveTutorValue(key, resolved);
      return resolved;
    });
  };

  return [value, updateValue];
}

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };

  const icons = {
    home: <><path d="m3 11 9-8 9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v10h14V10M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></>,
    requests: <><circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M2 21c1-5 3.5-7 7-7 2.2 0 4 1 5.2 2.8M17 11v6M14 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    classes: <><rect x="3" y="5" width="13" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="m16 10 5-3v10l-5-3v-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></>,
    materials: <><path d="M5 4h14v16H5z" stroke="currentColor" strokeWidth="2"/><path d="M9 4v16M12 8h4M12 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    assignment: <><path d="M7 4h10v16H7z" stroke="currentColor" strokeWidth="2"/><path d="M9 4V2h6v2M10 9h4M10 13h4M10 17h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    grading: <><path d="M4 19h16M6 15l3-3 3 2 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="7" r="2" stroke="currentColor" strokeWidth="2"/></>,
    earnings: <><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 9h18M7 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    messages: <><path d="M4 5h16v12H8l-4 4V5Z" stroke="currentColor" strokeWidth="2"/><path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    reviews: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
    close: <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" stroke="currentColor" strokeWidth="2"/><path d="M10 21h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    search: <><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
    check: <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    plus: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
    send: <path d="m3 11 18-8-8 18-2-8-8-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>,
    camera: <><rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><path d="m17 10 4-2v8l-4-2v-4Z" stroke="currentColor" strokeWidth="2"/></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    phone: <path d="M5 4c1 7 8 14 15 15l1-5-5-2-2 2c-3-1-5-3-6-6l2-2-2-5-3 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>,
    users: <><circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M2 21c1-5 3.5-7 7-7s6 2 7 7M17 7a3 3 0 1 1 0 6M17 15c3 0 5 2 5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    activity: <><path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="m7 15 3-4 3 2 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
    timer: <><circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2"/><path d="M12 9v5l3 2M9 3h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
    hand: <path d="M7 12V6a2 2 0 1 1 4 0v5-7a2 2 0 1 1 4 0v7-5a2 2 0 1 1 4 0v8c0 5-3 7-7 7H9c-3 0-5-2-6-5l-1-4a2 2 0 0 1 4-1l1 1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>,
    settings: <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-4l-.4 3.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L6 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 3.1h4l.4-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" stroke="currentColor" strokeWidth="1.5"/></>,
    logout: <><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  };

  return <svg {...common}>{icons[name]}</svg>;
}

function TutorAvatar({ profile, size = "h-11 w-11", text = "text-xs" }) {
  const initials = `${profile.firstName?.[0] || "T"}${profile.lastName?.[0] || ""}`;

  if (profile.profilePhoto) {
    return <img src={profile.profilePhoto} alt={`${profile.firstName} ${profile.lastName}`} className={`${size} shrink-0 rounded-full object-cover`} />;
  }

  return <div className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-red-600 font-black text-white ${text}`}>{initials}</div>;
}

function TutorShell({ title, profile, children, requestCount, gradingCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname;

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-neutral-950">
      {menuOpen && (
        <>
          <button type="button" onClick={() => setMenuOpen(false)} className="fixed inset-0 top-[88px] z-40 bg-black/45 backdrop-blur-sm" aria-label="Close navigation" />
          <aside className="fixed left-4 top-[104px] z-50 flex max-h-[calc(100vh-120px)] w-[calc(100%-2rem)] max-w-[360px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950 text-white shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Tutor navigation</p><h2 className="mt-1 text-lg font-black">Teaching workspace</h2></div>
              <button type="button" onClick={() => setMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] hover:bg-red-600"><Icon name="close" /></button>
            </div>

            <a href="/tutor/profile" className="m-4 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
              <TutorAvatar profile={profile} size="h-12 w-12" />
              <div className="min-w-0"><p className="truncate text-sm font-black">{profile.firstName} {profile.lastName}</p><p className="mt-1 truncate text-xs text-white/45">{profile.headline}</p></div>
            </a>

            <nav className="flex-1 overflow-y-auto px-4 pb-5">
              <div className="space-y-1">
                {tutorNavigation.map((item) => {
                  const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
                  const badge = item.href === "/tutor/requests" ? requestCount : item.href === "/tutor/grading" ? gradingCount : 0;
                  return (
                    <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${active ? "bg-red-600 text-white" : "text-white/55 hover:bg-white/[0.07] hover:text-white"}`}>
                      <Icon name={item.icon} /><span className="flex-1">{item.label}</span>
                      {badge > 0 && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-black text-red-600">{badge}</span>}
                    </a>
                  );
                })}
              </div>
              <div className="my-5 h-px bg-white/10" />
              <a href="/tutor/settings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 hover:bg-white/[0.07] hover:text-white"><Icon name="settings" />Settings</a>
              <a href="/login" className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 hover:bg-red-600/15 hover:text-red-400"><Icon name="logout" />Log out</a>
            </nav>
          </aside>
        </>
      )}

      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="flex h-[88px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <button type="button" onClick={() => setMenuOpen((value) => !value)} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${menuOpen ? "border-red-600 bg-red-600 text-white" : "border-neutral-200 bg-white hover:border-red-600 hover:text-red-600"}`}><Icon name={menuOpen ? "close" : "menu"} className="h-6 w-6" /></button>
            <a href="/" className="hidden sm:inline-flex"><img src="/images/logo/nexacore-logo-light.png" alt="NexaCore" className="h-11 w-auto max-w-[170px] object-contain" /></a>
            <div className="hidden h-9 w-px bg-neutral-200 sm:block" />
            <div className="min-w-0"><p className="hidden text-xs font-bold uppercase tracking-[0.16em] text-neutral-400 sm:block">Tutor workspace</p><h1 className="truncate text-base font-black sm:mt-1 sm:text-xl">{title}</h1></div>
          </div>

          <div className="hidden max-w-md flex-1 lg:block"><div className="relative"><Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" /><input type="search" placeholder="Search classes, students and assignments..." className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-12 pr-5 text-sm outline-none focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10" /></div></div>

          <div className="flex items-center gap-3">
            <button type="button" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-red-50 hover:text-red-600"><Icon name="bell" />{requestCount + gradingCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white">{requestCount + gradingCount}</span>}</button>
            <a href="/tutor/profile" className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white p-1.5 pr-3"><TutorAvatar profile={profile} size="h-9 w-9" /><div className="hidden xl:block"><p className="text-xs font-black">{profile.firstName} {profile.lastName}</p><p className="text-[10px] text-neutral-400">View profile</p></div></a>
          </div>
        </div>
      </header>

      <main className="px-5 py-7 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}

function Hero({ eyebrow, title, description, image }) {
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-neutral-950">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/25" />
      <div className="relative z-10 px-7 py-12 sm:px-10 lg:px-12"><p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">{eyebrow}</p><h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">{title}</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">{description}</p></div>
    </section>
  );
}

function DashboardPage({ requests, classes, submissions, earnings, reviews }) {
  const pendingRequests = requests.filter((item) => item.status === "pending").length;
  const gradingQueue = submissions.filter((item) => item.status === "submitted").length;
  const upcomingClasses = classes.filter((item) => item.status === "scheduled").length;
  const rating = calculateTutorRating(reviews);

  return (
    <>
      <Hero eyebrow="Tutor dashboard" title="Manage students, classes, teaching work and earnings." description="Run group or individual classes, share materials, create assignments, grade submissions and communicate with your learners." image="/images/hero/banner1.png" />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Student requests", pendingRequests, "requests"],
          ["Upcoming classes", upcomingClasses, "classes"],
          ["Waiting for grading", gradingQueue, "grading"],
          ["Available earnings", formatMoney(earnings.availableBalance), "earnings"],
          ["Tutor rating", `${rating}/5`, "reviews"],
        ].map(([label, value, icon]) => (
          <article key={label} className="rounded-[24px] border border-neutral-200 bg-white p-5"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600"><Icon name={icon} /></div><p className="mt-5 text-2xl font-black">{value}</p><p className="mt-1 text-sm font-bold text-neutral-500">{label}</p></article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"><div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">Upcoming teaching</p><h2 className="mt-2 text-2xl font-black">Next classes</h2></div><a href="/tutor/classes" className="text-sm font-black text-red-600">Manage classes</a></div><div className="mt-6 space-y-4">{classes.slice(0, 3).map((item) => { const course = getTutorCourse(item.courseId); return <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 p-5 sm:flex-row sm:items-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white"><Icon name={item.type === "group" ? "users" : "classes"} /></div><div className="flex-1"><h3 className="font-black">{item.title}</h3><p className="mt-1 text-xs text-neutral-400">{course.title} · {item.date} at {item.time} · {item.type === "group" ? "Group class" : "Single student"}</p></div><a href={`/tutor/classes/${item.id}/room`} className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-xs font-black text-white hover:bg-neutral-950"><Icon name="camera" className="h-4 w-4" />Open room</a></article>; })}</div></div>

        <aside className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8"><p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">Quick actions</p><h2 className="mt-2 text-2xl font-black">Start teaching work</h2><div className="mt-6 grid gap-3">{[
          ["Schedule a group class", "/tutor/classes", "users"],
          ["Start a single student call", "/tutor/messages", "camera"],
          ["Upload learning material", "/tutor/materials", "upload"],
          ["Create an assignment", "/tutor/assignments", "assignment"],
          ["Grade student work", "/tutor/grading", "grading"],
        ].map(([label, href, icon]) => <a key={label} href={href} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4 text-sm font-black hover:bg-red-600"><Icon name={icon} />{label}</a>)}</div></aside>
      </section>
    </>
  );
}

function RequestsPage({ requests, setRequests }) {
  const updateRequest = (requestId, status) => setRequests((current) => current.map((request) => request.id === requestId ? { ...request, status } : request));

  return (
    <>
      <Hero eyebrow="Student requests" title="Review requests before students join your classes or mentoring sessions." description="Accept suitable requests, decline requests that do not fit the current cohort or start a direct conversation before deciding." image="/images/hero/banner4.png" />
      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"><div className="space-y-4">{requests.map((request) => { const course = getTutorCourse(request.courseId); return <article key={request.id} className="grid gap-5 rounded-2xl border border-neutral-200 p-5 lg:grid-cols-[auto_1fr_auto] lg:items-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">{request.initials}</div><div><div className="flex flex-wrap items-center gap-3"><h2 className="font-black">{request.studentName}</h2><span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${request.status === "pending" ? "bg-amber-50 text-amber-700" : request.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}>{request.status}</span></div><p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-red-600">{request.requestType} · {course.title}</p><p className="mt-3 text-sm leading-7 text-neutral-500">{request.note}</p></div><div className="flex flex-wrap gap-2">{request.status === "pending" && <><button type="button" onClick={() => updateRequest(request.id, "accepted")} className="rounded-full bg-green-600 px-5 py-3 text-xs font-black text-white">Accept</button><button type="button" onClick={() => updateRequest(request.id, "declined")} className="rounded-full bg-red-600 px-5 py-3 text-xs font-black text-white">Decline</button></>}<a href={`/tutor/messages?student=${request.id}`} className="rounded-full border border-neutral-300 px-5 py-3 text-xs font-black">Message</a></div></article>; })}</div></section>
    </>
  );
}

function ClassesPage({ classes, setClasses }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ courseId: 1, title: "", type: "group", studentId: "", date: "", time: "", durationMinutes: 60 });
  const selectedCourse = getTutorCourse(form.courseId);

  const scheduleClass = (event) => {
    event.preventDefault();
    const studentIds = form.type === "group" ? selectedCourse.students.map((student) => student.id) : [form.studentId || selectedCourse.students[0].id];
    setClasses((current) => [...current, { id: Date.now(), courseId: Number(form.courseId), title: form.title.trim(), type: form.type, date: form.date, time: form.time, durationMinutes: Number(form.durationMinutes), status: "scheduled", studentIds }]);
    setForm({ courseId: 1, title: "", type: "group", studentId: "", date: "", time: "", durationMinutes: 60 });
    setShowForm(false);
  };

  return (
    <>
      <Hero eyebrow="My classes" title="Schedule group classes and one-on-one student calls." description="Each class opens an in-app room with camera, microphone, screen sharing, room chat and interactive learning activities." image="/images/hero/banner2.png" />

      <div className="mt-6 flex justify-end"><button type="button" onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-3 rounded-full bg-red-600 px-6 py-3.5 text-sm font-black text-white hover:bg-neutral-950"><Icon name="plus" />Schedule class</button></div>

      {showForm && <form onSubmit={scheduleClass} className="mt-5 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"><h2 className="text-2xl font-black">Create a class</h2><div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"><label className="text-sm font-black">Course<select value={form.courseId} onChange={(event) => setForm((current) => ({ ...current, courseId: Number(event.target.value), studentId: "" }))} className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 font-medium outline-none focus:border-red-600">{tutorCourses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label><label className="text-sm font-black md:col-span-2">Class title<input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 px-4 font-medium outline-none focus:border-red-600" placeholder="Enter lesson or session title" /></label><label className="text-sm font-black">Class type<select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 font-medium"><option value="group">Group class</option><option value="single">Single student call</option></select></label>{form.type === "single" && <label className="text-sm font-black">Student<select value={form.studentId} onChange={(event) => setForm((current) => ({ ...current, studentId: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 font-medium"><option value="">Select student</option>{selectedCourse.students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select></label>}<label className="text-sm font-black">Date<input required type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 px-4" /></label><label className="text-sm font-black">Time<input required type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 px-4" /></label><label className="text-sm font-black">Duration<input required type="number" min="15" step="15" value={form.durationMinutes} onChange={(event) => setForm((current) => ({ ...current, durationMinutes: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 px-4" /></label></div><button type="submit" className="mt-6 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950">Schedule class</button></form>}

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">{classes.map((item) => { const course = getTutorCourse(item.courseId); const participants = item.studentIds.map(getStudentById).filter(Boolean); return <article key={item.id} className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white"><div className="relative h-[220px]"><img src={course.image} alt="" className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"/><span className="absolute left-5 top-5 rounded-full bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white">{item.type === "group" ? "Group class" : "Single call"}</span><h2 className="absolute bottom-5 left-5 right-5 text-2xl font-black text-white">{item.title}</h2></div><div className="p-6"><p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">{course.title}</p><p className="mt-3 text-sm text-neutral-500">{item.date} at {item.time} · {item.durationMinutes} minutes</p><p className="mt-2 text-xs text-neutral-400">{participants.length} participant{participants.length === 1 ? "" : "s"}</p><a href={`/tutor/classes/${item.id}/room`} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-neutral-950 text-sm font-black text-white hover:bg-red-600"><Icon name="camera" />Open live room</a></div></article>; })}</section>
    </>
  );
}

function LiveRoomPage({ liveClass, tutorProfile }) {
  const course = getTutorCourse(liveClass.courseId);
  const participants = liveClass.studentIds.map(getStudentById).filter(Boolean);
  const cameraRef = useRef(null);
  const screenRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [roomMessages, setRoomMessages] = useState([{ id: 1, sender: "NexaCore", text: "The room is ready. Start your camera or share your screen when needed." }]);
  const [messageDraft, setMessageDraft] = useState("");
  const [activity, setActivity] = useState("poll");
  const [pollQuestion, setPollQuestion] = useState("Which topic needs another explanation?");
  const [pollOptions, setPollOptions] = useState(["State", "Props", "useEffect", "Forms"]);
  const [pollVotes, setPollVotes] = useState([2, 1, 3, 0]);
  const [quizQuestion, setQuizQuestion] = useState("Which hook is used for component state?");
  const [quizAnswer, setQuizAnswer] = useState("useState");
  const [answerVisible, setAnswerVisible] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [pickedStudent, setPickedStudent] = useState("");
  const [whiteboardNotes, setWhiteboardNotes] = useState("");
  const [reactions, setReactions] = useState({ clap: 0, fire: 0, idea: 0 });

  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return undefined;
    const timer = window.setInterval(() => setTimerSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning, timerSeconds]);

  useEffect(() => () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const startCamera = async () => {
    setMediaError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      cameraStreamRef.current = stream;
      if (cameraRef.current) cameraRef.current.srcObject = stream;
      setCameraOn(true);
      setMicrophoneOn(true);
    } catch {
      setMediaError("Camera or microphone access was denied. Allow browser permission and try again.");
    }
  };

  const toggleCamera = () => {
    const track = cameraStreamRef.current?.getVideoTracks()?.[0];
    if (!track) return startCamera();
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  };

  const toggleMicrophone = () => {
    const track = cameraStreamRef.current?.getAudioTracks()?.[0];
    if (!track) return startCamera();
    track.enabled = !track.enabled;
    setMicrophoneOn(track.enabled);
  };

  const shareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      screenStreamRef.current = stream;
      if (screenRef.current) screenRef.current.srcObject = stream;
      setSharingScreen(true);
      stream.getVideoTracks()[0].onended = () => setSharingScreen(false);
    } catch {
      setMediaError("Screen sharing did not start. Select a browser tab, window or screen and try again.");
    }
  };

  const stopScreenShare = () => {
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current = null;
    setSharingScreen(false);
  };

  const sendRoomMessage = (event) => {
    event.preventDefault();
    const text = messageDraft.trim();
    if (!text) return;
    setRoomMessages((current) => [...current, { id: Date.now(), sender: "Tutor", text }]);
    setMessageDraft("");
  };

  const randomStudent = () => {
    if (!participants.length) return;
    const selected = participants[Math.floor(Math.random() * participants.length)];
    setPickedStudent(selected.name);
  };

  const formatTimer = `${String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:${String(timerSeconds % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-[calc(100vh-145px)] overflow-hidden rounded-[30px] bg-neutral-950 text-white">
      <div className="grid min-h-[calc(100vh-145px)] 2xl:grid-cols-[1fr_390px]">
        <section className="flex min-h-[760px] flex-col p-5 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">{liveClass.type === "group" ? "Group live room" : "Single student call"}</p><h2 className="mt-2 text-2xl font-black">{liveClass.title}</h2><p className="mt-1 text-xs text-white/45">{course.title} · {participants.length} participant{participants.length === 1 ? "" : "s"}</p></div><span className="w-fit rounded-full bg-red-600 px-4 py-2 text-xs font-black">In-app classroom</span></div>

          <div className="mt-5 grid flex-1 gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="relative min-h-[420px] overflow-hidden rounded-[24px] bg-black">
              {sharingScreen ? <video ref={screenRef} autoPlay playsInline className="h-full w-full object-contain" /> : <><img src={course.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35"/><div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><Icon name="screen" className="mx-auto h-12 w-12 text-white/45"/><p className="mt-4 text-xl font-black">Presentation stage</p><p className="mt-2 text-sm text-white/40">Share your screen for slides, code, videos or demonstrations.</p></div></div></>}
              <span className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-2 text-xs font-black backdrop-blur-md">{sharingScreen ? "Tutor screen" : "Main stage"}</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="relative min-h-[200px] overflow-hidden rounded-[22px] bg-black"><video ref={cameraRef} autoPlay muted playsInline className={`h-full w-full object-cover ${cameraOn ? "block" : "hidden"}`} />{!cameraOn && <div className="absolute inset-0 flex items-center justify-center bg-white/[0.05]"><div className="text-center"><TutorAvatar profile={tutorProfile} size="mx-auto h-20 w-20" text="text-2xl"/><p className="mt-3 text-sm font-black">Tutor camera is off</p><button type="button" onClick={startCamera} className="mt-3 rounded-full bg-red-600 px-4 py-2 text-xs font-black">Start camera</button></div></div>}<span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-black">You · Tutor</span></div>
              {participants.slice(0, 3).map((student) => <div key={student.id} className="relative flex min-h-[145px] items-center justify-center rounded-[22px] bg-white/[0.06]"><div className="text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-sm font-black">{student.initials}</div><p className="mt-3 text-xs font-black">{student.name}</p><p className="mt-1 text-[10px] text-white/35">Student video</p></div></div>)}
            </div>
          </div>

          {mediaError && <p className="mt-4 rounded-2xl bg-red-600/15 p-4 text-sm text-red-200">{mediaError}</p>}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-[22px] bg-white/[0.05] p-4">
            <button type="button" onClick={toggleMicrophone} className={`flex h-12 w-12 items-center justify-center rounded-full ${microphoneOn ? "bg-white text-neutral-950" : "bg-red-600 text-white"}`}><Icon name="mic" /></button>
            <button type="button" onClick={toggleCamera} className={`flex h-12 w-12 items-center justify-center rounded-full ${cameraOn ? "bg-white text-neutral-950" : "bg-red-600 text-white"}`}><Icon name="camera" /></button>
            <button type="button" onClick={sharingScreen ? stopScreenShare : shareScreen} className={`flex h-12 items-center justify-center gap-2 rounded-full px-5 text-xs font-black ${sharingScreen ? "bg-red-600" : "bg-white/10"}`}><Icon name="screen" />{sharingScreen ? "Stop sharing" : "Share screen"}</button>
            <button type="button" onClick={() => setActivity("poll")} className="flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-xs font-black"><Icon name="activity" />Activities</button>
            <a href="/tutor/classes" className="flex h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-6 text-xs font-black"><Icon name="phone" />End class</a>
          </div>
        </section>

        <aside className="flex min-h-[760px] flex-col border-l border-white/10 bg-black/25">
          <div className="flex border-b border-white/10 p-3">{[["chat", "Chat"], ["people", "People"], ["activities", "Activities"]].map(([value, label]) => <button key={value} type="button" onClick={() => setActivity(value)} className={`flex-1 rounded-xl px-3 py-3 text-xs font-black ${activity === value ? "bg-red-600" : "text-white/45"}`}>{label}</button>)}</div>

          {activity === "chat" && <><div className="flex-1 space-y-3 overflow-y-auto p-5">{roomMessages.map((message) => <div key={message.id} className={`rounded-2xl p-4 ${message.sender === "Tutor" ? "ml-5 bg-red-600" : "mr-5 bg-white/[0.07]"}`}><p className="text-xs font-black">{message.sender}</p><p className="mt-2 text-sm leading-6 text-white/75">{message.text}</p></div>)}</div><form onSubmit={sendRoomMessage} className="flex gap-3 border-t border-white/10 p-4"><input value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder="Send class message..." className="h-12 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"/><button type="submit" className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600"><Icon name="send" /></button></form></>}

          {activity === "people" && <div className="flex-1 overflow-y-auto p-5"><div className="flex items-center justify-between"><h3 className="font-black">Participants</h3><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">{participants.length + 1}</span></div><div className="mt-5 space-y-3"><div className="flex items-center gap-3 rounded-2xl bg-red-600 p-4"><TutorAvatar profile={tutorProfile} size="h-10 w-10"/><div><p className="text-sm font-black">You</p><p className="text-xs text-white/55">Host and tutor</p></div></div>{participants.map((student) => <div key={student.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-black">{student.initials}</div><div className="flex-1"><p className="text-sm font-black">{student.name}</p><p className="text-xs text-white/40">Student</p></div>{student.online && <span className="h-2.5 w-2.5 rounded-full bg-green-500"/>}</div>)}</div></div>}

          {activity === "poll" || activity === "activities" ? <div className="flex-1 overflow-y-auto p-5"><h3 className="font-black">Interactive activities</h3><p className="mt-1 text-xs text-white/40">Keep students involved during the lesson.</p><div className="mt-5 grid grid-cols-2 gap-2">{[["poll", "Quick poll"], ["quiz", "Live quiz"], ["timer", "Focus timer"], ["picker", "Random picker"], ["whiteboard", "Whiteboard"], ["reactions", "Reactions"]].map(([value, label]) => <button key={value} type="button" onClick={() => setActivity(value)} className="rounded-xl bg-white/[0.07] p-3 text-xs font-black hover:bg-red-600">{label}</button>)}</div><div className="mt-5 rounded-2xl bg-white/[0.05] p-5"><p className="text-xs font-black uppercase tracking-[0.14em] text-red-500">Quick poll</p><input value={pollQuestion} onChange={(event) => setPollQuestion(event.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none"/>{pollOptions.map((option, index) => <div key={index} className="mt-3"><div className="flex items-center justify-between text-xs"><span>{option}</span><span>{pollVotes[index]} votes</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-red-600" style={{ width: `${Math.min(100, pollVotes[index] * 20)}%` }} /></div><button type="button" onClick={() => setPollVotes((current) => current.map((value, currentIndex) => currentIndex === index ? value + 1 : value))} className="mt-2 text-[10px] font-black text-red-400">Simulate vote</button></div>)}</div></div> : null}

          {activity === "quiz" && <div className="flex-1 p-5"><h3 className="font-black">Live quiz</h3><input value={quizQuestion} onChange={(event) => setQuizQuestion(event.target.value)} className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white outline-none"/><input value={quizAnswer} onChange={(event) => setQuizAnswer(event.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white outline-none" placeholder="Correct answer"/><button type="button" onClick={() => setAnswerVisible((value) => !value)} className="mt-4 w-full rounded-xl bg-red-600 p-3 text-xs font-black">{answerVisible ? "Hide answer" : "Reveal answer"}</button>{answerVisible && <p className="mt-4 rounded-2xl bg-green-500/15 p-4 text-sm font-black text-green-300">Answer: {quizAnswer}</p>}</div>}

          {activity === "timer" && <div className="flex flex-1 flex-col items-center justify-center p-5 text-center"><Icon name="timer" className="h-12 w-12 text-red-500"/><p className="mt-5 text-5xl font-black">{formatTimer}</p><p className="mt-2 text-sm text-white/40">Activity focus timer</p><div className="mt-6 flex gap-3"><button type="button" onClick={() => setTimerRunning((value) => !value)} className="rounded-full bg-red-600 px-5 py-3 text-xs font-black">{timerRunning ? "Pause" : "Start"}</button><button type="button" onClick={() => { setTimerRunning(false); setTimerSeconds(300); }} className="rounded-full bg-white/10 px-5 py-3 text-xs font-black">Reset</button></div></div>}

          {activity === "picker" && <div className="flex flex-1 flex-col items-center justify-center p-5 text-center"><Icon name="users" className="h-12 w-12 text-red-500"/><p className="mt-5 text-sm text-white/45">Randomly choose a student for a question or demonstration.</p><p className="mt-5 min-h-12 text-2xl font-black text-red-400">{pickedStudent || "No student selected"}</p><button type="button" onClick={randomStudent} className="mt-5 rounded-full bg-red-600 px-6 py-3 text-xs font-black">Pick a student</button></div>}

          {activity === "whiteboard" && <div className="flex flex-1 flex-col p-5"><h3 className="font-black">Collaborative whiteboard notes</h3><textarea value={whiteboardNotes} onChange={(event) => setWhiteboardNotes(event.target.value)} placeholder="Write explanations, code steps or activity notes..." className="mt-5 min-h-[390px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-7 text-white outline-none"/><button type="button" onClick={() => setWhiteboardNotes("")} className="mt-4 rounded-xl bg-red-600 p-3 text-xs font-black">Clear board</button></div>}

          {activity === "reactions" && <div className="flex flex-1 flex-col items-center justify-center p-5"><h3 className="font-black">Class reactions</h3><div className="mt-6 grid w-full grid-cols-3 gap-3">{[["clap", "👏"], ["fire", "🔥"], ["idea", "💡"]].map(([key, emoji]) => <button key={key} type="button" onClick={() => setReactions((current) => ({ ...current, [key]: current[key] + 1 }))} className="rounded-2xl bg-white/[0.07] p-5 text-3xl hover:bg-red-600"><span>{emoji}</span><span className="mt-2 block text-xs font-black">{reactions[key]}</span></button>)}</div></div>}
        </aside>
      </div>
    </div>
  );
}

function MaterialsPage({ materials, setMaterials }) {
  const [form, setForm] = useState({ courseId: 1, title: "", description: "", fileName: "" });
  const upload = (event) => {
    event.preventDefault();
    if (!form.fileName) return;
    const extension = form.fileName.split(".").pop()?.toUpperCase() || "FILE";
    setMaterials((current) => [...current, { id: `MAT-${Date.now()}`, courseId: Number(form.courseId), title: form.title.trim(), description: form.description.trim(), fileName: form.fileName, materialType: extension }]);
    setForm({ courseId: 1, title: "", description: "", fileName: "" });
  };

  return <><Hero eyebrow="Learning materials" title="Upload course files and resources for your students." description="Organise notes, videos, templates, source files and revision resources by course." image="/images/hero/banner3.png"/><section className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]"><form onSubmit={upload} className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8"><h2 className="text-2xl font-black">Add material</h2><label className="mt-6 block text-sm font-black">Course<select value={form.courseId} onChange={(event) => setForm((current) => ({ ...current, courseId: Number(event.target.value) }))} className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 outline-none">{tutorCourses.map((course) => <option className="text-neutral-950" key={course.id} value={course.id}>{course.title}</option>)}</select></label><label className="mt-4 block text-sm font-black">Material title<input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 outline-none"/></label><label className="mt-4 block text-sm font-black">Description<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows="4" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.07] p-4 outline-none"/></label><label className="mt-4 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-white/15 p-6 text-center"><Icon name="upload" className="h-7 w-7 text-red-500"/><span className="mt-3 text-sm font-black">Choose material file</span><span className="mt-2 text-xs text-white/40">PDF, DOCX, ZIP, image, audio or video</span><input type="file" className="hidden" onChange={(event) => setForm((current) => ({ ...current, fileName: event.target.files?.[0]?.name || "" }))}/>{form.fileName && <span className="mt-3 text-xs text-green-300">{form.fileName}</span>}</label><button type="submit" className="mt-5 h-14 w-full rounded-2xl bg-red-600 text-sm font-black">Upload material</button></form><div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"><h2 className="text-2xl font-black">Published materials</h2><div className="mt-6 space-y-4">{materials.map((material) => { const course = getTutorCourse(material.courseId); return <article key={material.id} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 p-5 sm:flex-row sm:items-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"><Icon name="materials" /></div><div className="flex-1"><p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">{course.title}</p><h3 className="mt-2 font-black">{material.title}</h3><p className="mt-1 text-xs text-neutral-400">{material.fileName} · {material.materialType}</p><p className="mt-2 text-sm text-neutral-500">{material.description}</p></div><button type="button" onClick={() => setMaterials((current) => current.filter((item) => item.id !== material.id))} className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-black text-red-600">Remove</button></article>; })}</div></div></section></>;
}

function AssignmentsPage({ assignments, setAssignments }) {
  const [form, setForm] = useState({ courseId: 1, title: "", instructions: "", dueDate: "", maximumScore: 100, attachmentName: "" });
  const create = (event) => {
    event.preventDefault();
    setAssignments((current) => [...current, { id: Date.now(), courseId: Number(form.courseId), title: form.title.trim(), instructions: form.instructions.trim(), dueDate: form.dueDate, maximumScore: Number(form.maximumScore), status: "published", attachmentName: form.attachmentName }]);
    setForm({ courseId: 1, title: "", instructions: "", dueDate: "", maximumScore: 100, attachmentName: "" });
  };

  return <><Hero eyebrow="Assignments" title="Create and publish assessed work for each course." description="Set instructions, deadlines, maximum scores and supporting files. Submitted work appears automatically in Grading." image="/images/hero/banner4.png"/><section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]"><form onSubmit={create} className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8"><h2 className="text-2xl font-black">Create assignment</h2><label className="mt-5 block text-sm font-black">Course<select value={form.courseId} onChange={(event) => setForm((current) => ({ ...current, courseId: Number(event.target.value) }))} className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4">{tutorCourses.map((course) => <option className="text-neutral-950" key={course.id} value={course.id}>{course.title}</option>)}</select></label><label className="mt-4 block text-sm font-black">Assignment title<input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4"/></label><label className="mt-4 block text-sm font-black">Instructions<textarea required value={form.instructions} onChange={(event) => setForm((current) => ({ ...current, instructions: event.target.value }))} rows="5" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.07] p-4"/></label><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-black">Due date<input required type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4"/></label><label className="text-sm font-black">Maximum score<input required type="number" min="1" value={form.maximumScore} onChange={(event) => setForm((current) => ({ ...current, maximumScore: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4"/></label></div><label className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/15 p-4 text-sm font-black"><Icon name="upload" />{form.attachmentName || "Attach assignment brief"}<input type="file" className="hidden" onChange={(event) => setForm((current) => ({ ...current, attachmentName: event.target.files?.[0]?.name || "" }))}/></label><button type="submit" className="mt-5 h-14 w-full rounded-2xl bg-red-600 text-sm font-black">Publish assignment</button></form><div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"><h2 className="text-2xl font-black">Published assignments</h2><div className="mt-6 space-y-4">{assignments.map((assignment) => { const course = getTutorCourse(assignment.courseId); return <article key={assignment.id} className="rounded-2xl border border-neutral-200 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">{course.title}</p><h3 className="mt-2 text-lg font-black">{assignment.title}</h3><p className="mt-3 text-sm leading-7 text-neutral-500">{assignment.instructions}</p></div><span className="w-fit rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700">{assignment.status}</span></div><div className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-500"><span>Due: {assignment.dueDate}</span><span>Maximum: {assignment.maximumScore}</span>{assignment.attachmentName && <span>File: {assignment.attachmentName}</span>}</div></article>; })}</div></div></section></>;
}

function GradingPage({ submissions, setSubmissions, assignments }) {
  const [selectedId, setSelectedId] = useState(submissions[0]?.id || "");
  const selected = submissions.find((item) => item.id === selectedId);
  const [score, setScore] = useState(selected?.score ?? "");
  const [feedback, setFeedback] = useState(selected?.feedback || "");

  useEffect(() => {
    setScore(selected?.score ?? "");
    setFeedback(selected?.feedback || "");
  }, [selectedId]);

  const grade = (event) => {
    event.preventDefault();
    if (!selected) return;
    setSubmissions((current) => current.map((item) => item.id === selected.id ? { ...item, score: Number(score), feedback: feedback.trim(), status: "graded" } : item));
  };

  return <><Hero eyebrow="Grading" title="Review submissions and give clear scores and feedback." description="Students see official scores only after you complete the grading action." image="/images/hero/banner2.png"/><section className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]"><aside className="rounded-[28px] bg-neutral-950 p-4 text-white"><p className="p-3 text-xs font-black uppercase tracking-[0.16em] text-red-500">Submission queue</p><div className="space-y-2">{submissions.map((submission) => { const assignment = assignments.find((item) => item.id === submission.assignmentId); return <button key={submission.id} type="button" onClick={() => setSelectedId(submission.id)} className={`w-full rounded-2xl p-4 text-left ${selectedId === submission.id ? "bg-red-600" : "bg-white/[0.06] hover:bg-white/[0.1]"}`}><div className="flex items-center justify-between gap-3"><p className="font-black">{submission.studentName}</p><span className="text-[10px] font-black uppercase">{submission.status}</span></div><p className="mt-2 text-xs text-white/45">{assignment?.title}</p></button>; })}</div></aside>{selected ? <form onSubmit={grade} className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"><p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">Student submission</p><h2 className="mt-2 text-2xl font-black">{selected.studentName}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-neutral-50 p-5"><p className="text-xs text-neutral-400">Submitted file</p><p className="mt-2 font-black">{selected.fileName}</p></div><div className="rounded-2xl bg-neutral-50 p-5"><p className="text-xs text-neutral-400">Project link</p><p className="mt-2 break-all text-sm font-bold text-red-600">{selected.projectUrl || "No link submitted"}</p></div></div><label className="mt-5 block text-sm font-black">Score<input required type="number" min="0" max="100" value={score} onChange={(event) => setScore(event.target.value)} className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 px-4 outline-none focus:border-red-600"/></label><label className="mt-5 block text-sm font-black">Tutor feedback<textarea required value={feedback} onChange={(event) => setFeedback(event.target.value)} rows="7" className="mt-2 w-full rounded-2xl border border-neutral-300 p-4 leading-7 outline-none focus:border-red-600" placeholder="Explain strengths, corrections and next steps..."/></label><button type="submit" className="mt-6 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950">Save grade and feedback</button></form> : <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-10 text-center"><h2 className="text-xl font-black">No submission selected</h2></div>}</section></>;
}

function EarningsPage({ earnings, setEarnings }) {
  const [message, setMessage] = useState("");
  const requestPayout = () => {
    if (earnings.availableBalance <= 0) return;
    setEarnings((current) => ({ ...current, payoutRequests: [...current.payoutRequests, { id: `PAY-${Date.now()}`, amount: current.availableBalance, status: "requested", date: new Date().toISOString() }], availableBalance: 0, pendingBalance: current.pendingBalance + current.availableBalance }));
    setMessage("Payout request submitted successfully.");
  };

  return <><Hero eyebrow="Tutor earnings" title="Track teaching income, pending amounts and payouts." description={`Your earnings reflect the signed partnership split: ${TUTOR_REVENUE_SHARE.tutorPercent}% to the tutor and ${TUTOR_REVENUE_SHARE.platformPercent}% to NexaCore.`} image="/images/hero/banner3.png"/><section className="mt-6 grid gap-4 sm:grid-cols-2"><article className="rounded-[26px] bg-red-600 p-6 text-white"><p className="text-xs uppercase tracking-[0.14em] text-white/60">Tutor revenue share</p><p className="mt-4 text-4xl font-black">{TUTOR_REVENUE_SHARE.tutorPercent}%</p><p className="mt-2 text-sm text-white/70">Paid to the tutor under the signed partnership agreement.</p></article><article className="rounded-[26px] bg-neutral-950 p-6 text-white"><p className="text-xs uppercase tracking-[0.14em] text-white/40">NexaCore platform share</p><p className="mt-4 text-4xl font-black text-red-500">{TUTOR_REVENUE_SHARE.platformPercent}%</p><p className="mt-2 text-sm text-white/55">Supports platform operations, administration and learner acquisition.</p></article></section><section className="mt-6 grid gap-5 sm:grid-cols-3">{[["Available balance", earnings.availableBalance, "bg-neutral-950 text-white"], ["Pending balance", earnings.pendingBalance, "bg-white"], ["Lifetime earnings", earnings.lifetimeEarnings, "bg-white"]].map(([label, value, style]) => <article key={label} className={`rounded-[26px] border border-neutral-200 p-6 ${style}`}><p className="text-xs uppercase tracking-[0.14em] opacity-50">{label}</p><p className="mt-4 text-3xl font-black text-red-500">{formatMoney(value)}</p></article>)}</section><section className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]"><div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white"><div className="border-b border-neutral-200 p-6"><h2 className="text-2xl font-black">Transactions</h2></div>{earnings.transactions.map((item) => <article key={item.id} className="grid gap-4 border-b border-neutral-200 p-5 last:border-b-0 md:grid-cols-[1fr_150px_120px] md:items-center"><div><h3 className="font-black">{item.description}</h3><p className="mt-1 text-xs text-neutral-400">{item.date}</p></div><p className="font-black">{formatMoney(item.amount)}</p><span className={`w-fit rounded-full px-4 py-2 text-xs font-black ${item.status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-50 text-amber-700"}`}>{item.status}</span></article>)}</div><aside className="rounded-[28px] bg-neutral-950 p-6 text-white"><p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">Payout account</p><p className="mt-4 font-black">{earnings.payoutAccount}</p><p className="mt-3 text-sm leading-7 text-white/45">Available earnings can be moved to your verified payout account.</p><button type="button" onClick={requestPayout} disabled={earnings.availableBalance <= 0} className="mt-6 h-12 w-full rounded-2xl bg-red-600 text-sm font-black disabled:opacity-50">Request payout</button>{message && <p className="mt-4 rounded-2xl bg-green-500/15 p-4 text-xs font-bold text-green-300">{message}</p>}</aside></section></>;
}

function MessagesPage({ messages, setMessages, classes }) {
  const contacts = [
    ...tutorCourses.map((course) => ({ id: `cohort-${course.id}`, name: course.cohort, subtitle: "Group conversation", initials: "GC", type: "cohort", courseId: course.id })),
    ...getAllTutorStudents().map((student) => ({ id: `student-${student.id}`, name: student.name, subtitle: getTutorCourse(student.courseId).title, initials: student.initials, type: "student", studentId: student.id, courseId: student.courseId })),
  ];
  const queryStudent = new URLSearchParams(window.location.search).get("student");
  const initialContact = contacts.find((contact) => contact.studentId === queryStudent)?.id || contacts[0].id;
  const [activeId, setActiveId] = useState(initialContact);
  const [draft, setDraft] = useState("");
  const [fileName, setFileName] = useState("");
  const activeContact = contacts.find((contact) => contact.id === activeId);
  const conversation = messages[activeId] || [];
  const groupClass = classes.find((item) => item.courseId === activeContact.courseId && (activeContact.type === "cohort" ? item.type === "group" : item.studentIds.includes(activeContact.studentId))) || classes.find((item) => item.courseId === activeContact.courseId);

  const send = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text && !fileName) return;
    setMessages((current) => ({ ...current, [activeId]: [...(current[activeId] || []), { id: `MSG-${Date.now()}`, senderType: "tutor", senderName: "You", text: text || `Shared a file: ${fileName}`, fileName }] }));
    setDraft("");
    setFileName("");
  };

  return <><Hero eyebrow="Messages and calls" title="Chat with individual students or an entire cohort." description="Start a single video call from a student conversation or open a group room from a cohort conversation." image="/images/hero/banner1.png"/><section className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white"><div className="grid min-h-[690px] lg:grid-cols-[320px_1fr]"><aside className="bg-neutral-950 p-4 text-white"><p className="p-3 text-xs font-black uppercase tracking-[0.16em] text-red-500">Students and cohorts</p><div className="space-y-2">{contacts.map((contact) => <button key={contact.id} type="button" onClick={() => setActiveId(contact.id)} className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left ${activeId === contact.id ? "bg-red-600" : "bg-white/[0.05] hover:bg-white/[0.09]"}`}><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-black">{contact.initials}</div><div className="min-w-0"><p className="truncate text-sm font-black">{contact.name}</p><p className="mt-1 truncate text-xs text-white/40">{contact.subtitle}</p></div></button>)}</div></aside><div className="flex min-h-[690px] flex-col"><div className="flex flex-col gap-4 border-b border-neutral-200 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">{activeContact.initials}</div><div><h2 className="font-black">{activeContact.name}</h2><p className="mt-1 text-xs text-neutral-400">{activeContact.subtitle}</p></div></div><a href={`/tutor/classes/${groupClass?.id || classes[0].id}/room${activeContact.type === "student" ? `?student=${activeContact.studentId}` : ""}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-xs font-black text-white"><Icon name="camera" className="h-4 w-4" />{activeContact.type === "student" ? "Start single call" : "Start group call"}</a></div><div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">{conversation.map((message) => <div key={message.id} className={`flex ${message.senderType === "tutor" ? "justify-end" : "justify-start"}`}><div className={`max-w-2xl rounded-2xl p-4 ${message.senderType === "tutor" ? "bg-red-600 text-white" : "bg-neutral-100 text-neutral-800"}`}><p className="text-xs font-black">{message.senderName}</p><p className="mt-2 text-sm leading-7">{message.text}</p>{message.fileName && <p className="mt-3 rounded-xl bg-black/10 p-3 text-xs font-bold">File: {message.fileName}</p>}</div></div>)}</div><form onSubmit={send} className="border-t border-neutral-200 p-4">{fileName && <p className="mb-3 rounded-xl bg-neutral-100 p-3 text-xs font-bold">Attachment: {fileName}</p>}<div className="flex gap-3"><label className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-neutral-300 hover:border-red-600 hover:text-red-600"><Icon name="upload"/><input type="file" className="hidden" onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}/></label><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${activeContact.name}...`} className="h-12 flex-1 rounded-full border border-neutral-300 px-5 text-sm outline-none focus:border-red-600"/><button type="submit" className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white"><Icon name="send"/></button></div></form></div></div></section></>;
}

function ReviewsPage({ reviews, setReviews }) {
  const [responses, setResponses] = useState({});
  const respond = (reviewId) => {
    const text = responses[reviewId]?.trim();
    if (!text) return;
    setReviews((current) => current.map((review) => review.id === reviewId ? { ...review, response: text } : review));
    setResponses((current) => ({ ...current, [reviewId]: "" }));
  };
  const rating = calculateTutorRating(reviews);

  return <><Hero eyebrow="Student reviews" title="Monitor tutor feedback and respond professionally." description="Reviews help students understand your teaching quality and help you improve class delivery." image="/images/hero/banner4.png"/><section className="mt-6 grid gap-6 xl:grid-cols-[300px_1fr]"><aside className="rounded-[28px] bg-neutral-950 p-7 text-center text-white"><Icon name="reviews" className="mx-auto h-12 w-12 text-red-500"/><p className="mt-5 text-5xl font-black">{rating}</p><p className="mt-2 text-sm text-white/45">Average tutor rating</p><p className="mt-5 text-xs text-white/35">Based on {reviews.length} student reviews</p></aside><div className="space-y-4">{reviews.map((review) => { const course = getTutorCourse(review.courseId); return <article key={review.id} className="rounded-[28px] border border-neutral-200 bg-white p-6"><div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">{review.initials}</div><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-black">{review.studentName}</h2><p className="mt-1 text-xs text-neutral-400">{course.title}</p></div><span className="text-sm font-black text-amber-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span></div><p className="mt-4 text-sm leading-7 text-neutral-600">{review.comment}</p>{review.response ? <div className="mt-4 rounded-2xl bg-red-50 p-4"><p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">Tutor response</p><p className="mt-2 text-sm leading-7 text-neutral-700">{review.response}</p></div> : <div className="mt-4 flex gap-3"><input value={responses[review.id] || ""} onChange={(event) => setResponses((current) => ({ ...current, [review.id]: event.target.value }))} placeholder="Write a response..." className="h-12 flex-1 rounded-full border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"/><button type="button" onClick={() => respond(review.id)} className="rounded-full bg-red-600 px-5 text-xs font-black text-white">Respond</button></div>}</div></div></article>; })}</div></section></>;
}

function TutorProfilePage({ profile }) {
  return <><Hero eyebrow="Tutor profile" title={`${profile.firstName} ${profile.lastName}`} description="Your public teaching identity, specialty and student-facing profile." image="/images/hero/banner2.png"/><section className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]"><aside className="rounded-[28px] bg-neutral-950 p-7 text-center text-white"><TutorAvatar profile={profile} size="mx-auto h-28 w-28" text="text-3xl"/><h2 className="mt-5 text-2xl font-black">{profile.firstName} {profile.lastName}</h2><p className="mt-2 text-sm text-white/45">{profile.headline}</p></aside><div className="rounded-[28px] border border-neutral-200 bg-white p-7"><h2 className="text-2xl font-black">Teaching information</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{[["Email", profile.email], ["Specialty", profile.specialty], ["Assigned courses", tutorCourses.length], ["Active students", getAllTutorStudents().length]].map(([label, value]) => <div key={label} className="rounded-2xl border border-neutral-200 p-5"><p className="text-xs uppercase tracking-[0.12em] text-neutral-400">{label}</p><p className="mt-3 font-black">{value}</p></div>)}</div></div></section></>;
}

function TutorSettingsPage({ profile, setProfile }) {
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const uploadPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, profilePhoto: String(reader.result) }));
    reader.readAsDataURL(file);
  };
  const save = (event) => { event.preventDefault(); setProfile(draft); setSaved(true); };
  return <><Hero eyebrow="Tutor settings" title="Manage your tutor profile and teaching details." description="Update your public information and profile picture." image="/images/hero/banner1.png"/><form onSubmit={save} className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"><div className="flex flex-col gap-5 rounded-[24px] bg-neutral-50 p-6 sm:flex-row sm:items-center"><TutorAvatar profile={draft} size="h-28 w-28" text="text-3xl"/><div><p className="font-black">Profile picture</p><label className="mt-4 inline-flex cursor-pointer rounded-full bg-red-600 px-5 py-3 text-xs font-black text-white">Upload picture<input type="file" accept="image/*" className="hidden" onChange={uploadPhoto}/></label></div></div><div className="mt-6 grid gap-5 sm:grid-cols-2">{[["firstName", "First name"], ["lastName", "Last name"], ["email", "Email"], ["specialty", "Specialty"], ["headline", "Professional headline"]].map(([name, label]) => <label key={name} className="text-sm font-black">{label}<input value={draft[name]} onChange={(event) => setDraft((current) => ({ ...current, [name]: event.target.value }))} className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 px-4 font-medium outline-none focus:border-red-600"/></label>)}</div><button type="submit" className="mt-6 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white">Save tutor profile</button>{saved && <p className="mt-4 rounded-2xl bg-green-50 p-4 text-center text-sm font-bold text-green-700">Tutor profile saved.</p>}</form></>;
}

function findTutorClass(classId, classes) {
  return classes.find((item) => item.id === Number(classId));
}

export default function TutorWorkspace() {
  const path = window.location.pathname;
  const [profile, setProfile] = usePersistentState(TUTOR_STORAGE_KEYS.profile, defaultTutorProfile);
  const [requests, setRequests] = usePersistentState(TUTOR_STORAGE_KEYS.requests, defaultStudentRequests);
  const [classes, setClasses] = usePersistentState(TUTOR_STORAGE_KEYS.classes, defaultTutorClasses);
  const [materials, setMaterials] = usePersistentState(TUTOR_STORAGE_KEYS.materials, defaultMaterials);
  const [assignments, setAssignments] = usePersistentState(TUTOR_STORAGE_KEYS.assignments, defaultAssignments);
  const [submissions, setSubmissions] = usePersistentState(TUTOR_STORAGE_KEYS.submissions, defaultSubmissions);
  const [messages, setMessages] = usePersistentState(TUTOR_STORAGE_KEYS.messages, defaultTutorMessages);
  const [earnings, setEarnings] = usePersistentState(TUTOR_STORAGE_KEYS.earnings, defaultEarnings);
  const [reviews, setReviews] = usePersistentState(TUTOR_STORAGE_KEYS.reviews, defaultReviews);

  const requestCount = requests.filter((item) => item.status === "pending").length;
  const gradingCount = submissions.filter((item) => item.status === "submitted").length;

  let title = "Tutor workspace";
  let page = null;
  const roomMatch = path.match(/^\/tutor\/classes\/(\d+)\/room$/);

  if (path === "/tutor/dashboard") { title = "Dashboard Overview"; page = <DashboardPage requests={requests} classes={classes} submissions={submissions} earnings={earnings} reviews={reviews} />; }
  else if (path === "/tutor/requests") { title = "Student Requests"; page = <RequestsPage requests={requests} setRequests={setRequests} />; }
  else if (path === "/tutor/classes") { title = "My Classes"; page = <ClassesPage classes={classes} setClasses={setClasses} />; }
  else if (roomMatch) { const liveClass = findTutorClass(roomMatch[1], classes); title = liveClass?.title || "Live Room"; page = liveClass ? <LiveRoomPage liveClass={liveClass} tutorProfile={profile} /> : null; }
  else if (path === "/tutor/materials") { title = "Materials"; page = <MaterialsPage materials={materials} setMaterials={setMaterials} />; }
  else if (path === "/tutor/assignments") { title = "Assignments"; page = <AssignmentsPage assignments={assignments} setAssignments={setAssignments} />; }
  else if (path === "/tutor/grading") { title = "Grading"; page = <GradingPage submissions={submissions} setSubmissions={setSubmissions} assignments={assignments} />; }
  else if (path === "/tutor/earnings") { title = "Earnings"; page = <EarningsPage earnings={earnings} setEarnings={setEarnings} />; }
  else if (path === "/tutor/messages") { title = "Messages"; page = <MessagesPage messages={messages} setMessages={setMessages} classes={classes} />; }
  else if (path === "/tutor/reviews") { title = "Reviews"; page = <ReviewsPage reviews={reviews} setReviews={setReviews} />; }
  else if (path === "/tutor/profile") { title = "Tutor Profile"; page = <TutorProfilePage profile={profile} />; }
  else if (path === "/tutor/settings") { title = "Settings"; page = <TutorSettingsPage profile={profile} setProfile={setProfile} />; }

  if (!page) page = <section className="rounded-[28px] border border-neutral-200 bg-white p-10 text-center"><h2 className="text-2xl font-black">Tutor page not found</h2><a href="/tutor/dashboard" className="mt-5 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white">Return to dashboard</a></section>;

  return <TutorShell title={title} profile={profile} requestCount={requestCount} gradingCount={gradingCount}>{page}</TutorShell>;
}
