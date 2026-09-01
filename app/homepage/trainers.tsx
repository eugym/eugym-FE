"use client";

import Trainer1 from "@/public/images/trainer1.png";
import Trainer2 from "@/public/images/trainer2.png";
import Trainer3 from "@/public/images/trainer3.png";
import TrainerCard from "@/components/cards/TrainerCard";

const trainers = [
  {
    name: "David Chen",
    specialty: "HIIT & Functional Training",
    experience: 7,
    // clients: 95,
    // location: "Ikoyi, Lagos",
    // price: "₦18,000/session",
    rating: 4.8,
    image: Trainer1,
  },
  {
    name: "Michael Adams",
    specialty: "Strength & Conditioning",
    experience: 10,
    // clients: 120,
    // location: "Lekki, Lagos",
    // price: "₦20,000/session",
    rating: 5.0,
    image: Trainer2,
  },
  {
    name: "Samuel Johnson",
    specialty: "CrossFit & Mobility",
    experience: 6,
    // clients: 80,
    // location: "Victoria Island, Lagos",
    // price: "₦17,000/session",
    rating: 4.9,
    image: Trainer3,
  },
];

export default function TrainersSection() {
  return (
    <section className="bg-(--plate-ground) py-20" id="trainers">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2
          className="display mb-4 text-3xl md:text-4xl lg:text-5xl"
        >
          {/* Was text-accent, which emits no CSS: Tailwind v4 never loads
              tailwind.config.ts without an @config directive, so the word just
              rendered in the heading colour. */}
          Meet Our Expert{" "}
          <span className="text-(--plate-green)">Trainers</span>
        </h2>

        <p className="mx-auto mb-12 max-w-[60ch] text-(--plate-steel)">
          Work with certified professionals who will help you achieve your
          fitness goals safely and effectively.
        </p>

        <div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {trainers.map((trainer, i) => (
            <TrainerCard key={i} {...trainer} />
          ))}
        </div>
      </div>
    </section>
  );
}
