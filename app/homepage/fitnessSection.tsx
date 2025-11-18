"use client";

import { motion } from "framer-motion";
import { Brain, CalendarDays, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import CreateAccountModal from "@/components/modals/createAccountModal";
import { useState } from "react";

const googleFormLink = "https://forms.gle/vpvqG2h8sun2mAp97";
const features = [
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "AI Fitness Trainer",
    description:
      "Personalized workout recommendations based on your goals and fitness level.",
  },
  {
    icon: <CalendarDays className="w-8 h-8 text-primary" />,
    title: "Daily Fitness Tips",
    description:
      "Expert nutrition advice, workout tips, and wellness content delivered daily.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Outdoor Events",
    description:
      "Join free community workouts, yoga sessions, and fitness challenges.",
  },
];

export default function FitnessSection() {
  const [open, setOpen] = useState(false);

  const registrationLink = (url: string) => {
    window.open(url, "_blank");
  };
  return (
    <>
      {" "}
      <section className="bg-primary text-white py-20 text-center bg-linear-to-t from-primary-lite to-primary ">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="bg-white rounded-full p-4 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/90 text-sm max-w-xs">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button
              variant="secondary"
              // onClick={() => setOpen(true)}
              onClick={() => registrationLink(googleFormLink)}
              className="bg-white text-primary hover:bg-green-100 text-base px-6 py-3 rounded-lg font-semibold flex justify-center justify-self-center"
            >
              Join For Free
            </Button>
          </motion.div>
        </div>
      </section>
      <CreateAccountModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
