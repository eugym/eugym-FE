"use client";

import { Brain, CalendarDays, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import CreateAccountModal from "@/components/modals/createAccountModal";
import { useState } from "react";

// Sign-up previously went to an external Google Form
// (https://forms.gle/vpvqG2h8sun2mAp97). It now opens the in-app account
// modal; the form helper was left behind unused and is gone.

const features = [
  {
    icon: <Brain className="h-9 w-9" />,
    title: "AI Fitness Trainer",
    description:
      "Personalized workout recommendations based on your goals and fitness level.",
  },
  {
    icon: <CalendarDays className="h-9 w-9" />,
    title: "Daily Fitness Tips",
    description:
      "Expert nutrition advice, workout tips, and wellness content delivered daily.",
  },
  {
    icon: <Users className="h-9 w-9" />,
    title: "Outdoor Events",
    description:
      "Join free community workouts, yoga sessions, and fitness challenges.",
  },
];

export default function FitnessSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* --plate-green: the same fill as the primary button.
          This previously asked for bg-primary, which emits no CSS at all —
          Tailwind v4 never loads tailwind.config.ts without an @config
          directive — so the section painted nothing and fell through to
          --plate-ground, leaving white text and white icons on a near-white
          field at roughly 1.04:1. */}
      <section className="bg-(--plate-green) py-20 text-center text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center">
                {/* A machined tile, not a pill — DESIGN.md reserves pills for
                    status chips. The icon takes the band's own colour, so the
                    tile reads as punched out of the surface. */}
                <span className="strike-in mb-5 flex h-20 w-20 items-center justify-center rounded-(--plate-radius) bg-white text-(--plate-green-deep) shadow-[var(--plate-shadow)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:scale-110">
                  {feature.icon}
                </span>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-white">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* The secondary variant is already a white panel with iron type,
              which is exactly right on a green field. */}
          <Button
            variant="secondary"
            onClick={() => setOpen(true)}
            className="min-w-[16rem]"
          >
            Join For Free
          </Button>
        </div>
      </section>
      <CreateAccountModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
