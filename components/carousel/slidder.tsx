"use client";

import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import HeroImg from "@/public/images/heroImg.png";
import Gyming from "@/public/images/gyming.jpg";
import GymEquipments from "@/public/images/gymEquipments.jpg";

interface Slide {
  id: number;
  image: string | StaticImageData;
  /** Short caption plate. Not a headline — the page has one, in the hero. */
  caption: string;
}

/**
 * Hero imagery.
 *
 * Previously each slide carried its own <h1>, a repeat of the hero headline and
 * a second "Get Started" button: two competing calls to action and three <h1>
 * elements on one page. The photography now does its own job — it shows the
 * facilities — and carries only a small stamped caption plate.
 *
 * On mobile the hero overlays its headline and action across the foot of this
 * frame, so the caption plate, the foot gradient and the marker row all step
 * aside there rather than stacking into it.
 */
const slides: Slide[] = [
  { id: 1, image: HeroImg, caption: "Strength floor" },
  { id: 2, image: Gyming, caption: "Coached sessions" },
  { id: 3, image: GymEquipments, caption: "Equipped centres" },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      5000
    );
    return () => clearInterval(interval);
  }, [paused]);

  return (
    // svh, not vh: mobile browsers report vh against the *largest* viewport, so
    // 100vh sits taller than the screen while the URL bar is showing and pushes
    // the overlaid action below the fold — exactly the content this is meant to
    // put in front of the visitor.
    <section
      className="relative h-[calc(100svh-var(--topnav-h))] w-full overflow-hidden border-0 bg-(--plate-iron) md:border md:border-(--plate-rule) md:h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Eugym facilities"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: index === current ? 1 : 0 }}
          aria-hidden={index !== current}
        >
          <Image
            src={slide.image}
            alt={slide.caption}
            fill
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 62vw"
            className="object-cover"
          />
          {/* A gradient only at the foot, so the photograph stays a photograph
              rather than sitting under a flat scrim. Desktop only — on mobile
              the hero's own overlay supplies a taller one, and two stacked
              gradients turn the lower third to mud. */}
          <div className="absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-black/75 to-transparent md:block" />

          {/* Right-aligned, stacked over the markers: the left edge of the frame
              now dissolves into the page, so anything anchored there fades out
              with it. */}
          <p className="absolute bottom-14 right-5 hidden border border-white/25 bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm md:block">
            {slide.caption}
          </p>
        </div>
      ))}

      {/* Machined markers rather than dots — square, and wide when loaded.
          They ride at the top on mobile, where the foot of the frame belongs to
          the headline and its action. */}
      <div className="absolute right-5 top-5 flex gap-1.5 md:bottom-5 md:top-auto">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(index)}
            aria-label={`Show ${slide.caption}`}
            aria-current={index === current}
            className="h-[3px] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={{
              width: index === current ? 28 : 14,
              background:
                index === current ? "var(--plate-green)" : "rgb(255 255 255 / 0.5)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
