import Link from "next/link";

export default function PartnerSection() {
  return (
    <section className="bg-(--plate-ground) py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="display mb-6 text-3xl md:text-4xl lg:text-5xl">
          Partner with Nigeria&rsquo;s{" "}
          {/* Same accent as the hero, trainers and store headings, so the green
              reads as one system rather than four separate decisions. */}
          <span className="text-(--plate-green)">Largest Fitness</span> Access
          Network
        </h2>

        <p className="mx-auto mb-8 max-w-[62ch] text-sm leading-relaxed text-(--plate-steel) md:text-base">
          Eugym makes your hotel gym a destination for fitness travelers
          nationwide. As an affiliate partner, you&rsquo;ll host verified Eugym
          members whenever they travel—driving consistent usage of your
          facilities, enhancing guest satisfaction, and boosting your brand
          visibility.
        </p>

        {/* A real anchor rather than a button with a router.push: this is
            navigation, so it should middle-click, open in a new tab, and be
            followable. The classes mirror Button's primary variant — the
            component renders a <button>, which cannot legally nest in a link.

            Leading slash matters: "auth/company-register" would resolve
            relative to the current path and 404. */}
        <Link
          href="/auth/company-register"
          className="relative inline-flex min-w-[14rem] items-center justify-center gap-2 rounded-(--plate-radius) border border-(--plate-green-deep) bg-(--plate-green) px-6 py-2.5 text-sm font-semibold tracking-tight text-white transition-[background-color,color,border-color,transform] duration-150 ease-out select-none hover:bg-(--plate-green-deep) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--plate-iron) active:translate-y-px"
        >
          Become an Affiliate
        </Link>
      </div>
    </section>
  );
}
