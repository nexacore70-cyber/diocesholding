import SiteSettingsMenu from "../../components/common/SiteSettingsMenu";

import {
  STORAGE_KEYS,
  defaultProfile,
  getStudentLandingPath,
  loadStoredValue,
} from "../student/studentData";

import {
  TALENT_STORAGE_KEYS,
  beginTalentAccount,
  getTalentLandingPath,
  loadTalentValue,
} from "../talent/talentData";

const learningItems = [
  {
    title: "My Learning",
    description:
      "Continue courses, lessons, classes, assignments and projects.",
    getHref: () => getStudentLandingPath(),
  },
  {
    title: "Bootcamps",
    description:
      "View your intensive professional training programmes.",
    getHref: () => "/bootcamp",
  },
  {
    title: "Internships",
    description:
      "Access supervised internship tracks and portfolio projects.",
    getHref: () => "/internship",
  },
  {
    title: "Certificates",
    description:
      "View certificates earned through approved learning programmes.",
    getHref: () => "/student/certificates",
  },
];

const marketplaceItems = [
  {
    title: "Professional Portfolio",
    description:
      "Publish your approved work and professional service profile.",
    href: "/talent/portfolio",
  },
  {
    title: "Matching Jobs",
    description:
      "Find service requests that match your skills.",
    href: "/talent/jobs",
  },
  {
    title: "My Bids",
    description:
      "Create, review and manage proposals submitted to clients.",
    href: "/talent/bids",
  },
  {
    title: "Active Work",
    description:
      "Manage projects, milestones, files and client communication.",
    href: "/talent/work",
  },
  {
    title: "Deliverables",
    description:
      "Upload progress work and protected final deliveries.",
    href: "/talent/deliverables",
  },
  {
    title: "Earnings",
    description:
      "View secured payments, available balance and payout records.",
    href: "/talent/earnings",
  },
];

function DashboardCard({
  title,
  description,
  href,
}) {
  return (
    <a
      href={href}
      className="group rounded-3xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-500 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 font-black text-white">
        →
      </div>

      <h2 className="mt-5 text-xl font-black text-neutral-950 dark:text-white">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
        {description}
      </p>

      <span className="mt-5 inline-flex text-sm font-black text-red-600">
        Open workspace
      </span>
    </a>
  );
}

export default function MemberDashboard() {
  const studentProfile = loadStoredValue(
    STORAGE_KEYS.profile,
    defaultProfile,
  );

  const talentProfile = loadTalentValue(
    TALENT_STORAGE_KEYS.profile,
    null,
  );

  const activateMarketplace = () => {
    beginTalentAccount({
      firstName: studentProfile.firstName,
      lastName: studentProfile.lastName,
      email: studentProfile.email,
      phone: studentProfile.phone,
      professionalSkill:
        studentProfile.careerGoal ||
        "Technology Services",
    });
  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <a href="/">
            <img
              src="/images/logo/nexacore-logo-light.png"
              alt="NexaCore"
              className="h-11 w-auto max-w-[180px] object-contain"
            />
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden text-sm font-black text-neutral-600 hover:text-red-600 dark:text-neutral-300 sm:block"
            >
              Home
            </a>

            <SiteSettingsMenu />
          </div>
        </div>
      </header>

      <section className="bg-neutral-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
            NexaCore Learn & Earn
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Welcome,{" "}
            {studentProfile.firstName || "Member"}.
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-8 text-white/60 sm:text-base">
            Learn practical skills, complete supervised
            programmes, publish your work, bid for projects
            and build professional earnings through one
            account.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 lg:px-10">
        <section>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
            Learning and programmes
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Continue building your skills
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {learningItems.map((item) => (
              <DashboardCard
                key={item.title}
                title={item.title}
                description={item.description}
                href={item.getHref()}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
            Services and earnings
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Turn your skills into paid work
          </h2>

          {!talentProfile ? (
            <div className="mt-8 rounded-[30px] bg-neutral-950 p-7 text-white sm:p-10">
              <h3 className="text-2xl font-black">
                Activate your professional profile
              </h3>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
                Create your marketplace identity using the
                details from your learning account. You can
                then publish portfolio work, submit bids and
                receive payments.
              </p>

              <button
                type="button"
                onClick={activateMarketplace}
                className="mt-6 rounded-full bg-red-600 px-7 py-4 text-sm font-black text-white hover:bg-white hover:text-red-600"
              >
                Activate Work & Earn
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={getTalentLandingPath()}
                  className="rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white"
                >
                  Open talent dashboard
                </a>

                <span className="rounded-full border border-green-300 bg-green-50 px-5 py-3 text-sm font-black text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
                  Professional profile activated
                </span>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {marketplaceItems.map((item) => (
                  <DashboardCard
                    key={item.title}
                    {...item}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}