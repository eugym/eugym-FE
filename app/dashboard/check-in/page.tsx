"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ListChecks, CheckCircle2, UserCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import InputField from "@/components/inputs/input";
import { useBackendMutation, errorMessage } from "@/hooks/useBackend";
import { PageHeader } from "../components/shared/PageShell";

// POST /visits/check-in  (§3.8, FR-AP1 — log a premium member's visit)
interface CheckInResult {
  user?: { firstName?: string; lastName?: string; email?: string };
  visitedAt?: string;
}

export default function CheckIn() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [recent, setRecent] = useState<
    { name: string; email: string; at: string }[]
  >([]);

  const checkIn = useBackendMutation<{ email: string }, CheckInResult>(
    "visits/check-in",
    "POST",
    // The usage log reads the same data, so refresh it after a successful visit.
    ["affiliate/visits", "affiliate/overview"]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFieldError("Enter the member's email address");
      return;
    }
    setFieldError("");

    try {
      const result = await checkIn.mutateAsync({ email: value });

      const name =
        `${result?.user?.firstName ?? ""} ${result?.user?.lastName ?? ""}`.trim() ||
        value;

      toast.success(`${name} checked in`);

      // Keep the last few on screen: an attendant checking in a queue needs to
      // see that the previous scan registered without leaving the page.
      setRecent((prev) =>
        [
          {
            name,
            email: value,
            at: new Date().toLocaleTimeString("en-NG", {
              hour: "numeric",
              minute: "2-digit",
            }),
          },
          ...prev,
        ].slice(0, 8)
      );
      setEmail("");
    } catch (err) {
      const message = errorMessage(err);
      setFieldError(message);
      toast.error(message);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Check In"
        subtitle="Log a premium member's visit to your facility"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-4">
            <InputField
              label="Member Email"
              type="email"
              placeholder="member@example.com"
              autoComplete="off"
              value={email}
              error={fieldError}
              onChange={(v) => {
                setEmail(v);
                if (fieldError) setFieldError("");
              }}
            />

            <Button type="submit" className="w-full" loading={checkIn.isPending}>
              Log Visit
            </Button>

            <p className="text-xs leading-relaxed text-gray-500">
              Only members on an active Premium plan can be checked in. Each visit
              is counted toward your monthly settlement.
            </p>
          </form>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <UserCheck size={16} className="text-gray-400" aria-hidden="true" />
            This session
          </h2>

          {recent.length === 0 ? (
            <div className="py-8 text-center">
              <ListChecks
                size={24}
                className="mx-auto mb-2 text-gray-300"
                aria-hidden="true"
              />
              <p className="text-sm text-gray-500">
                Visits you log will be listed here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent.map((r, i) => (
                <li
                  key={`${r.email}-${i}`}
                  className="flex items-center gap-3 py-2.5"
                >
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {r.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">{r.email}</p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-gray-500">
                    {r.at}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
