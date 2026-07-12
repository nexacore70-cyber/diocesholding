import { useMemo, useState } from "react";

import {
  CURRENCY_OPTIONS,
  courseCategories,
  detectPreferredCurrency,
  formatCurrency,
  getCoursePrice,
  setPreferredCurrency,
} from "./student/studentData";

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

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
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

export default function CourseCatalog() {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState("all");
  const [search, setSearch] = useState("");
  const [expandedCourseId, setExpandedCourseId] =
    useState(null);
  const [currency, setCurrency] = useState(
    detectPreferredCurrency,
  );

  const handleCurrencyChange = (event) => {
    const nextCurrency = event.target.value;
    setCurrency(nextCurrency);
    setPreferredCurrency(nextCurrency);
  };

  const visibleCategories = useMemo(() => {
    const normalisedSearch = search.trim().toLowerCase();

    return courseCategories
      .filter(
        (category) =>
          selectedCategoryId === "all" ||
          category.id === selectedCategoryId,
      )
      .map((category) => ({
        ...category,
        courses: category.courses.filter((course) => {
          if (!normalisedSearch) {
            return true;
          }

          return [
            course.title,
            course.category,
            course.categoryDescription,
            ...course.learningOutcomes,
            ...course.lessons.map((lesson) => lesson.title),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalisedSearch);
        }),
      }))
      .filter((category) => category.courses.length > 0);
  }, [search, selectedCategoryId]);

  const totalCourses = courseCategories.reduce(
    (total, category) => total + category.courses.length,
    0,
  );

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-neutral-950">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[88px] max-w-[1500px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <a href="/" className="inline-flex">
            <img
              src="/images/logo/nexacore-logo-light.png"
              alt="NexaCore"
              className="h-12 w-auto max-w-[210px] object-contain"
            />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="/academy"
              className="text-sm font-black text-neutral-600 hover:text-red-600"
            >
              Academy
            </a>
            <a
              href="/tutors"
              className="text-sm font-black text-neutral-600 hover:text-red-600"
            >
              Tutors
            </a>
            <a
              href="/certificates"
              className="text-sm font-black text-neutral-600 hover:text-red-600"
            >
              Certificates
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={handleCurrencyChange}
              aria-label="Select tuition currency"
              className="h-11 rounded-full border border-neutral-300 bg-white px-3 text-xs font-black text-neutral-700 outline-none focus:border-red-600"
            >
              {CURRENCY_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code}
                </option>
              ))}
            </select>

            <a
              href="/login"
              className="hidden rounded-full border border-neutral-300 px-5 py-3 text-sm font-black sm:inline-flex"
            >
              Log in
            </a>
            <a
              href="/signup?role=student"
              className="rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white hover:bg-neutral-950"
            >
              Start learning
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-neutral-950">
        <img
          src="/images/hero/banner1.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/45" />

        <div className="relative mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">
              NexaCore Academy
            </p>

            <h1 className="mt-5 text-4xl font-black leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
              Deep practical education across
              <span className="block text-red-500">
                technology, creative media and professional skills.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 sm:text-lg">
              Explore {totalCourses} structured programmes across{" "}
              {courseCategories.length} categories. Every course
              contains ten in-depth modules, live tutor sessions,
              practical assignments and a portfolio-ready capstone.
              Curriculum previews are open before registration, while
              lesson completion tools unlock after payment.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-black text-white/70">
                Showing tuition in {currency}
              </span>
              <span className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-black text-white/70">
                Nigeria defaults to NGN; other locations default to USD
              </span>
            </div>

            <div className="relative mt-9 max-w-3xl">
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
                <SearchIcon />
              </span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                type="search"
                placeholder="Search courses, modules or learning outcomes..."
                className="h-16 w-full rounded-full border border-white/20 bg-white pl-14 pr-6 text-sm text-neutral-950 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/20"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] gap-3 overflow-x-auto px-5 py-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => setSelectedCategoryId("all")}
            className={`shrink-0 rounded-full px-5 py-3 text-xs font-black transition ${
              selectedCategoryId === "all"
                ? "bg-red-600 text-white"
                : "border border-neutral-300 bg-white text-neutral-600 hover:border-red-600 hover:text-red-600"
            }`}
          >
            All categories
          </button>

          {courseCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                setSelectedCategoryId(category.id)
              }
              className={`shrink-0 rounded-full px-5 py-3 text-xs font-black transition ${
                selectedCategoryId === category.id
                  ? "bg-red-600 text-white"
                  : "border border-neutral-300 bg-white text-neutral-600 hover:border-red-600 hover:text-red-600"
              }`}
            >
              {category.name} ({category.courses.length})
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12">
        {visibleCategories.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-neutral-300 bg-white p-12 text-center">
            <h2 className="text-2xl font-black">
              No matching course found
            </h2>
            <p className="mt-3 text-sm text-neutral-500">
              Change the search phrase or select another category.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {visibleCategories.map((category) => (
              <section key={category.id}>
                <div className="grid gap-6 rounded-[30px] bg-neutral-950 p-7 text-white lg:grid-cols-[1fr_360px] lg:items-center lg:p-9">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">
                      Academy category
                    </p>
                    <h2 className="mt-3 text-3xl font-black">
                      {category.name}
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">
                      {category.description}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/[0.06] p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-white/40">
                      Programmes available
                    </p>
                    <p className="mt-2 text-4xl font-black text-red-500">
                      {category.courses.length}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  {category.courses.map((course) => {
                    const expanded =
                      expandedCourseId === course.id;

                    return (
                      <article
                        key={course.id}
                        className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm"
                      >
                        <div className="relative h-[230px] overflow-hidden">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                          <span className="absolute left-5 top-5 rounded-full bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                            {course.level}
                          </span>

                          <h3 className="absolute bottom-5 left-5 right-5 text-2xl font-black text-white">
                            {course.title}
                          </h3>
                        </div>

                        <div className="p-6">
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl bg-neutral-50 p-4">
                              <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                                Duration
                              </p>
                              <p className="mt-2 text-sm font-black">
                                {course.duration}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-neutral-50 p-4">
                              <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                                Modules
                              </p>
                              <p className="mt-2 text-sm font-black">
                                {course.lessons.length}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-red-50 p-4">
                              <p className="text-[10px] uppercase tracking-[0.12em] text-red-500">
                                Tuition
                              </p>
                              <p className="mt-2 text-sm font-black text-red-600">
                                {formatCurrency(
                                  getCoursePrice(course, currency),
                                  currency,
                                )}
                              </p>
                              <p className="mt-1 text-[10px] font-bold text-red-400">
                                {course.priceTierLabel}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-neutral-200 p-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">
                              {course.tutor.initials}
                            </div>
                            <div>
                              <p className="text-sm font-black">
                                {course.tutor.name}
                              </p>
                              <p className="mt-1 text-xs text-neutral-400">
                                {course.tutor.title}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
                              What you will achieve
                            </p>
                            <div className="mt-3 space-y-2">
                              {course.learningOutcomes
                                .slice(0, 3)
                                .map((outcome) => (
                                  <div
                                    key={outcome}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                      <CheckIcon />
                                    </span>
                                    <p className="text-sm leading-6 text-neutral-600">
                                      {outcome}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCourseId(
                                expanded ? null : course.id,
                              )
                            }
                            className="mt-5 w-full rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-black transition hover:border-red-600 hover:text-red-600"
                          >
                            {expanded
                              ? "Hide full curriculum"
                              : "View full curriculum before registration"}
                          </button>

                          {expanded && (
                            <div className="mt-5 rounded-[24px] bg-neutral-950 p-5 text-white">
                              <p className="text-xs font-black uppercase tracking-[0.14em] text-red-500">
                                Ten-module curriculum
                              </p>

                              <div className="mt-4 space-y-3">
                                {course.lessons.map((lesson) => (
                                  <div
                                    key={lesson.id}
                                    className="rounded-xl bg-white/[0.06] p-4"
                                  >
                                    <div className="flex gap-3">
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-xs font-black">
                                        {lesson.module}
                                      </span>
                                      <div>
                                        <h4 className="text-sm font-black">
                                          {lesson.title}
                                        </h4>
                                        <p className="mt-2 text-xs leading-6 text-white/45">
                                          {lesson.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <a
                            href={`/signup?role=student&course=${course.id}`}
                            className="group mt-5 inline-flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-neutral-950"
                          >
                            Register for this course
                            <ArrowIcon className="transition group-hover:translate-x-1" />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
