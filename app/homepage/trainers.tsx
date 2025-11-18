"use client";

import { motion } from "framer-motion";
import Trainer1 from "@/public/images/trainer1.png";
import Trainer2 from "@/public/images/trainer2.png";
import Trainer3 from "@/public/images/trainer3.png";

import TrainerCard from "@/components/cards/TrainerCard";

const trainers = [
  {
    name: "David Chen",
    specialty: "HIIT & Functional Training",
    clients: 95,
    experience: 7,
    location: "Ikoyi, Lagos",
    price: "₦18,000/session",
    rating: 4.8,
    image: Trainer1,
  },
  {
    name: "Michael Adams",
    specialty: "Strength & Conditioning",
    clients: 120,
    experience: 10,
    location: "Lekki, Lagos",
    price: "₦20,000/session",
    rating: 5.0,
    image: Trainer2,
  },
  {
    name: "Samuel Johnson",
    specialty: "CrossFit & Mobility",
    clients: 80,
    experience: 6,
    location: "Victoria Island, Lagos",
    price: "₦17,000/session",
    rating: 4.9,
    image: Trainer3,
  },
];

export default function TrainersSection() {
  return (
    <section className="py-20 bg-gray-50" id="trainers">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Meet Our Expert Trainers
        </motion.h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Work with certified professionals who will help you achieve your
          fitness goals safely and effectively.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8  ">
          {trainers.map((trainer, i) => (
            <TrainerCard key={i} {...trainer} />
          ))}
        </div>
      </div>
    </section>
  );
}
