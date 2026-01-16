"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import successIcon from "@/public/icons/success.png";
import FailureIcon from "@/public/icons/failure.png";
import Button from "@/components/ui/Button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing verification token.");
      setLoading(false);
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}auth/verify-email`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error?.message);
        throw new Error(data?.message || "Email verification failed");
      }

      setSuccess("Your email has been verified successfully 🎉");
      toast.success("Your email has been verified successfully 🎉");
      // Optional redirect after success
      setTimeout(() => {
        router.push("auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-6 text-center">
        {loading && (
          <>
            <h1 className="text-xl font-semibold mb-2">
              Verifying your email...
            </h1>
            <p className="text-sm text-gray-500">
              Please wait while we confirm your email address
            </p>
          </>
        )}

        {!loading && error && (
          <>
            <Image
              src={FailureIcon}
              alt="failure"
              className="w-16 flex justify-self-center"
            />
            <h1 className="text-xl font-semibold text-red-600 mb-2">
              Verification Failed
            </h1>
            <p className="text-sm text-gray-500">{error}</p>{" "}
            <Button
              className="flex justify-self-center mt-5"
              variant="secondary"
              onClick={() => router.push("/")}
            >
              {" "}
              Try Again
            </Button>
          </>
        )}

        {!loading && success && (
          <>
            <Image
              src={successIcon}
              alt="success"
              className="w-16 flex justify-self-center"
            />
            <h1 className="text-xl font-semibold text-green-600 mb-2">
              Email Verified
            </h1>
            <p className="text-sm text-gray-500">{success}</p>
            <p className="mt-3 text-xs text-gray-400">
              Redirecting to login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
