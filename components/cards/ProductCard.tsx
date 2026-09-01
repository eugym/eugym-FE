"use client";

import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface ProductCardProps {
  name: string;
  price: string;
  image: string | StaticImport;
}

/**
 * Hover is CSS rather than framer-motion, matching the rest of the homepage —
 * this was the last component still animating through JavaScript.
 */
const ProductCard: React.FC<ProductCardProps> = ({ name, price, image }) => {
  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-[14px] border border-(--plate-rule) bg-(--plate-surface) text-center shadow-[var(--plate-shadow)] transition-[box-shadow,border-color,transform] duration-300 ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-1.5 hover:border-(--plate-green) hover:shadow-[var(--plate-shadow-lift)]">
      {/* The product sits on the ground colour so a cut-out photo reads as an
          object on a surface rather than floating on the card. */}
      <div className="relative h-56 w-full bg-(--plate-ground)">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="flex flex-1 flex-col border-t border-(--plate-rule) p-4">
        <h3 className="text-sm font-semibold text-(--plate-iron)">{name}</h3>
        <p className="mt-1 font-semibold text-(--plate-iron) tabular-nums">
          {price}
        </p>
        <button className="mt-3 text-sm font-medium text-(--plate-green-deep) underline-offset-4 transition-colors hover:underline">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
