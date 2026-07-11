import { useState } from "react";
import PublicPageLayout, {
  ArrowIcon,
  CheckIcon,
  SectionHeading,
} from "../components/PublicPageLayout";

export const platformPagePaths = [
  "/academy",
  "/courses",
  "/tutors",
  "/certificates",
  "/student-projects",
  "/marketplace",
  "/projects/create",
  "/talent",
  "/services",
  "/become-a-provider",
  "/support",
  "/help",
  "/trust",
  "/privacy",
  "/terms",
];

const courses = [
  {
    title: "Full Stack Development",
    category: "Software Development",
    level: "Beginner to advanced",
    duration: "16 weeks",
    image: "/images/hero/banner1.png",
  },
  {
    title: "Data Analysis with Power BI",
    category: "Data and Analytics",
    level: "Beginner",
    duration: "10 weeks",
    image: "/images/hero/banner2.png",
  },
  {
    title: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    level: "Beginner",
    duration: "12 weeks",
    image: "/images/hero/banner3.png",
  },
  {
    title: "UI/UX Product Design",
    category: "Design and Product",
    level: "Beginner to intermediate",
    duration: "12 weeks",
    image: "/images/hero/banner4.png",
  },
  {
    title: "Artificial Intelligence and Machine Learning",
    category: "Data and AI",
    level: "Intermediate",
    duration: "18 weeks",
    image: "/images/hero/banner3.png",
  },
  {
    title: "Cloud and DevOps Engineering",
    category: "Cloud and DevOps",
    level: "Intermediate",
    duration: "16 weeks",
    image: "/images/hero/banner2.png",
  },
];

const tutors = [
  {
    name: "Frontend Development Tutor",
    skill: "React, JavaScript and UI Development",
    rating: "4.9",
    experience: "7 years experience",
    image: "/images/hero/banner1.png",
  },
  {
    name: "Data Analytics Tutor",
    skill: "Excel, SQL, Power BI and Python",
    rating: "4.8",
    experience: "6 years experience",
    image: "/images/hero/banner2.png",
  },
  {
    name: "Cybersecurity Tutor",
    skill: "SOC, GRC and Network Security",
    rating: "4.9",
    experience: "8 years experience",
    image: "/images/hero/banner3.png",
  },
  {
    name: "Product Design Tutor",
    skill: "Figma, UX Research and Design Systems",
    rating: "4.7",
    experience: "5 years experience",
    image: "/images/hero/banner4.png",
  },
];

const projects = [
  {
    title: "Business Analytics Dashboard",
    category: "Data Analysis",
    description:
      "An interactive dashboard developed to monitor business performance, revenue and customer trends.",
    image: "/images/hero/banner2.png",
  },
  {
    title: "Online Learning Platform",
    category: "Software Development",
    description:
      "A responsive course platform with authentication, student progress and tutor management.",
    image: "/images/hero/banner1.png",
  },
  {
    title: "Mobile Banking Interface",
    category: "UI/UX Design",
    description:
      "A user-focused mobile banking prototype designed around security and accessibility.",
    image: "/images/hero/banner4.png",
  },
  {
    title: "Network Security Assessment",
    category: "Cybersecurity",
    description:
      "A documented security review covering risks, controls and remediation recommendations.",
    image: "/images/hero/banner3.png",
  },
];

const services = [
  {
    title: "Software Development",
    description:
      "Web applications, dashboards, APIs, mobile applications and business systems.",
    image: "/images/hero/banner1.png",
  },
  {
    title: "Data Analysis",
    description:
      "Excel reporting, Power BI dashboards, SQL analysis and business intelligence.",
    image: "/images/hero/banner2.png",
  },
  {
    title: "Cybersecurity",
    description:
      "Security assessments, GRC documentation, network protection and incident support.",
    image: "/images/hero/banner3.png",
  },
  {
    title: "UI/UX and Product Design",
    description:
      "Wireframes, prototypes, product interfaces, UX audits and design systems.",
    image: "/images/hero/banner4.png",
  },
  {
    title: "Cloud and DevOps",
    description:
      "Cloud infrastructure, deployment, Docker, CI/CD pipelines and monitoring.",
    image: "/images/hero/banner2.png",
  },
  {
    title: "Digital Business Services",
    description:
      "Digital marketing, social media management, SEO and technology consulting.",
    image: "/images/hero/banner4.png",
  },
];

