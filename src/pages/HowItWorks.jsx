import { useState } from "react";
import PublicPageLayout, {
  ArrowIcon,
  CheckIcon,
  SectionHeading,
} from "../components/PublicPageLayout";

const journeys = {
  student: {
    label: "Student",
    title: "Learn practical skills and build professional proof.",
    description:
      "Students can discover courses, choose tutors, attend classes and complete practical projects.",
    image: "/images/hero/banner1.png",
    steps: [
      "Create a student account and select learning interests.",
      "Browse courses and compare available tutors.",
      "Enroll, pay and access the learning workspace.",
      "Attend live classes and access course materials.",
      "Submit assignments and receive tutor feedback.",
      "Complete a final project and earn a certificate.",
    ],
    button: "Start learning",
    href: "/signup?role=student",
  },
  tutor: {
    label: "Tutor",
    title: "Teach learners and manage professional courses.",
    description:
      "Tutors receive tools for courses, live sessions, assignments, grading and student support.",
    image: "/images/hero/banner2.png",
    steps: [
      "Create a tutor account and complete the teaching profile.",
      "Submit teaching specialties and professional experience.",
      "Create course content and define the curriculum.",
      "Schedule classes and upload learning materials.",
      "Grade assignments and provide student feedback.",
      "Approve final projects and certificate eligibility.",
    ],
    button: "Apply as a tutor",
    href: "/signup?role=tutor",
  },
  client: {
    label: "Client",
    title: "Post projects and hire matching technology talent.",
    description:
      "Clients can manage the complete hiring and project-delivery process through NexaCore.",
    image: "/images/hero/banner3.png",
    steps: [
      "Create a client workspace and complete the profile.",
      "Post a project with category, budget and deadline.",
      "Receive proposals from matching professionals.",
      "Compare profiles, ratings and delivery timelines.",
      "Fund the project and collaborate in the workroom.",
      "Approve delivery, release payment and submit a review.",
    ],
    button: "Create client account",
    href: "/signup?role=client",
  },
  talent: {
    label: "Talent",
    title: "Discover opportunities and deliver professional work.",
    description:
      "Technology professionals can build profiles, submit proposals and manage project delivery.",
    image: "/images/hero/banner4.png",
    steps: [
      "Create a talent account and add approved skills.",
      "Build a professional profile and upload portfolio work.",
      "Discover projects that match your categories.",
      "Submit proposals with pricing and delivery timelines.",
      "Collaborate through milestones, files and messages.",
      "Complete the work and build ratings and reputation.",
    ],
    button: "Build talent profile",
    href: "/signup?role=talent",
  },
};

export default function HowItWorks() {
  const [activeJourney, setActiveJourney] = useState("student");

  const journey = journeys[activeJourney];

  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner2.png"
      eyebrow="How NexaCore works"
      title="Clear journeys for"
      highlight="learning, hiring and delivery."
      description="Every NexaCore user receives a structured experience designed around their role and intended outcome."
    >
      {/* JOURNEY SELECTOR */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Choose your journey"
            title="See how NexaCore works for you."
            description="Select an account type to view its complete platform journey."
          />

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 rounded-[28px] border border-neutral-200 bg-[#f5f5f5] p-3 lg:grid-cols-4">
            {Object.entries(journeys).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveJourney(key)}
                className={`rounded-2xl px-5 py-4 text-sm font-black transition ${
                  activeJourney === key
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-white text-neutral-600 hover:text-red-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-12 overflow-hidden rounded-[34px] border border-neutral-200 bg-neutral-950 shadow-2xl">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[520px] overflow-hidden">
                <img
                  src={journey.image}
                  alt={journey.label}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/15 bg-black/55 p-7 text-white backdrop-blur-xl">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
                    {journey.label} journey
                  </p>

                  <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                    {journey.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-white/60">
                    {journey.description}
                  </p>
                </div>
              </div>

              <div className="p-7 text-white sm:p-10 lg:p-12">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-500">
                  Your journey
                </p>

                <div className="mt-8 space-y-5">
                  {journey.steps.map((step) => (
                    <div
                      key={step}
                      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600">
                        <CheckIcon />
                      </span>

                      <p className="text-sm leading-7 text-white/70">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                <a
                  href={journey.href}
                  className="group mt-9 inline-flex items-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-black text-white transition hover:bg-white hover:text-red-600"
                >
                  {journey.button}
                  <ArrowIcon className="transition group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM PROTECTION */}
      <section className="bg-[#f5f5f5] py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Working securely"
            title="Professional tools support every stage."
            description="NexaCore connects communication, payments, classes and project delivery inside one structured workspace."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Matching", "Users discover courses, tutors and projects relevant to their categories."],
              ["Communication", "Messages, files, project updates and class communication stay connected."],
              ["Payments", "Course payments, milestones and professional transactions are tracked."],
              ["Reputation", "Certificates, portfolios, ratings and completed work create professional trust."],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-[28px] border border-neutral-200 bg-white p-7"
              >
                <div className="h-3 w-3 rounded-full bg-red-600" />

                <h3 className="mt-9 text-2xl font-black text-neutral-950">
                  {title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}