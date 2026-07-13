import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  TUTOR_ASSESSMENT_DURATION_MINUTES,
  TUTOR_ASSESSMENT_QUESTION_COUNT,
  TUTOR_FAILED_COOLDOWN_DAYS,
  TUTOR_PASS_MARK,
  TUTOR_REVENUE_SHARE,
  clearTutorAssessmentFailure,
  createAssessmentWindow,
  createCooldownWindow,
  defaultTutorOnboarding,
  formatCooldownDate,
  generateTutorAssessment,
  getCooldownStatus,
  getQuestionFingerprint,
  recordTutorAssessmentFailure,
  scoreTutorAssessment,
} from "./tutorData";
import ThemeToggle from "../../theme/ThemeToggle";

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

function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
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

function LockIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AssessmentIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 4h10v16H7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 4V2h6v2M10 9h4M10 13h4M10 17h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OnboardingLayout({
  step,
  title,
  description,
  children,
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-950">
      <div className="fixed inset-0">
        <img
          src="/images/hero/banner3.png"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
      </div>

      <div className="pointer-events-none fixed left-1/2 top-1/3 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-red-600/15 blur-[180px]" />

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
            <a href="/" aria-label="NexaCore home">
              <img
                src="/images/logo/nexacore-logo-light.png"
                alt="NexaCore"
                className="h-14 w-auto max-w-[230px] object-contain"
              />
            </a>

            <div className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white">
              Tutor onboarding · {step}
            </div>
          </div>
        </header>

        <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-[1180px]">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-red-400">
                Verified tutor application
              </p>

              <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/60">
                {description}
              </p>
            </div>

            <div className="mt-10">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function TutorAssessmentPage({
  profile,
  onboarding,
  setOnboarding,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [protectionNotice, setProtectionNotice] =
    useState("");
  const [now, setNow] = useState(Date.now());
  const submissionLockRef = useRef(false);

  const questions = onboarding.assessmentQuestions || [];
  const answers = onboarding.assessmentAnswers || {};
  const submitted =
    onboarding.assessmentScore !== null;
  const cooldown = getCooldownStatus(
    onboarding.cooldownUntil,
  );

  const answeredCount = Object.keys(answers).filter(
    (key) => answers[key] !== undefined,
  ).length;

  const expiresAtTimestamp = Date.parse(
    onboarding.assessmentExpiresAt || "",
  );

  const remainingSeconds = Number.isFinite(
    expiresAtTimestamp,
  )
    ? Math.max(
        0,
        Math.ceil((expiresAtTimestamp - now) / 1000),
      )
    : TUTOR_ASSESSMENT_DURATION_MINUTES * 60;

  const timerMinutes = Math.floor(remainingSeconds / 60);
  const timerSeconds = remainingSeconds % 60;

  const timerLabel = `${String(timerMinutes).padStart(
    2,
    "0",
  )}:${String(timerSeconds).padStart(2, "0")}`;

  const generateNewAssessment = useCallback(
    async ({ resetCooldown = false } = {}) => {
      const currentCooldown = getCooldownStatus(
        onboarding.cooldownUntil,
      );

      if (currentCooldown.active && !resetCooldown) {
        setError(
          `A new assessment becomes available on ${formatCooldownDate(
            onboarding.cooldownUntil,
          )}.`,
        );
        return;
      }

      setLoading(true);
      setError("");
      submissionLockRef.current = false;

      try {
        const attemptNumber =
          Number(onboarding.assessmentAttempts || 0) + 1;

        const generatedQuestions =
          await generateTutorAssessment(
            onboarding.selectedCourseTitle ||
              profile.teachingCourse ||
              profile.specialty,
            {
              applicantId:
                onboarding.applicantId || profile.id,
              applicantEmail: profile.email,
              attemptNumber,
              excludedFingerprints:
                onboarding.previousQuestionFingerprints ||
                [],
            },
          );

        const fingerprints = generatedQuestions.map(
          (question) =>
            question.fingerprint ||
            getQuestionFingerprint(question.question),
        );

        if (
          new Set(fingerprints).size !==
          TUTOR_ASSESSMENT_QUESTION_COUNT
        ) {
          throw new Error(
            "The generated assessment contained repeated questions.",
          );
        }

        const assessmentWindow =
          createAssessmentWindow();

        setOnboarding((current) => ({
          ...current,
          assessmentId: `ASSESSMENT-${Date.now()}`,
          assessmentSeed: `${current.applicantId}|${attemptNumber}|${Date.now()}`,
          assessmentQuestions: generatedQuestions,
          assessmentQuestionFingerprints:
            fingerprints,
          assessmentAnswers: {},
          assessmentScore: null,
          assessmentPassed: false,
          assessmentCompletedAt: "",
          assessmentTimedOut: false,
          integrityWarnings: 0,
          failedAt: resetCooldown
            ? ""
            : current.failedAt,
          cooldownUntil: resetCooldown
            ? ""
            : current.cooldownUntil,
          applicationStatus: "assessment_in_progress",
          ...assessmentWindow,
        }));

        setNow(Date.now());
      } catch {
        setError(
          "The 50-question assessment could not be prepared without repetitions. Refresh and try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [
      onboarding.applicantId,
      onboarding.assessmentAttempts,
      onboarding.cooldownUntil,
      onboarding.previousQuestionFingerprints,
      onboarding.selectedCourseTitle,
      profile.email,
      profile.id,
      profile.specialty,
      profile.teachingCourse,
      setOnboarding,
    ],
  );

  useEffect(() => {
    if (
      questions.length === 0 &&
      !submitted &&
      !cooldown.active &&
      !loading
    ) {
      generateNewAssessment({
        resetCooldown: Boolean(
          onboarding.cooldownUntil &&
            !cooldown.active,
        ),
      });
    }
  }, [
    cooldown.active,
    generateNewAssessment,
    loading,
    onboarding.cooldownUntil,
    questions.length,
    submitted,
  ]);

  const completeAssessment = useCallback(
    ({ timedOut = false } = {}) => {
      if (
        submissionLockRef.current ||
        questions.length === 0 ||
        submitted
      ) {
        return;
      }

      submissionLockRef.current = true;

      const score = scoreTutorAssessment(
        questions,
        answers,
      );
      const passed = score >= TUTOR_PASS_MARK;
      const completedAt = new Date().toISOString();
      const currentFingerprints = questions.map(
        (question) =>
          question.fingerprint ||
          getQuestionFingerprint(question.question),
      );

      if (passed) {
        clearTutorAssessmentFailure(profile.email);

        setOnboarding((current) => ({
          ...current,
          assessmentScore: score,
          assessmentPassed: true,
          assessmentAttempts:
            Number(current.assessmentAttempts || 0) + 1,
          assessmentCompletedAt: completedAt,
          assessmentTimedOut: timedOut,
          applicationStatus: "agreement_required",
          failedAt: "",
          cooldownUntil: "",
          previousQuestionFingerprints: Array.from(
            new Set([
              ...(current.previousQuestionFingerprints ||
                []),
              ...currentFingerprints,
            ]),
          ),
        }));

        return;
      }

      const cooldownWindow = createCooldownWindow();

      recordTutorAssessmentFailure({
        applicantEmail: profile.email,
        applicantId:
          onboarding.applicantId || profile.id,
        courseTitle:
          onboarding.selectedCourseTitle ||
          profile.teachingCourse,
        score,
        ...cooldownWindow,
      });

      setOnboarding((current) => ({
        ...current,
        assessmentScore: score,
        assessmentPassed: false,
        assessmentAttempts:
          Number(current.assessmentAttempts || 0) + 1,
        assessmentCompletedAt: completedAt,
        assessmentTimedOut: timedOut,
        applicationStatus: "assessment_cooldown",
        ...cooldownWindow,
        previousQuestionFingerprints: Array.from(
          new Set([
            ...(current.previousQuestionFingerprints ||
              []),
            ...currentFingerprints,
          ]),
        ),
      }));
    },
    [
      answers,
      onboarding.applicantId,
      onboarding.selectedCourseTitle,
      profile.email,
      profile.id,
      profile.teachingCourse,
      questions,
      setOnboarding,
      submitted,
    ],
  );

  useEffect(() => {
    if (
      submitted ||
      loading ||
      questions.length === 0 ||
      cooldown.active
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    cooldown.active,
    loading,
    questions.length,
    submitted,
  ]);

  useEffect(() => {
    if (
      remainingSeconds === 0 &&
      !submitted &&
      questions.length > 0 &&
      !loading
    ) {
      completeAssessment({ timedOut: true });
    }
  }, [
    completeAssessment,
    loading,
    questions.length,
    remainingSeconds,
    submitted,
  ]);

  useEffect(() => {
    if (
      submitted ||
      loading ||
      questions.length === 0 ||
      cooldown.active
    ) {
      return undefined;
    }

    const preventProtectedAction = (event) => {
      event.preventDefault();
      setProtectionNotice(
        "Copying, selecting, dragging and printing assessment content are disabled.",
      );

      setOnboarding((current) => ({
        ...current,
        integrityWarnings:
          Number(current.integrityWarnings || 0) + 1,
      }));
    };

    const preventKeyboardShortcut = (event) => {
      const key = String(event.key || "").toLowerCase();

      if (
        (event.ctrlKey || event.metaKey) &&
        ["a", "c", "x", "p", "s", "u"].includes(key)
      ) {
        preventProtectedAction(event);
      }

      if (key === "printscreen") {
        setProtectionNotice(
          "Screenshots cannot be fully blocked by a browser. Assessment activity is still monitored.",
        );
      }
    };

    const protectedEvents = [
      "copy",
      "cut",
      "paste",
      "contextmenu",
      "dragstart",
      "selectstart",
    ];

    protectedEvents.forEach((eventName) => {
      document.addEventListener(
        eventName,
        preventProtectedAction,
      );
    });

    document.addEventListener(
      "keydown",
      preventKeyboardShortcut,
    );

    return () => {
      protectedEvents.forEach((eventName) => {
        document.removeEventListener(
          eventName,
          preventProtectedAction,
        );
      });

      document.removeEventListener(
        "keydown",
        preventKeyboardShortcut,
      );
    };
  }, [
    cooldown.active,
    loading,
    questions.length,
    setOnboarding,
    submitted,
  ]);

  const progress = questions.length
    ? Math.round(
        (answeredCount / questions.length) * 100,
      )
    : 0;

  const chooseAnswer = (questionId, optionIndex) => {
    if (submitted || remainingSeconds === 0) {
      return;
    }

    setOnboarding((current) => ({
      ...current,
      assessmentAnswers: {
        ...current.assessmentAnswers,
        [questionId]: optionIndex,
      },
    }));
  };

  const submitAssessment = (event) => {
    event.preventDefault();

    if (answeredCount !== questions.length) {
      setError(
        `Answer all ${questions.length} questions before submitting. The assessment will submit automatically when the timer reaches zero.`,
      );
      return;
    }

    completeAssessment({ timedOut: false });
    setError("");
  };

  const startAfterCooldown = async () => {
    const currentCooldown = getCooldownStatus(
      onboarding.cooldownUntil,
    );

    if (currentCooldown.active) {
      setError(
        `You can register for a new assessment on ${formatCooldownDate(
          onboarding.cooldownUntil,
        )}.`,
      );
      return;
    }

    setOnboarding((current) => ({
      ...current,
      assessmentQuestions: [],
      assessmentAnswers: {},
      assessmentQuestionFingerprints: [],
      assessmentScore: null,
      assessmentPassed: false,
      assessmentStartedAt: "",
      assessmentExpiresAt: "",
      assessmentCompletedAt: "",
      assessmentTimedOut: false,
      failedAt: "",
      cooldownUntil: "",
      applicationStatus: "assessment_required",
    }));

    await generateNewAssessment({
      resetCooldown: true,
    });
  };

  const cooldownDaysRemaining = Math.max(
    1,
    Math.ceil(
      cooldown.remainingMilliseconds /
        (24 * 60 * 60 * 1000),
    ),
  );

  return (
    <OnboardingLayout
      step="1 of 2"
      title="Pass the timed course and teaching assessment."
      description={`The assessment contains ${TUTOR_ASSESSMENT_QUESTION_COUNT} non-repeating questions prepared for ${onboarding.selectedCourseTitle}. You have ${TUTOR_ASSESSMENT_DURATION_MINUTES} minutes and must score at least ${TUTOR_PASS_MARK}%.`}
    >
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }
          }

          .nexacore-assessment-protected {
            -webkit-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
          }
        `}
      </style>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-[30px] border border-white/15 bg-black/55 p-7 text-white backdrop-blur-xl xl:sticky xl:top-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600">
            <AssessmentIcon />
          </div>

          <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-red-400">
            Assessment course
          </p>

          <h2 className="mt-3 text-2xl font-black">
            {onboarding.selectedCourseTitle}
          </h2>

          <div className="mt-7 space-y-4">
            <div className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-white/40">
                Required score
              </p>
              <p className="mt-2 text-xl font-black">
                {TUTOR_PASS_MARK}%
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-white/40">
                Questions
              </p>
              <p className="mt-2 text-xl font-black">
                {questions.length ||
                  TUTOR_ASSESSMENT_QUESTION_COUNT}
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-white/40">
                Time limit
              </p>
              <p
                className={`mt-2 text-2xl font-black ${
                  remainingSeconds <= 300 &&
                  !submitted &&
                  !cooldown.active
                    ? "text-red-400"
                    : ""
                }`}
              >
                {submitted || cooldown.active
                  ? `${TUTOR_ASSESSMENT_DURATION_MINUTES} minutes`
                  : timerLabel}
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-white/40">
                Minimum correct answers
              </p>
              <p className="mt-2 text-xl font-black">
                {Math.ceil(
                  TUTOR_ASSESSMENT_QUESTION_COUNT *
                    (TUTOR_PASS_MARK / 100),
                )}{" "}
                of {TUTOR_ASSESSMENT_QUESTION_COUNT}
              </p>
            </div>
          </div>

          {!submitted &&
            questions.length > 0 &&
            !cooldown.active && (
              <div className="mt-7">
                <div className="flex items-center justify-between gap-3 text-xs font-black">
                  <span>Answered</span>
                  <span>
                    {answeredCount}/{questions.length}
                  </span>
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-red-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

          <div className="mt-7 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-300">
              Assessment protection
            </p>
            <p className="mt-2 text-xs leading-6 text-white/55">
              Text selection, copy, paste, drag, save and print shortcuts are disabled while the assessment is active.
            </p>
          </div>

          <p className="mt-5 text-xs leading-6 text-white/40">
            The production endpoint must generate and validate exactly 50 unique questions for each applicant and attempt.
          </p>
        </aside>

        <section
          className="nexacore-assessment-protected rounded-[30px] border border-white/15 bg-white/95 p-6 shadow-[0_35px_120px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8"
          onCopy={(event) => event.preventDefault()}
          onCut={(event) => event.preventDefault()}
          onPaste={(event) => event.preventDefault()}
          onContextMenu={(event) =>
            event.preventDefault()
          }
          onDragStart={(event) => event.preventDefault()}
        >
          {protectionNotice && (
            <p className="mb-5 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
              {protectionNotice}
            </p>
          )}

          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center text-center">
              <div>
                <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-neutral-200 border-t-red-600" />
                <h2 className="mt-6 text-2xl font-black">
                  Preparing 50 unique questions
                </h2>
                <p className="mt-3 text-sm text-neutral-500">
                  The questions are being matched to your selected course, applicant profile and assessment attempt.
                </p>
              </div>
            </div>
          ) : cooldown.active ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600">
                <LockIcon className="h-10 w-10" />
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-red-600">
                Reapplication waiting period
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Assessment registration is temporarily locked
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-500">
                Because the required {TUTOR_PASS_MARK}% pass mark was not reached, this tutor application must wait {TUTOR_FAILED_COOLDOWN_DAYS} days before another assessment can be registered.
              </p>

              <div className="mx-auto mt-7 max-w-xl rounded-2xl bg-neutral-950 p-6 text-white">
                <p className="text-xs uppercase tracking-[0.14em] text-white/40">
                  New assessment available
                </p>
                <p className="mt-3 text-xl font-black text-red-400">
                  {formatCooldownDate(
                    onboarding.cooldownUntil,
                  )}
                </p>
                <p className="mt-2 text-sm text-white/50">
                  Approximately {cooldownDaysRemaining} day
                  {cooldownDaysRemaining === 1 ? "" : "s"} remaining
                </p>
              </div>

              {onboarding.assessmentScore !== null && (
                <p className="mt-6 text-sm font-bold text-neutral-600">
                  Previous score:{" "}
                  <span className="text-red-600">
                    {onboarding.assessmentScore}%
                  </span>
                </p>
              )}
            </div>
          ) : submitted ? (
            <div className="py-10 text-center">
              <div
                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${
                  onboarding.assessmentPassed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {onboarding.assessmentPassed ? (
                  <CheckIcon className="h-10 w-10" />
                ) : (
                  <AssessmentIcon className="h-10 w-10" />
                )}
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-neutral-400">
                Assessment score
              </p>

              <p
                className={`mt-2 text-6xl font-black ${
                  onboarding.assessmentPassed
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {onboarding.assessmentScore}%
              </p>

              <h2 className="mt-5 text-3xl font-black">
                {onboarding.assessmentPassed
                  ? "Assessment passed"
                  : onboarding.assessmentTimedOut
                    ? "Assessment time expired"
                    : "Pass mark not reached"}
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-500">
                {onboarding.assessmentPassed
                  ? `You met the ${TUTOR_PASS_MARK}% requirement. Continue to the 60/40 tutor partnership agreement.`
                  : `A new assessment can only be registered after the ${TUTOR_FAILED_COOLDOWN_DAYS}-day waiting period.`}
              </p>

              {onboarding.assessmentPassed ? (
                <a
                  href="/tutor/agreement"
                  className="mt-7 inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-red-600 px-8 text-sm font-black text-white hover:bg-neutral-950"
                >
                  Continue to agreement
                  <ArrowIcon />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={startAfterCooldown}
                  className="mt-7 inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-red-600 px-8 text-sm font-black text-white hover:bg-neutral-950"
                >
                  Start new assessment
                  <ArrowIcon />
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={submitAssessment}>
              <div className="sticky top-3 z-20 rounded-2xl border border-red-200 bg-white/95 p-4 shadow-lg backdrop-blur-xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                      Timed tutor assessment
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      The assessment submits automatically at 00:00.
                    </p>
                  </div>

                  <div
                    className={`rounded-full px-5 py-3 text-xl font-black ${
                      remainingSeconds <= 300
                        ? "bg-red-600 text-white"
                        : "bg-neutral-950 text-white"
                    }`}
                  >
                    {timerLabel}
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-6">
                {questions.map(
                  (question, questionIndex) => (
                    <article
                      key={question.id}
                      className="relative overflow-hidden rounded-[24px] border border-neutral-200 p-5 sm:p-6"
                    >
                      <span className="pointer-events-none absolute -right-8 top-8 rotate-[-18deg] text-[10px] font-black uppercase tracking-[0.18em] text-neutral-950/[0.04]">
                        {profile.email} ·{" "}
                        {onboarding.applicantId}
                      </span>

                      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-red-600">
                            Question {questionIndex + 1}
                          </p>
                          <h3 className="mt-3 text-lg font-black leading-7">
                            {question.question}
                          </h3>
                        </div>

                        <span className="w-fit rounded-full bg-neutral-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-neutral-500">
                          {question.domain}
                        </span>
                      </div>

                      <div className="relative mt-5 grid gap-3">
                        {question.options.map(
                          (option, optionIndex) => {
                            const selected =
                              Number(
                                answers[question.id],
                              ) === optionIndex;

                            return (
                              <button
                                key={`${question.id}-${optionIndex}`}
                                type="button"
                                onClick={() =>
                                  chooseAnswer(
                                    question.id,
                                    optionIndex,
                                  )
                                }
                                className={`flex items-start gap-4 rounded-2xl border p-4 text-left text-sm leading-6 transition ${
                                  selected
                                    ? "border-red-600 bg-red-50 text-neutral-950"
                                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                                }`}
                              >
                                <span
                                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-black ${
                                    selected
                                      ? "border-red-600 bg-red-600 text-white"
                                      : "border-neutral-300"
                                  }`}
                                >
                                  {String.fromCharCode(
                                    65 + optionIndex,
                                  )}
                                </span>
                                <span>{option}</span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    </article>
                  ),
                )}
              </div>

              {error && (
                <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 text-sm font-black text-white hover:bg-neutral-950"
              >
                Submit assessment
                <ArrowIcon />
              </button>
            </form>
          )}
        </section>
      </div>
    </OnboardingLayout>
  );
}

export function TutorAgreementPage({
  profile,
  onboarding,
  setOnboarding,
  agreement,
  setAgreement,
}) {
  const [form, setForm] = useState({
    legalName:
      agreement.legalName ||
      `${profile.firstName} ${profile.lastName}`,
    bankName: agreement.bankName || "",
    accountName: agreement.accountName || "",
    accountNumber: agreement.accountNumber || "",
    payoutCurrency: agreement.payoutCurrency || "NGN",
    signature: agreement.signature || "",
    acceptedRevenueShare:
      Boolean(agreement.acceptedRevenueShare),
    acceptedPartnershipTerms:
      Boolean(agreement.acceptedPartnershipTerms),
  });
  const [error, setError] = useState("");

  const canSign = useMemo(
    () =>
      form.legalName.trim() &&
      form.bankName.trim() &&
      form.accountName.trim() &&
      form.accountNumber.trim() &&
      form.signature.trim() &&
      form.acceptedRevenueShare &&
      form.acceptedPartnershipTerms,
    [form],
  );

  if (!onboarding.assessmentPassed) {
    return (
      <OnboardingLayout
        step="2 of 2"
        title="The agreement is locked."
        description={`You must pass the assessment with at least ${TUTOR_PASS_MARK}% before the tutor partnership agreement becomes available.`}
      >
        <div className="mx-auto max-w-2xl rounded-[30px] border border-white/15 bg-white/95 p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
            <LockIcon />
          </div>
          <h2 className="mt-6 text-2xl font-black">
            Assessment required
          </h2>
          <a
            href="/tutor/assessment"
            className="mt-6 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white"
          >
            Open assessment
          </a>
        </div>
      </OnboardingLayout>
    );
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const signAgreement = (event) => {
    event.preventDefault();

    if (!canSign) {
      setError(
        "Complete the payout details, type your legal signature and accept both agreement confirmations.",
      );
      return;
    }

    const signedAt = new Date().toISOString();

    setAgreement({
      ...form,
      signedAt,
      tutorPercent:
        TUTOR_REVENUE_SHARE.tutorPercent,
      platformPercent:
        TUTOR_REVENUE_SHARE.platformPercent,
      agreementVersion:
        onboarding.agreementVersion ||
        defaultTutorOnboarding.agreementVersion,
    });

    setOnboarding((current) => ({
      ...current,
      agreementSigned: true,
      agreementSignedAt: signedAt,
      applicationStatus: "approved",
      approved: true,
    }));

    window.location.href = "/tutor/dashboard";
  };

  return (
    <OnboardingLayout
      step="2 of 2"
      title="Review and sign the tutor partnership agreement."
      description="NexaCore pays the tutor 60% of the applicable teaching revenue and retains 40% for platform operations, technology, learner acquisition and administration."
    >
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <aside className="h-fit rounded-[30px] border border-white/15 bg-black/55 p-7 text-white backdrop-blur-xl xl:sticky xl:top-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-400">
            Revenue partnership
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-red-600 p-5">
              <p className="text-xs text-white/65">
                Tutor share
              </p>
              <p className="mt-2 text-4xl font-black">
                {TUTOR_REVENUE_SHARE.tutorPercent}%
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.08] p-5">
              <p className="text-xs text-white/45">
                NexaCore share
              </p>
              <p className="mt-2 text-4xl font-black">
                {TUTOR_REVENUE_SHARE.platformPercent}%
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              "Tutor delivers agreed classes, materials, assessments and feedback.",
              "Tutor maintains professional conduct and protects learner information.",
              "NexaCore provides the platform, payment collection, administration and learner acquisition.",
              "The 60/40 split is recorded in the signed electronic agreement.",
              "Refunds, chargebacks, taxes and payment-provider costs must be handled according to the final reviewed contract.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white/[0.05] p-4"
              >
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm leading-6 text-white/65">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs leading-6 text-white/35">
            This interface records acceptance for the product workflow. The final commercial agreement should be reviewed by qualified legal and tax professionals before production use.
          </p>
        </aside>

        <form
          onSubmit={signAgreement}
          className="rounded-[30px] border border-white/15 bg-white/95 p-6 shadow-[0_35px_120px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8"
        >
          <div className="border-b border-neutral-200 pb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
              {onboarding.agreementVersion}
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Tutor payment and partnership details
            </h2>

            <p className="mt-3 text-sm leading-7 text-neutral-500">
              Enter the legal and payout information that should be attached to your tutor account.
            </p>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {[
              [
                "legalName",
                "Full legal name",
                "Enter the name on your legal identification",
              ],
              [
                "bankName",
                "Bank name",
                "Enter your bank name",
              ],
              [
                "accountName",
                "Account name",
                "Enter the account holder name",
              ],
              [
                "accountNumber",
                "Account number",
                "Enter the payout account number",
              ],
            ].map(([name, label, placeholder]) => (
              <label
                key={name}
                className="text-sm font-black"
              >
                {label}
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm font-medium outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                />
              </label>
            ))}

            <label className="text-sm font-black">
              Payout currency
              <select
                name="payoutCurrency"
                value={form.payoutCurrency}
                onChange={handleChange}
                className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm font-medium outline-none focus:border-red-600"
              >
                <option value="NGN">Nigerian Naira (NGN)</option>
                <option value="USD">United States Dollar (USD)</option>
              </select>
            </label>

            <label className="text-sm font-black">
              Electronic signature
              <input
                name="signature"
                value={form.signature}
                onChange={handleChange}
                placeholder="Type your full legal name"
                className="mt-2 h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm font-medium outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
              />
            </label>
          </div>

          <div className="mt-7 space-y-4">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <input
                type="checkbox"
                name="acceptedRevenueShare"
                checked={form.acceptedRevenueShare}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-red-600"
              />

              <span className="text-sm leading-7 text-neutral-600">
                I understand and accept that my tutor share is{" "}
                <strong className="text-neutral-950">
                  {TUTOR_REVENUE_SHARE.tutorPercent}%
                </strong>{" "}
                and NexaCore retains{" "}
                <strong className="text-neutral-950">
                  {TUTOR_REVENUE_SHARE.platformPercent}%
                </strong>{" "}
                under the tutor partnership arrangement.
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <input
                type="checkbox"
                name="acceptedPartnershipTerms"
                checked={
                  form.acceptedPartnershipTerms
                }
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-red-600"
              />

              <span className="text-sm leading-7 text-neutral-600">
                I agree to deliver the approved course professionally, follow NexaCore policies, protect student information and comply with the final tutor partnership terms.
              </span>
            </label>
          </div>

          {error && (
            <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSign}
            className="mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 text-sm font-black text-white transition hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign agreement and activate tutor workspace
            <ArrowIcon />
          </button>
        </form>
      </div>
    </OnboardingLayout>
  );
}

export function TutorAccessGate({
  nextStep,
}) {
  const destination =
    nextStep === "agreement"
      ? "/tutor/agreement"
      : "/tutor/assessment";

  return (
    <OnboardingLayout
      step="Access required"
      title="Complete tutor verification before opening the workspace."
      description="Tutor dashboard access is blocked until the course assessment is passed and the 60/40 partnership agreement is signed."
    >
      <div className="mx-auto max-w-2xl rounded-[30px] border border-white/15 bg-white/95 p-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <LockIcon />
        </div>

        <h2 className="mt-6 text-2xl font-black">
          {nextStep === "agreement"
            ? "Partnership agreement required"
            : "Course assessment required"}
        </h2>

        <a
          href={destination}
          className="mt-6 inline-flex items-center gap-3 rounded-full bg-red-600 px-6 py-3.5 text-sm font-black text-white hover:bg-neutral-950"
        >
          Continue verification
          <ArrowIcon />
        </a>
      </div>
    </OnboardingLayout>
  );
}
