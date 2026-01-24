"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroImg from "@/public/images/heroImg.png";
import Gyming from "@/public/images/gyming.jpg";
import GymEquipments from "@/public/images/gymEquipments.jpg";

interface Slide {
  id: number;
  image: string | StaticImageData;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: HeroImg,
    title: "Eugym Fitness",
    subtitle: "Access Nigeria's Largest Fitness Network",
  },
  {
    id: 2,
    image: Gyming,
    title: "Gain Confidence",
    subtitle: "Your Physical Body Commands alot of confidence",
  },
  {
    id: 3,
    image: GymEquipments,
    title: "Solid Equipments",
    subtitle: "Gyming Technologies that moves your body forward",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 flex items-center ">
            <div className="mx-auto max-w-4xl px-6 text-center text-white x">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8">{slide.subtitle}</p>
              <a href="auth/login">
                <button
                  //   onClick={() => console.log("testing...")}
                  className="rounded-lg bg-white px-6 py-3 font-semibold text-accent hover:bg-gray-200 transition border border-accent"
                >
                  Get Started
                </button>
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/60"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/60"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 w-3 rounded-full ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
