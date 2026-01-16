"use client";

const stats = [
  { label: "TOTAL PAID OUT", value: 590000 },
  { label: "PENDING PAYMENT", value: 20000 },
  { label: "PROCESSING", value: 19000 },
];

export default function Payments() {
  return (
    <div className="min-h-screen bg-gray-50 sm:p-5 p-2 w-full">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-3 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center border-r border-gray">
              <p className="text-2xl font-semibold text-gray-900 ">
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ******** Table Component here ******** */}
    </div>
  );
}