const talent = [
  {
    name: "Full Stack Developer",
    skills: "React, Node.js, APIs and PostgreSQL",
    rating: "4.9",
    jobs: "24 completed projects",
    image: "/images/hero/banner1.png",
  },
  {
    name: "Data Analyst",
    skills: "Power BI, SQL, Excel and Python",
    rating: "4.8",
    jobs: "18 completed projects",
    image: "/images/hero/banner2.png",
  },
  {
    name: "Cybersecurity Professional",
    skills: "GRC, SOC, Risk and Network Security",
    rating: "4.9",
    jobs: "20 completed projects",
    image: "/images/hero/banner3.png",
  },
  {
    name: "Product Designer",
    skills: "Figma, UX Research and Prototyping",
    rating: "4.7",
    jobs: "16 completed projects",
    image: "/images/hero/banner4.png",
  },
];

const frequentlyAskedQuestions = [
  {
    question: "What is NexaCore?",
    answer:
      "NexaCore is a technology academy and professional service marketplace. Students learn practical skills, tutors teach, clients hire talent and professionals deliver projects.",
  },
  {
    question: "How do I register?",
    answer:
      "Open the Create Account page and select Student, Tutor, Client or Talent. Each account type has its own onboarding information.",
  },
  {
    question: "How do students join a course?",
    answer:
      "Students browse available courses, compare tutors, select a course and complete payment before learning access is activated.",
  },
  {
    question: "How do clients hire professionals?",
    answer:
      "A client posts a project, receives proposals from matching talent, selects a provider and funds the agreed project or milestone.",
  },
  {
    question: "How are payments protected?",
    answer:
      "Project and course payments are processed through the platform. Project funds may be held until the agreed work or milestone is approved.",
  },
  {
    question: "Can students become service providers?",
    answer:
      "Students who complete approved courses and projects may build public portfolios and qualify for internships or professional opportunities.",
  },
];

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

function StarIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.8Z" />
    </svg>
  );
}

function ListingSearch({ value, onChange, placeholder }) {
  return (
    <div className="relative mx-auto mt-9 max-w-2xl">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-16 w-full rounded-full border border-neutral-300 bg-white pl-14 pr-6 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
      />

      <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
        <SearchIcon />
      </span>
    </div>
  );
}

function ImageCardsPage({
  bannerImage,
  eyebrow,
  title,
  highlight,
  description,
  sectionEyebrow,
  sectionTitle,
  sectionDescription,
  items,
  type,
}) {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <PublicPageLayout
      bannerImage={bannerImage}
      eyebrow={eyebrow}
      title={title}
      highlight={highlight}
      description={description}
    >
      <section className="bg-[#f5f5f5] py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow={sectionEyebrow}
            title={sectionTitle}
            description={sectionDescription}
          />

          <ListingSearch
            value={search}
            onChange={setSearch}
            placeholder={`Search ${type}...`}
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item.title || item.name}
                className="group overflow-hidden rounded-[30px] border border-neutral-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:border-red-200 hover:shadow-[0_25px_70px_rgba(0,0,0,0.13)]"
              >
                <div className="relative h-[270px] overflow-hidden bg-neutral-950">
                  <img
                    src={item.image}
                    alt={item.title || item.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                  <div className="absolute inset-x-6 bottom-6">
                    <h2 className="text-2xl font-black text-white">
                      {item.title || item.name}
                    </h2>

                    {(item.category || item.skill || item.skills) && (
                      <p className="mt-2 text-sm font-bold text-red-400">
                        {item.category || item.skill || item.skills}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {item.description && (
                    <p className="text-sm leading-7 text-neutral-500">
                      {item.description}
                    </p>
                  )}

                  {item.level && (
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-600">
                        {item.level}
                      </span>

                      <span className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                        {item.duration}
                      </span>
                    </div>
                  )}

                  {item.rating && (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-amber-500">
                        <StarIcon />
                        <span className="text-sm font-black text-neutral-950">
                          {item.rating}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-neutral-500">
                        {item.experience || item.jobs}
                      </span>
                    </div>
                  )}

                  <a
                    href="/signup"
                    className="group/link mt-7 inline-flex items-center gap-3 text-sm font-black text-red-600 transition hover:text-neutral-950"
                  >
                    View details
                    <ArrowIcon className="h-4 w-4 transition group-hover/link:translate-x-1" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="mt-12 rounded-3xl border border-neutral-200 bg-white p-10 text-center">
              <h3 className="text-xl font-black text-neutral-950">
                No matching result found
              </h3>

              <p className="mt-3 text-sm text-neutral-500">
                Try another search word.
              </p>
            </div>
          )}
        </div>
      </section>
    </PublicPageLayout>
  );
}

