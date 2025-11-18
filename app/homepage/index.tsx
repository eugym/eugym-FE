import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/NavBar";
import Button from "@/components/ui/Button";
import FitnessSection from "./fitnessSection";
import Hero from "./hero";
import PartnerSection from "./partnerSection";
import ProductSection from "./productSection";
import TrainersSection from "./trainers";
import WhyChooseSection from "./whyChooseUs";

export default function HomePage() {
  const links = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#services" },
    { name: "Trainers", href: "#trainers" },
    { name: "Events", href: "#events" },
    { name: "Store", href: "#store" },
    { name: "Insights", href: "#insights" },
  ];

  return (
    <>
      <div className=" flex flex-col">
        <Navbar navLinks={links} />
        <Hero />
        <WhyChooseSection />
        <FitnessSection />
        <TrainersSection />
        <ProductSection />
        <PartnerSection />
        <Footer />
      </div>
    </>
  );
}
