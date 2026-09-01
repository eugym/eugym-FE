"use client";
import Image from "next/image";
import { Leaf, BadgeCheck, Clock } from "lucide-react";
import imageIcon1 from "@/public/asset/location.png";
import imageIcon2 from "@/public/asset/dumBell.png";
import imageIcon3 from "@/public/asset/lightFire.png";

const featuresTop = [
  {
    icon: imageIcon1,
    title: "Nationwide Access",
    description:
      "200+ premium gyms across Nigeria - from Lagos to Abuja, Kano to Port Harcourt...",
  },
  {
    icon: imageIcon2,
    title: "Personal Training",
    description:
      "Certified trainers for 1-on-1 sessions, custom workout plans, and nutrition guidance.",
  },
  {
    icon: imageIcon3,
    title: "Our Affiliates",
    description:
      "Exclusive access to luxury hotel and fitness centers nation wide.",
  },
];

const featuresBottom = [
  {
    icon: <Leaf className="h-5 w-5 text-white" />,
    title: "Instant Access",
    description: "QR code entry to any partner gym",
  },
  {
    icon: <BadgeCheck className="h-5 w-5 text-white" />,
    title: "Premium Quality",
    description: "Only verified, high-standard facilities",
  },
  {
    icon: <Clock className="h-5 w-5 text-white" />,
    title: "24/7 Support",
    description: "Always available customer service",
  },
];

export default function WhyChooseSection() {
  return (
    <section
      className="bg-(--plate-surface) py-20 text-center"
      id="about"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading. Was initial/animate, which fired on page load while this
            section sat well below the fold — the move had already finished by
            the time anyone scrolled to it. */}
        <h2
          className="display mb-4 text-3xl md:text-4xl lg:text-5xl"
        >
          Why Choose{" "}
          {/* Was text-primary, which emits no CSS: tailwind.config.ts defines it
              but Tailwind v4 never loads that file without an @config directive,
              so the highlight simply never rendered. */}
          <span className="text-(--plate-green)">Eugym fitness?</span>
        </h2>

        <p className="mx-auto mb-12 max-w-[46ch] text-(--plate-steel)">
          Nigeria&apos;s most comprehensive fitness ecosystem designed for your
          active lifestyle
        </p>

        {/* Top grid */}
        <div
          className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {featuresTop.map((feature) => (
            <div
              key={feature.title}
              /* Hairline rule and a machined 2px edge, per DESIGN.md — the
                 previous rounded-xl + shadow-xl belonged to a different world,
                 and its hover shrank the shadow rather than growing it. */
              className="group flex min-h-[13rem] flex-col items-start overflow-hidden rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-surface) p-6 text-left shadow-[var(--plate-shadow)] transition-[box-shadow,transform,border-color] duration-300 ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-1 hover:border-(--plate-iron) hover:shadow-[var(--plate-shadow-lift)]"
            >
              <span
                aria-hidden="true"
                className="knurl -mx-6 -mt-6 mb-6 h-[3px] w-[calc(100%+3rem)] origin-left"
              />
              <span className="mb-4 flex h-12 w-12 items-center justify-center border border-(--plate-rule) bg-(--plate-ground) transition-colors duration-200 group-hover:border-(--plate-iron)">
                <Image
                  src={feature.icon}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </span>
              <h3 className="mb-2 text-lg font-semibold text-(--plate-iron)">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-(--plate-steel)">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {featuresBottom.map((feature) => (
            <div
              key={feature.title}
              className="group flex items-center gap-4 rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-surface) p-5 shadow-[var(--plate-shadow)] transition-[box-shadow,transform,border-color] duration-300 ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-0.5 hover:border-(--plate-iron) hover:shadow-[var(--plate-shadow-lift)]"
            >
              {/* Was bg-primary — another class the dead config never emitted,
                  leaving white icons on a pale green field, effectively
                  invisible. --plate-green is a fill colour, which is exactly
                  what this is. */}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--plate-radius) bg-(--plate-green) transition-colors duration-200 group-hover:bg-(--plate-green-deep)">
                {feature.icon}
              </span>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-(--plate-iron) md:text-base">
                  {feature.title}
                </h4>
                <p className="text-sm text-(--plate-steel)">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
