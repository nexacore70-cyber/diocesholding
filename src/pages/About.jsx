import PublicPageLayout, {
  ArrowIcon,
  CheckIcon,
  SectionHeading,
} from "../components/PublicPageLayout";

const values = [
  {
    title: "Practical learning",
    description:
      "Technology education built around projects, feedback and real professional skills.",
  },
  {
    title: "Trusted delivery",
    description:
      "Structured project workflows that help clients and professionals work with confidence.",
  },
  {
    title: "Opportunity",
    description:
      "A clear path from learning and portfolio development into internships and paid work.",
  },
  {
    title: "Professional growth",
    description:
      "Profiles, certificates, reviews and completed projects that demonstrate capability.",
  },
];

const ecosystemItems = [
  {
    title: "Academy",
    description:
      "Learn practical technology skills from experienced tutors through live classes and projects.",
    image: "/images/hero/banner1.png",
  },
  {
    title: "Service Marketplace",
    description:
      "Post projects, receive matching proposals and collaborate with technology professionals.",
    image: "/images/hero/banner2.png",
  },
  {
    title: "Talent Network",
    description:
      "Build professional profiles, showcase project evidence and discover work opportunities.",
    image: "/images/hero/banner3.png",
  },
];

export default function About() {
  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner1.png"
      eyebrow="About NexaCore"
      title="Technology learning and"
      highlight="professional delivery connected."
      description="NexaCore brings students, tutors, clients and technology professionals together through one structured ecosystem."
    >
      {/* MISSION */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-12">
          <div className="relative min-h-[560px] overflow-hidden rounded-[34px] bg-neutral-950">
            <img
              src="/images/hero/banner4.png"
              alt="NexaCore technology ecosystem"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

            <div className="absolute bottom-7 left-7 right-7 rounded-3xl border border-white/15 bg-black/55 p-7 text-white backdrop-blur-xl sm:bottom-9 sm:left-9 sm:right-9 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
                Our core promise
              </p>

              <p className="mt-4 text-2xl font-black leading-9 sm:text-3xl">
                Learn technology skills, hire trusted talent and deliver
                meaningful projects through one platform.
              </p>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Our mission"
              title="Creating a stronger connection between skills and opportunity."
              description="NexaCore exists to make technology education practical and professional service delivery more accessible, structured and trustworthy."
              centered={false}
            />

            <div className="mt-9 space-y-5">
              {[
                "Help learners build job-relevant technology skills.",
                "Give tutors professional tools for teaching and mentoring.",
                "Help clients find talent that matches their project category.",
                "Create work opportunities for trained and verified professionals.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                    <CheckIcon />
                  </span>

                  <p className="leading-7 text-neutral-600">{item}</p>
                </div>
              ))}
            </div>

            <a
              href="/signup"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-neutral-950 px-7 py-4 text-sm font-black text-white transition hover:bg-red-600"
            >
              Join the NexaCore ecosystem
              <ArrowIcon className="transition group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#f5f5f5] py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="What guides us"
            title="Built around trust, practical skills and professional growth."
            description="Every part of NexaCore is designed to help users move towards a clear and valuable outcome."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-[28px] border border-neutral-200 bg-white p-7 transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
              >
                <div className="h-3 w-3 rounded-full bg-red-600" />

                <h3 className="mt-10 text-2xl font-black text-neutral-950">
                  {value.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="The NexaCore ecosystem"
            title="Learning, professional proof and real project delivery."
            description="Each part of the platform supports the next stage of a user’s growth."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {ecosystemItems.map((item) => (
              <article
                key={item.title}
                className="group relative min-h-[480px] overflow-hidden rounded-[30px] bg-neutral-950"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <h3 className="text-3xl font-black">{item.title}</h3>

                  <p className="mt-4 text-sm leading-7 text-white/65">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}