import { useState } from "react";
import PublicPageLayout, {
  ArrowIcon,
  CheckIcon,
  SectionHeading,
} from "../components/PublicPageLayout";

const pricingPlans = [
  {
    name: "Starter",
    description:
      "For learners and new users beginning their NexaCore journey.",
    monthly: "₦0",
    yearly: "₦0",
    period: "Free access",
    button: "Create free account",
    href: "/signup",
    recommended: false,
    features: [
      "Create a NexaCore profile",
      "Browse courses and services",
      "Access public opportunities",
      "Basic messages and notifications",
      "Portfolio and certificate viewing",
    ],
  },
  {
    name: "Professional",
    description:
      "For tutors and talent who need stronger professional visibility.",
    monthly: "₦10,000",
    yearly: "₦96,000",
    period: "per account",
    button: "Choose Professional",
    href: "/signup?role=talent",
    recommended: true,
    features: [
      "Everything in Starter",
      "Professional profile visibility",
      "More project proposal access",
      "Priority category matching",
      "Portfolio and rating tools",
      "Earnings and project analytics",
    ],
  },
  {
    name: "Business",
    description:
      "For organisations, teams and clients managing regular projects.",
    monthly: "Custom",
    yearly: "Custom",
    period: "Contact NexaCore",
    button: "Contact sales",
    href: "/contact",
    recommended: false,
    features: [
      "Multiple client and team users",
      "Priority talent recommendations",
      "Managed project support",
      "Business reporting and invoices",
      "Custom onboarding assistance",
      "Enterprise service options",
    ],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  return (
    <PublicPageLayout
      bannerImage="/images/hero/banner3.png"
      eyebrow="NexaCore pricing"
      title="Plans designed for"
      highlight="learning and professional growth."
      description="Choose the level of access that fits your current goals. Course fees and project payments remain separate from subscription plans."
    >
      <section className="bg-[#f5f5f5] py-20 dark:bg-neutral-950 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Choose your plan"
            title="Start freely and upgrade as you grow."
            description="The amounts below are easy to edit inside the pricingPlans array when your final business prices are approved."
          />

          <div className="mt-9 flex justify-center">
            <div className="flex rounded-full border border-neutral-200 bg-white p-1.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-6 py-3 text-sm font-black transition ${
                  billing === "monthly"
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                    : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`rounded-full px-6 py-3 text-sm font-black transition ${
                  billing === "yearly"
                    ? "bg-red-600 text-white"
                    : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-[32px] border p-7 sm:p-9 ${
                  plan.recommended
                    ? "border-red-600 bg-neutral-950 text-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
                    : "border-neutral-200 bg-white text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute right-6 top-6 rounded-full bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                    Recommended
                  </span>
                )}

                <p
                  className={`text-sm font-black uppercase tracking-[0.18em] ${
                    plan.recommended ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {plan.name}
                </p>

                <p
                  className={`mt-4 min-h-[72px] text-sm leading-7 ${
                    plan.recommended
                      ? "text-white/55"
                      : "text-neutral-500 dark:text-neutral-300"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mt-8">
                  <p className="text-4xl font-black tracking-tight sm:text-5xl">
                    {billing === "monthly" ? plan.monthly : plan.yearly}
                  </p>

                  <p
                    className={`mt-2 text-sm ${
                      plan.recommended
                        ? "text-white/45"
                        : "text-neutral-400"
                    }`}
                  >
                    {plan.period}
                  </p>
                </div>

                <div
                  className={`my-8 h-px ${
                    plan.recommended
                      ? "bg-white/10"
                      : "bg-neutral-200 dark:bg-neutral-800"
                  }`}
                />

                <div className="flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                        <CheckIcon />
                      </span>

                      <p
                        className={`text-sm leading-6 ${
                          plan.recommended
                            ? "text-white/70"
                            : "text-neutral-600 dark:text-neutral-300"
                        }`}
                      >
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                <a
                  href={plan.href}
                  className={`group mt-9 inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-black transition ${
                    plan.recommended
                      ? "bg-red-600 text-white hover:bg-white hover:text-red-600"
                      : "bg-neutral-950 text-white hover:bg-red-600 dark:bg-white dark:text-neutral-950 dark:hover:bg-red-600 dark:hover:text-white"
                  }`}
                >
                  {plan.button}
                  <ArrowIcon className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-neutral-950 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <SectionHeading
            eyebrow="Pricing information"
            title="Clear fees and protected transactions."
            description="Course enrollment, project payments, platform commissions and professional subscriptions will be displayed clearly before a user confirms payment."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              [
                "Course payments",
                "Students see the complete course fee before enrollment and class access.",
              ],
              [
                "Project payments",
                "Clients review project or milestone costs before funding professional work.",
              ],
              [
                "Platform fees",
                "Any commission or subscription charge is displayed before confirmation.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-[26px] border border-neutral-200 bg-[#f7f7f7] p-7 text-center dark:border-neutral-800 dark:bg-neutral-900"
              >
                <h3 className="text-xl font-black text-neutral-950 dark:text-white">
                  {title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-500 dark:text-neutral-300">
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
