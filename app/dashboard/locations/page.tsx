"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MapPin, Search, Building2 } from "lucide-react";
import { useBackendQuery } from "@/hooks/useBackend";
import { PageHeader, DataState, EmptyState } from "../components/shared/PageShell";

// GET /centres  (§3.4 "Gym Locations Page", FR-P7)
interface Centre {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  capacity?: number;
  isAffiliate?: boolean;
  images?: string[];
  amenities?: string[];
}

function CentreCard({ centre }: { centre: Centre }) {
  const image = centre.images?.[0];

  return (
    <article className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-36 w-full bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <Building2 size={28} aria-hidden="true" />
          </div>
        )}
        {centre.isAffiliate && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 shadow-sm">
            Affiliate
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate font-semibold text-gray-900">{centre.name}</h3>

        <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-600">
          <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" aria-hidden="true" />
          <span className="min-w-0">
            {centre.address}, {centre.city}, {centre.state}
          </span>
        </p>

        {centre.amenities && centre.amenities.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {centre.amenities.map((a) => (
              <li
                key={a}
                className="rounded-full bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700"
              >
                {a}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function GymLocations() {
  const { data, isLoading, error, refetch } = useBackendQuery<Centre[]>("centres");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const centres = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return centres;

    return centres.filter((c) =>
      [c.name, c.city, c.state, c.address].some((f) =>
        (f ?? "").toLowerCase().includes(q)
      )
    );
  }, [data, query]);

  const affiliates = (data ?? []).filter((c) => c.isAffiliate).length;

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Gym Locations"
        subtitle={
          data?.length
            ? `${data.length} location${data.length === 1 ? "" : "s"} nationwide · ${affiliates} affiliate`
            : "Every Eugym centre and affiliate gym you can train at"
        }
      />

      {(data?.length ?? 0) > 0 && (
        <div className="relative mb-5 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city or state"
            aria-label="Search locations"
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-lite"
          />
        </div>
      )}

      <DataState
        isLoading={isLoading}
        error={error}
        data={filtered}
        onRetry={refetch}
        empty={
          query ? (
            <EmptyState
              icon={<Search size={26} />}
              title={`No locations match “${query}”`}
              description="Try a different city, state or centre name."
            />
          ) : (
            <EmptyState
              icon={<MapPin size={26} />}
              title="No locations listed yet"
              description="Eugym centres and affiliate gyms will appear here once they're added."
            />
          )
        }
      >
        {(rows) => (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((c) => (
              <CentreCard key={c.id} centre={c} />
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}
