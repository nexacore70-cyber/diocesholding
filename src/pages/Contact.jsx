import { useState } from "react";
import PublicPageLayout, {
  ArrowIcon,
  SectionHeading,
} from "../components/PublicPageLayout";

const contactOptions = [
  {
    title: "General enquiries",
    description:
      "Questions about NexaCore, partnerships or the complete platform.",
    value: "hello@nexacore.com",
  },
  {
    title: "Platform support",
    description:
      "Help with accounts, courses, projects, payments or technical issues.",
    value: "support@nexacore.com",
  },
  {
    title: "Business and projects",
    description:
      "Discuss enterprise training, recruitment or technology project delivery.",
    value: "business@nexacore.com",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    accountType: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Contact form:", formData);

    alert("Your message has been prepared. Backend email delivery comes next.");
  };

  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner4.png"
      eyebrow="Contact NexaCore"
      title="Talk to the team"
      highlight="behind the platform."
      description="Contact us about courses, hiring, project delivery, partnerships, account support or any other NexaCore enquiry."
    >
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Send a message"
            title="How can the NexaCore team help?"
            description="Complete the form and select the type of enquiry so your message can be directed correctly."
          />

          <div className="mt-14 overflow-hidden rounded-[34px] border border-neutral-200 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.1)]">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              {/* IMAGE AND CONTACT INFORMATION */}
              <aside className="relative min-h-[650px] overflow-hidden bg-neutral-950">
                <img
                  src="/images/hero/banner2.png"
                  alt="Contact NexaCore"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/20" />

                <div className="relative z-10 flex min-h-[650px] flex-col justify-end p-7 text-white sm:p-10 lg:p-12">
                  <p className="text-xs font-black uppercase tracking-[0.23em] text-red-400">
                    Contact information
                  </p>

                  <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                    We are ready to understand what you need.
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-white/60">
                    Use the form for academy enquiries, project support,
                    partnerships, billing questions and platform assistance.
                  </p>

                  <div className="mt-9 space-y-4">
                    {contactOptions.map((option) => (
                      <div
                        key={option.title}
                        className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md"
                      >
                        <h3 className="font-black">{option.title}</h3>

                        <p className="mt-2 text-xs leading-5 text-white/50">
                          {option.description}
                        </p>

                        <a
                          href={`mailto:${option.value}`}
                          className="mt-3 inline-flex text-sm font-black text-red-400 hover:text-white"
                        >
                          {option.value}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* CONTACT FORM */}
              <div className="p-7 sm:p-10 lg:p-12">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
                  Contact form
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
                  Send your enquiry
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  Provide enough information for the NexaCore team to
                  understand and respond to your request.
                </p>

                <form onSubmit={handleSubmit} className="mt-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-black text-neutral-800"
                      >
                        Full name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                      />
                    </div>

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
                        required
                        className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="accountType"
                        className="mb-2 block text-sm font-black text-neutral-800"
                      >
                        Account or enquiry type
                      </label>

                      <select
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                        required
                        className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                      >
                        <option value="">Select enquiry type</option>
                        <option value="student">Student or academy</option>
                        <option value="tutor">Tutor application</option>
                        <option value="client">Client or project</option>
                        <option value="talent">Talent or provider</option>
                        <option value="payment">Payment or billing</option>
                        <option value="partnership">Partnership</option>
                        <option value="support">Technical support</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-sm font-black text-neutral-800"
                      >
                        Subject
                      </label>

                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is your message about?"
                        required
                        className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-black text-neutral-800"
                      >
                        Message
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Explain how the NexaCore team can help you..."
                        required
                        rows={7}
                        className="w-full resize-none rounded-2xl border border-neutral-300 bg-white p-4 text-sm leading-7 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-7 text-sm font-black text-white shadow-[0_15px_45px_rgba(220,38,38,0.25)] transition hover:-translate-y-0.5 hover:bg-neutral-950"
                  >
                    Send message
                    <ArrowIcon className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <p className="mt-7 text-center text-xs leading-6 text-neutral-400">
            Replace the example email addresses with your official NexaCore
            email addresses before publishing.
          </p>
        </div>
      </section>
    </PublicPageLayout>
  );
}