function AcademyPage() {
  const features = [
    {
      title: "Live classes",
      description:
        "Attend tutor-led sessions with video, screen sharing, messages and learning materials.",
      image: "/images/hero/banner1.png",
    },
    {
      title: "Practical assignments",
      description:
        "Complete structured tasks and receive professional feedback from your tutor.",
      image: "/images/hero/banner2.png",
    },
    {
      title: "Portfolio projects",
      description:
        "Build approved project evidence that can demonstrate your professional capability.",
      image: "/images/hero/banner3.png",
    },
    {
      title: "Certificates",
      description:
        "Receive verifiable certificates after completing course and project requirements.",
      image: "/images/hero/banner4.png",
    },
  ];

  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner1.png"
      eyebrow="NexaCore Academy"
      title="Learn practical skills."
      highlight="Build professional proof."
      description="Choose in-demand technology courses, learn from experienced tutors and complete projects that demonstrate what you can do."
    >
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Practical technology education"
            title="A structured path from learning to real opportunity."
            description="NexaCore Academy combines tutor-led education, practical assignments, portfolio projects and professional certificates."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group relative min-h-[430px] overflow-hidden rounded-[30px] bg-neutral-950"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <h2 className="text-2xl font-black">{feature.title}</h2>

                  <p className="mt-4 text-sm leading-7 text-white/65">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/courses"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-black text-white transition hover:bg-neutral-950"
            >
              Browse courses
              <ArrowIcon />
            </a>

            <a
              href="/tutors"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-7 py-4 text-sm font-black text-neutral-950 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
            >
              Find tutors
            </a>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

function CertificatesPage() {
  const [certificateId, setCertificateId] = useState("");
  const [message, setMessage] = useState("");

  const verifyCertificate = (event) => {
    event.preventDefault();

    if (!certificateId.trim()) return;

    setMessage(
      "Certificate verification will be connected when the backend certificate database is ready.",
    );
  };

  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner4.png"
      eyebrow="NexaCore certificates"
      title="Recognise achievement."
      highlight="Verify professional learning."
      description="NexaCore certificates confirm that a learner completed approved course and project requirements."
    >
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Certificate verification"
            title="Confirm a NexaCore certificate."
            description="Enter the unique certificate identification number shown on the learner’s certificate."
          />

          <form
            onSubmit={verifyCertificate}
            className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-[28px] border border-neutral-200 bg-[#f7f7f7] p-5 sm:flex-row"
          >
            <input
              type="text"
              value={certificateId}
              onChange={(event) => setCertificateId(event.target.value)}
              placeholder="Example: NC-2026-000001"
              required
              className="h-14 flex-1 rounded-2xl border border-neutral-300 bg-white px-5 text-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            />

            <button
              type="submit"
              className="h-14 rounded-2xl bg-red-600 px-7 text-sm font-black text-white transition hover:bg-neutral-950"
            >
              Verify certificate
            </button>
          </form>

          {message && (
            <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
              {message}
            </div>
          )}

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              [
                "Unique certificate ID",
                "Every approved certificate receives a unique verification number.",
              ],
              [
                "Project completion",
                "Certificates are linked to completed course and project requirements.",
              ],
              [
                "Public verification",
                "Clients and organisations can confirm certificate authenticity.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-[28px] border border-neutral-200 bg-white p-7 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                  <CheckIcon />
                </div>

                <h3 className="mt-6 text-xl font-black text-neutral-950">
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

function MarketplacePage() {
  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner3.png"
      eyebrow="NexaCore marketplace"
      title="Post technology projects."
      highlight="Hire matching professionals."
      description="Manage proposals, communication, milestones, project delivery and professional reviews through one structured marketplace."
    >
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Professional project delivery"
            title="A better way to connect clients and technology talent."
            description="NexaCore uses category matching to help relevant professionals discover the right projects."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Post a project",
                "Describe the work, required skills, budget, files and deadline.",
              ],
              [
                "Receive proposals",
                "Matching professionals submit prices, timelines and project plans.",
              ],
              [
                "Collaborate",
                "Manage messages, milestones, deliverables and revision requests.",
              ],
              [
                "Approve delivery",
                "Accept completed work, release payment and submit a professional review.",
              ],
            ].map(([title, description], index) => (
              <article
                key={title}
                className="rounded-[28px] border border-neutral-200 bg-[#f7f7f7] p-7"
              >
                <span className="text-sm font-black tracking-[0.18em] text-red-600">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-10 text-2xl font-black text-neutral-950">
                  {title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  {description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/projects/create"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-black text-white transition hover:bg-neutral-950"
            >
              Post a project
              <ArrowIcon />
            </a>

            <a
              href="/talent"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-7 py-4 text-sm font-black text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
            >
              Find talent
            </a>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

function PostProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    budget: "",
    deadline: "",
    description: "",
    skills: "",
  });

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    alert("Project form submitted. Backend project creation comes next.");
  };

  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner3.png"
      eyebrow="Post a project"
      title="Describe what you need."
      highlight="Receive matching proposals."
      description="Provide clear project information so NexaCore can connect your request with relevant technology professionals."
    >
      <section className="bg-[#f5f5f5] py-20 sm:py-28">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
          <div className="overflow-hidden rounded-[34px] border border-neutral-200 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.1)]">
            <div className="border-b border-neutral-200 p-7 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
                Project information
              </p>

              <h2 className="mt-3 text-3xl font-black text-neutral-950 sm:text-4xl">
                Create a service request
              </h2>

              <p className="mt-4 text-sm leading-7 text-neutral-500">
                Add enough detail for professionals to understand the expected
                work, required skills and delivery conditions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-7 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-black text-neutral-800">
                    Project title
                  </label>

                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Example: Build a responsive business website"
                    required
                    className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-neutral-800">
                    Service category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                  >
                    <option value="">Choose a category</option>
                    <option>Software Development</option>
                    <option>Data Analysis</option>
                    <option>Artificial Intelligence</option>
                    <option>Cybersecurity</option>
                    <option>UI/UX Design</option>
                    <option>Cloud and DevOps</option>
                    <option>Digital Marketing</option>
                    <option>Project Management</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-neutral-800">
                    Budget
                  </label>

                  <input
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Enter your project budget"
                    required
                    className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-neutral-800">
                    Expected deadline
                  </label>

                  <input
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-neutral-800">
                    Required skills
                  </label>

                  <input
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Example: React, Node.js, PostgreSQL"
                    required
                    className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-black text-neutral-800">
                    Project description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Explain the project scope, expected deliverables and important requirements..."
                    rows={8}
                    required
                    className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black text-white transition hover:bg-neutral-950"
              >
                Continue to post project
                <ArrowIcon />
              </button>
            </form>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

function BecomeProviderPage() {
  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner4.png"
      eyebrow="Become a provider"
      title="Turn your technology skills"
      highlight="into professional opportunities."
      description="Build a verified profile, discover matching projects and grow your reputation through successful delivery."
    >
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-12">
          <div className="relative min-h-[600px] overflow-hidden rounded-[34px]">
            <img
              src="/images/hero/banner2.png"
              alt="Become a NexaCore service provider"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

            <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/15 bg-black/55 p-7 text-white backdrop-blur-xl">
              <h2 className="text-3xl font-black">
                Your skills deserve professional visibility.
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/65">
                Show your portfolio, certificates, approved skills, reviews and
                completed project history.
              </p>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Professional onboarding"
              title="Build a profile clients can trust."
              description="NexaCore providers are professionals, companies, graduates and approved students who deliver technology services."
              centered={false}
            />

            <div className="mt-9 space-y-5">
              {[
                "Select your approved service categories and professional skills.",
                "Add your experience, portfolio projects and certificates.",
                "Complete identity and professional verification.",
                "Receive relevant projects based on your skills and availability.",
                "Submit proposals and deliver work through tracked milestones.",
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
              href="/signup?role=talent"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-black text-white transition hover:bg-neutral-950"
            >
              Create provider account
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

function SupportPage() {
  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner2.png"
      eyebrow="NexaCore support"
      title="Find the help you need."
      highlight="Continue with confidence."
      description="Access platform guidance for accounts, learning, projects, payments, safety and professional delivery."
    >
      <section className="bg-[#f5f5f5] py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Support options"
            title="Choose the support area that matches your request."
            description="Find answers immediately or contact the NexaCore team for further assistance."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Help centre",
                "Read common questions and platform guidance.",
                "/help",
              ],
              [
                "Safety and trust",
                "Learn how NexaCore protects users and transactions.",
                "/trust",
              ],
              [
                "Contact support",
                "Send a direct account, payment or project enquiry.",
                "/contact",
              ],
              [
                "Policies",
                "Read the platform privacy and service conditions.",
                "/privacy",
              ],
            ].map(([title, description, href]) => (
              <article
                key={title}
                className="rounded-[28px] border border-neutral-200 bg-white p-7"
              >
                <div className="h-3 w-3 rounded-full bg-red-600" />

                <h2 className="mt-10 text-2xl font-black text-neutral-950">
                  {title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  {description}
                </p>

                <a
                  href={href}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-black text-red-600"
                >
                  Open support
                  <ArrowIcon className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

function HelpCentrePage() {
  const [openQuestion, setOpenQuestion] = useState(0);
  const [search, setSearch] = useState("");

  const filteredQuestions = frequentlyAskedQuestions.filter((item) =>
    `${item.question} ${item.answer}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner1.png"
      eyebrow="Help centre"
      title="Answers and guidance"
      highlight="for using NexaCore."
      description="Find information about accounts, courses, projects, professional services, payments and platform access."
    >
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Frequently asked questions"
            title="How can we help?"
            description="Search the help centre or open a question below."
          />

          <ListingSearch
            value={search}
            onChange={setSearch}
            placeholder="Search for help..."
          />

          <div className="mt-12 space-y-3">
            {filteredQuestions.map((item, index) => {
              const isOpen = openQuestion === index;

              return (
                <article
                  key={item.question}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenQuestion(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-5 p-5 text-left sm:p-6"
                  >
                    <span className="font-black text-neutral-950">
                      {item.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen
                          ? "rotate-45 bg-red-600 text-white"
                          : "bg-neutral-100 text-neutral-950"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-neutral-200 px-5 py-5 sm:px-6">
                      <p className="text-sm leading-7 text-neutral-600">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="mt-12 rounded-[28px] bg-neutral-950 p-8 text-center text-white sm:p-10">
            <h2 className="text-2xl font-black">
              Still need assistance?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55">
              Contact the NexaCore team with information about your account,
              project, course, payment or technical problem.
            </p>

            <a
              href="/contact"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-black text-white"
            >
              Contact support
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

function TrustPage() {
  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner3.png"
      eyebrow="Safety and trust"
      title="Professional protection"
      highlight="across the NexaCore ecosystem."
      description="NexaCore is designed to support identity, payment, communication and project-delivery trust."
    >
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Platform protection"
            title="Safety is built into every important interaction."
            description="The final backend will enforce verification, secure payments, controlled access, reporting and dispute workflows."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Identity verification",
                "Tutor, talent and high-risk account activities may require identity and professional verification.",
              ],
              [
                "Protected payments",
                "Project funds and course transactions are processed through approved payment channels.",
              ],
              [
                "Category matching",
                "Projects are shown to professionals whose approved skills match the service category.",
              ],
              [
                "Project records",
                "Milestones, messages, files, revisions and approvals remain connected to the project.",
              ],
              [
                "Reporting and disputes",
                "Users can report misconduct, project problems, payment issues and unsafe content.",
              ],
              [
                "Privacy controls",
                "Personal and project information should only be accessed for authorised platform purposes.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-[28px] border border-neutral-200 bg-[#f7f7f7] p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                  <CheckIcon />
                </div>

                <h2 className="mt-7 text-2xl font-black text-neutral-950">
                  {title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  {description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-14 rounded-[34px] bg-neutral-950 p-8 text-center text-white sm:p-12">
            <h2 className="text-3xl font-black">
              Report a safety or trust concern.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55">
              Provide the account, project, course or transaction information
              needed for the NexaCore team to investigate the matter.
            </p>

            <a
              href="/contact"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-black"
            >
              Report a concern
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

const privacySections = [
  {
    title: "Information collected",
    text: "NexaCore may collect account details, profile information, identity or professional verification data, course activity, project information, messages, uploaded files, payment references and technical usage information.",
  },
  {
    title: "How information is used",
    text: "Information may be used to create accounts, provide learning and marketplace services, process payments, match users, support communication, prevent fraud, resolve disputes and improve the platform.",
  },
  {
    title: "Information sharing",
    text: "Relevant profile and project information may be shared with authorised users where necessary for teaching, hiring, project delivery, payment processing, support or legal compliance.",
  },
  {
    title: "Data security",
    text: "Reasonable technical and organisational controls should be used to protect personal information, account access, payments, communications and uploaded files.",
  },
  {
    title: "User rights",
    text: "Subject to applicable law, users may request access, correction, deletion, restriction or other permitted actions concerning their personal information.",
  },
  {
    title: "Contact",
    text: "Privacy questions and requests should be submitted through the NexaCore contact page using the privacy or support enquiry category.",
  },
];

const termsSections = [
  {
    title: "Account responsibility",
    text: "Users must provide accurate information, protect their login credentials and remain responsible for activities performed through their accounts.",
  },
  {
    title: "Acceptable use",
    text: "Users must not misuse the platform, impersonate others, post illegal content, submit false qualifications, interfere with services or engage in fraudulent activity.",
  },
  {
    title: "Academy participation",
    text: "Course access, tutor interaction, assignment submission, grading and certificate eligibility remain subject to the applicable course and platform requirements.",
  },
  {
    title: "Marketplace transactions",
    text: "Clients and providers must communicate project scope, milestones, pricing and delivery expectations clearly. Payments should remain on the approved platform channels.",
  },
  {
    title: "Reviews and professional conduct",
    text: "Reviews should reflect genuine experiences. Users must communicate professionally and avoid abusive, misleading or discriminatory conduct.",
  },
  {
    title: "Suspension and termination",
    text: "NexaCore may restrict or terminate accounts that violate platform rules, create safety risks, engage in fraud or misuse learning, payment or project features.",
  },
];

function PolicyPage({ type }) {
  const isPrivacy = type === "privacy";
  const sections = isPrivacy ? privacySections : termsSections;

  return (
    <PublicPageLayout
      bannerImage={
        isPrivacy
          ? "/images/hero/banner2.png"
          : "/images/hero/banner4.png"
      }
      eyebrow={isPrivacy ? "Privacy policy" : "Terms of service"}
      title={
        isPrivacy
          ? "How NexaCore handles"
          : "Rules for using"
      }
      highlight={
        isPrivacy
          ? "personal information."
          : "the NexaCore platform."
      }
      description={
        isPrivacy
          ? "This page explains the general categories of information NexaCore may collect, use, protect and manage."
          : "These terms explain the general responsibilities and conditions that apply when using NexaCore."
      }
    >
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[950px] px-5 sm:px-8">
          <div className="rounded-[30px] border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm leading-7 text-amber-900">
              This is a frontend policy draft. It should be reviewed and
              approved by qualified legal and data-protection professionals
              before the platform is publicly launched.
            </p>
          </div>

          <div className="mt-10 space-y-5">
            {sections.map((section, index) => (
              <article
                key={section.title}
                className="rounded-[28px] border border-neutral-200 bg-[#f7f7f7] p-7 sm:p-8"
              >
                <div className="flex items-start gap-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">
                    {index + 1}
                  </span>

                  <div>
                    <h2 className="text-2xl font-black text-neutral-950">
                      {section.title}
                    </h2>

                    <p className="mt-4 text-sm leading-8 text-neutral-600">
                      {section.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[28px] bg-neutral-950 p-8 text-center text-white">
            <h2 className="text-2xl font-black">
              Questions about this policy?
            </h2>

            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-black"
            >
              Contact NexaCore
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

export default function PlatformPages() {
  const path = window.location.pathname;

  if (path === "/academy") {
    return <AcademyPage />;
  }

  if (path === "/courses") {
    return (
      <ImageCardsPage
        bannerImage="/images/hero/banner1.png"
        eyebrow="Browse courses"
        title="Learn practical"
        highlight="technology skills."
        description="Explore tutor-led courses designed around practical assignments, projects and professional outcomes."
        sectionEyebrow="Course catalogue"
        sectionTitle="Choose the skill you want to build."
        sectionDescription="Search by course title, category, level or technology area."
        items={courses}
        type="courses"
      />
    );
  }

  if (path === "/tutors") {
    return (
      <ImageCardsPage
        bannerImage="/images/hero/banner2.png"
        eyebrow="Find tutors"
        title="Learn from"
        highlight="experienced professionals."
        description="Compare tutor specialties, experience and ratings before selecting the right learning guide."
        sectionEyebrow="Tutor directory"
        sectionTitle="Find a tutor for your learning goals."
        sectionDescription="Browse tutors across software development, data, design, cybersecurity and other fields."
        items={tutors}
        type="tutors"
      />
    );
  }

  if (path === "/certificates") {
    return <CertificatesPage />;
  }

  if (path === "/student-projects") {
    return (
      <ImageCardsPage
        bannerImage="/images/hero/banner4.png"
        eyebrow="Student projects"
        title="Practical learning."
        highlight="Visible professional proof."
        description="Explore approved projects completed by NexaCore students and academy graduates."
        sectionEyebrow="Project showcase"
        sectionTitle="See what NexaCore learners are building."
        sectionDescription="Approved projects can support portfolios, internships and professional opportunities."
        items={projects}
        type="student projects"
      />
    );
  }

  if (path === "/marketplace") {
    return <MarketplacePage />;
  }

  if (path === "/projects/create") {
    return <PostProjectPage />;
  }

  if (path === "/talent") {
    return (
      <ImageCardsPage
        bannerImage="/images/hero/banner3.png"
        eyebrow="Find talent"
        title="Discover trusted"
        highlight="technology professionals."
        description="Compare professional skills, ratings, completed projects and portfolio evidence."
        sectionEyebrow="Talent directory"
        sectionTitle="Find the right professional for your project."
        sectionDescription="Search approved talent across NexaCore service categories."
        items={talent}
        type="talent"
      />
    );
  }

  if (path === "/services") {
    return (
      <ImageCardsPage
        bannerImage="/images/hero/banner2.png"
        eyebrow="Browse services"
        title="Professional technology"
        highlight="services in one place."
        description="Explore the service categories clients can request through the NexaCore marketplace."
        sectionEyebrow="Service catalogue"
        sectionTitle="Choose the service your project requires."
        sectionDescription="Every request is connected to talent in the relevant professional category."
        items={services}
        type="services"
      />
    );
  }

  if (path === "/become-a-provider") {
    return <BecomeProviderPage />;
  }

  if (path === "/support") {
    return <SupportPage />;
  }

  if (path === "/help") {
    return <HelpCentrePage />;
  }

  if (path === "/trust") {
    return <TrustPage />;
  }

  if (path === "/privacy") {
    return <PolicyPage type="privacy" />;
  }

  if (path === "/terms") {
    return <PolicyPage type="terms" />;
  }

  return null;
}