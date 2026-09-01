"use client";

import Button from "@/components/ui/Button";
import CreateAccountModal from "@/components/modals/createAccountModal";
import { useState } from "react";
import HeroSlider from "@/components/carousel/slidder";

/**
 * The tier ladder, as loaded plates.
 *
 * Colours are IWF competition plate colours (DESIGN.md § Color): the tier keeps
 * its colour everywhere it appears, and the name is always present, so the
 * colour never has to carry the meaning by itself.
 *
 * `height` encodes the load. Three identical ticks said "three options"; plates
 * that grow left to right say "each one carries more", which is the actual
 * commercial decision a visitor is here to make.
 */
const TIERS = [
  { name: "Regular", colour: "var(--plate-steel)", unlocks: "Free content", height: 18 },
  { name: "Standard", colour: "var(--plate-blue)", unlocks: "One centre", height: 25 },
  { name: "Premium", colour: "var(--plate-red)", unlocks: "Every centre", height: 32 },
];

/**
 * The headline, shared by both layouts.
 *
 * Rendered twice — once in the desktop text column, once over the photograph on
 * mobile — but each copy is `display:none` at the other breakpoint, so exactly
 * one <h1> is ever in the accessibility tree.
 */
function Headline() {
  return (
    <>
      Access Nigeria&rsquo;s
      <br />{" "}
      {/* --plate-green, the same fill as the primary button, so the headline
          accent and the action read as one brand green. It clears 7.5:1 on the
          dark gradient, so it holds over the photograph too. */}
      <span className="text-(--plate-green)">Largest Fitness</span>
      <br /> Network
    </>
  );
}

export default function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* min-h rather than h: the hero claims the viewport below the nav, but a
          short laptop screen grows the section instead of clipping the headline. */}
      <section className="grid grid-cols-1 items-center gap-8 md:min-h-[calc(100svh-var(--topnav-h))] md:grid-cols-2 md:items-stretch md:gap-0">
        {/* Desktop text column. Hidden on mobile, where the headline and action
            move onto the photograph instead — so the content is relocated, not
            dropped. */}
        <div className="relative z-10 mx-auto hidden flex-col justify-center px-5 py-12 md:flex md:px-6 md:py-16">
          <div className="space-y-6">
            <h1 className="display text-[2.5rem] leading-[1.18] sm:text-5xl lg:text-6xl">
              <Headline />
            </h1>

            <p className="max-w-[46ch] text-base leading-relaxed text-(--plate-steel) sm:text-lg">
              Join 50,000+ Nigerians who have unlimited access to premium gyms,
              expert personal trainers, and exclusive hotel fitness facilities
              nationwide.
            </p>

            {/* The bar. Tiers read left to right as increasing load. */}
            <ul className="flex flex-wrap items-end gap-x-6 gap-y-3 border-y border-(--plate-rule) py-4">
              {TIERS.map((tier) => (
                <li key={tier.name} className="flex items-end gap-2.5">
                  <span
                    aria-hidden="true"
                    className="w-[5px] shrink-0"
                    style={{ background: tier.colour, height: tier.height }}
                  />
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-(--plate-iron)">
                      {tier.name}
                    </span>
                    <span className="block text-xs text-(--plate-steel)">
                      {tier.unlocks}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            {/* One action. The carousel's competing "Get Started" is gone. */}
            <div className="pt-1">
              <Button
                onClick={() => setOpen(true)}
                variant="primary"
                className="w-full sm:w-auto sm:min-w-[16rem]"
              >
                Join For Free
              </Button>
              <p className="mt-2.5 text-xs text-(--plate-steel)">
                No card required to start on the free tier.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-bleed relative flex h-full w-full justify-center md:-ml-[8%] md:w-[108%] md:justify-end">
          <HeroSlider />

          {/* Mobile foot: headline and action laid over the photograph.
              pointer-events-none on the panel so the carousel underneath stays
              swipeable, re-enabled on the controls themselves. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 md:hidden">
            {/* Three stops rather than two. A straight from-black/to-transparent
                ramp bands visibly across a photograph at this height; easing the
                midpoint keeps it smooth while still reaching full opacity behind
                the text. */}
            <div
              className="absolute inset-x-0 bottom-0 h-[26rem]"
              style={{
                background:
                  "linear-gradient(to top, rgb(0 0 0 / 0.92) 0%, rgb(0 0 0 / 0.72) 28%, rgb(0 0 0 / 0.32) 62%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            <div className="relative px-5 pb-9 pt-16">
              <h1
                className="text-[2.25rem] font-bold leading-[1.12] tracking-[-0.025em] text-white [text-wrap:balance] [text-shadow:0_2px_14px_rgb(0_0_0/0.55)]"
                style={{ fontStretch: "112%" }}
              >
                <Headline />
              </h1>

              <Button
                onClick={() => setOpen(true)}
                variant="primary"
                className="pointer-events-auto mt-6 w-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>
      <CreateAccountModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
