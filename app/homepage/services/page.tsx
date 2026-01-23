"use client";
import Image, { StaticImageData } from "next/image";
import { Gauge, Dumbbell, Trophy, Volleyball } from "lucide-react";
import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import aerobics from "@/public/images/services/Aerobics.jpg";
import bodyBuilding from "@/public/images/services/Bodybuilding.jpg";
import boxing from "@/public/images/services/Boxing.jpg";
import crossfit from "@/public/images/services/CrossFit.jpg";
import gymtraing from "@/public/images/services/Outdoor Gym Training.jpg";
import weightlost from "@/public/images/services/Weight Loss Programs.jpg";
import yoga from "@/public/images/services/Yoga.jpg";

interface Service {
  title: string;
  description: string;
  image: string | StaticImageData;
  icon: React.ReactNode;
}

const links = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/" },
  { name: "Services", href: "/" },
  { name: "Trainers", href: "/" },
  { name: "Store", href: "/" },
  { name: "Insights", href: "/" },
];
const services: Service[] = [
  {
    title: "Aerobics",
    description:
      "High-energy workouts designed to improve cardiovascular health, boost stamina, and burn calories through rhythmic movement and music-driven routines.",
    image: aerobics,
    icon: <Dumbbell className="h-6 w-6 text-accent" />,
  },
  {
    title: "Weight Loss Programs",
    description:
      "Structured training and nutrition-focused programs tailored to help you burn fat, build healthy habits, and achieve sustainable weight loss results.",
    image: weightlost,
    icon: <Trophy className="h-6 w-6 text-accent" />,
  },
  {
    title: "Yoga",
    description:
      "A holistic practice that enhances flexibility, strength, balance, and mental clarity through guided poses, breathing techniques, and relaxation.",
    image: yoga,
    icon: <Gauge className="h-6 w-6 text-accent" />,
  },
  {
    title: "Boxing",
    description:
      "An intense, full-body workout combining boxing techniques and conditioning drills to improve strength, speed, endurance, and coordination.",
    image: boxing,
    icon: <Trophy className="h-6 w-6 text-accent" />,
  },
  {
    title: "Body building",
    description:
      "Strength-focused training aimed at building muscle mass, improving physique, and increasing overall power through progressive resistance workouts.",
    image: bodyBuilding,
    icon: <Dumbbell className="h-6 w-6 text-accent" />,
  },
  {
    title: "CrossFit",
    description:
      "High-intensity functional training that blends strength, cardio, and agility exercises to improve overall fitness and performance.",
    image: crossfit,
    icon: <Dumbbell className="h-6 w-6 text-accent" />,
  },
  {
    title: "Outdoor Gym Training",
    description:
      "Dynamic workouts conducted in open spaces, combining functional exercises and bodyweight training for a refreshing and motivating fitness experience.",
    image: gymtraing,
    icon: <Volleyball className="h-6 w-6 text-accent" />,
  },
];

export default function ServicesSection() {
  return (
    <>
      <Navbar navLinks={links} />
      <section className="bg-gray-50 py-6">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Our <span className="text-accent">Services</span>{" "}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              We offer a wide range of fitness programs designed to support all
              goals and fitness levels, including:
            </p>
          </div>

          {/* Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-56 w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />

                  {/* Icon badge */}
                  <div className="absolute -bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-md">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-8 pt-10 text-center">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
