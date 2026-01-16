import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="h-full flex flex-row items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-lg text-center bg-white rounded-2xl shadow-md p-8 md:p-10">
        {/* Status Code */}
        <p className="text-sm font-medium text-red-600 mb-2">Unauthorized</p>

        {/* Main Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm md:text-base mb-8 leading-relaxed">
          You don’t have permission to view this page. This may be because you
          are not logged in or your account does not have the required access
          level.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition"
          >
            Go to Home
          </Link>

          <Link
            href="auth/login"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
