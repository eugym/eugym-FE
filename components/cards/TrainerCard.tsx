"use client";

import { Star, Users } from "lucide-react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface TrainerCardProps {
  name: string;
  specialty?: string;
  clients?: number;
  experience?: number;
  location?: string;
  price?: string;
  rating?: number;
  image: string | StaticImport;
}

/**
 * Every optional field renders only when it has a value.
 *
 * They used to render unconditionally, so a trainer without `clients` still
 * got a people icon and the bare word "clients", plus an empty location row
 * holding its margin and an empty bold price line — three hollow rows per card.
 */
const TrainerCard: React.FC<TrainerCardProps> = ({
  name,
  specialty,
  clients,
  location,
  price,
  rating,
  image,
}) => {
  return (
    <div
      className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-(--plate-green) bg-(--plate-surface) text-left shadow-[var(--plate-shadow-green)] transition-[box-shadow,border-color,transform] duration-300 ease-[cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-1.5 hover:border-(--plate-green-deep) hover:shadow-[var(--plate-shadow-green-lift)]"
    >
      <div className="relative overflow-hidden">
        {/* The photograph is the material here, so it gets the move: a slow
            push-in on hover while the frame stays put. */}
        <Image
          src={image}
          alt={name}
          width={500}
          height={300}
          className="h-64 w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] group-hover:scale-[1.06]"
        />

        {rating != null && (
          <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-surface) px-2.5 py-1 text-sm font-semibold text-(--plate-iron) tabular-nums shadow-[var(--plate-shadow)]">
            <Star
              className="h-3.5 w-3.5 text-(--plate-yellow)"
              fill="currentColor"
              aria-hidden="true"
            />
            {rating}
          </span>
        )}
      </div>

      {/* A hairline does the separating, rather than a shadow seam. */}
      <div className="flex-1 border-t border-(--plate-rule) p-5">
        <h3 className="text-lg font-semibold text-(--plate-iron)">{name}</h3>

        {specialty && (
          <p className="mt-1 text-sm text-(--plate-steel)">{specialty}</p>
        )}

        {clients != null && (
          <div className="mt-3 flex items-center gap-2 text-sm text-(--plate-steel)">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span className="tabular-nums">{clients}</span> clients
          </div>
        )}

        {location && (
          <div className="mt-2 text-sm text-(--plate-steel)">{location}</div>
        )}

        {price && (
          <p className="mt-4 font-semibold text-(--plate-iron) tabular-nums">
            {price}
          </p>
        )}
      </div>

      {/* The green footer: the base the card sits on, echoing the plate edge
          in the hero. h-full + flex-1 above keep it pinned to the bottom, so
          cards of differing text length still line up. */}
      <div
        aria-hidden="true"
        className="h-2.5 w-full bg-(--plate-green) transition-colors duration-300 group-hover:bg-(--plate-green-deep)"
      />
    </div>
  );
};

export default TrainerCard;
