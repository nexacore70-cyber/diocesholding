import AcademySection from "../components/home/AcademySection";
import CallToActionSection from "../components/home/CallToActionSection";
import HeroSection from "../components/home/HeroSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import ServicesSection from "../components/home/ServicesSection";

function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 text-center md:grid-cols-4">
          <div>
            <p className="text-2xl font-black text-[#D90404]">Academy</p>
            <p className="mt-1 text-sm text-gray-500">
              Practical technology learning
            </p>
          </div>

          <div>
            <p className="text-2xl font-black text-[#D90404]">Talent</p>
            <p className="mt-1 text-sm text-gray-500">
              Verified professionals
            </p>
          </div>

          <div>
            <p className="text-2xl font-black text-[#D90404]">Projects</p>
            <p className="mt-1 text-sm text-gray-500">
              Tracked service delivery
            </p>
          </div>

          <div>
            <p className="text-2xl font-black text-[#D90404]">Growth</p>
            <p className="mt-1 text-sm text-gray-500">
              Portfolio and opportunities
            </p>
          </div>
        </div>
      </section>

      <ServicesSection />
      <AcademySection />
      <HowItWorksSection />
      <CallToActionSection />
    </>
  );
}

export default HomePage;