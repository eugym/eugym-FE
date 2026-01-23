"use client";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/NavBar";
import FitnessSection from "./homepage/fitnessSection";
import Hero from "./homepage/hero";
import PartnerSection from "./homepage/partnerSection";
import ProductSection from "./homepage/productSection";
import TrainersSection from "./homepage/trainers";
import WhyChooseSection from "./homepage/whyChooseUs";

const links = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "#about" },
  { name: "Services", href: "homepage/services" },
  { name: "Trainers", href: "#trainers" },
  // { name: "Events", href: "#events" },
  { name: "Store", href: "#store" },
  { name: "Insights", href: "homepage/insight" },
];

export default function Home() {
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
