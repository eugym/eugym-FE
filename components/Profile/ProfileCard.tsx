"use client";
import { useProfile } from "@/hooks/useProfile";
import AvatarUpload from "./AvatarUpload";
import ProfileForm from "./ProfileForm";
import SectionLoader from "../Loaders/sectionLoader";

export default function ProfileCard() {
  const { data, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <SectionLoader height="200px" />
      </div>
    );
  }

  return (
    <section className="rounded-xl bg-white sm:p-6 p-3 shadow-sm">
      <div className="mb-8 flex flex-col gap-6 rounded-xl border border-green-300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Profile Meta */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-12 w-full">
          {/* Status */}
          <div>
            <AvatarUpload avatar={""} />
          </div>

          <div className=" flex flex-row gap-6 justify-between">
            <div className="flex flex-col">
              {/* stutus */}
              <h2 className="text-sm font-medium text-gray-500">Status</h2>

              <div className="mt-1 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600"></span>
                </span>

                <span className="text-sm font-semibold text-green-700 capitalize">
                  {data?.data?.profile?.status?.toLowerCase()}
                </span>
              </div>
            </div>
            {/* Role */}
            <div className=" flex flex-col ">
              <h2 className="text-sm font-medium text-gray-500 ">Account</h2>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-semibold capitalize">
                  {data?.data?.profile?.role?.replace("_", " ").toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Section Description */}
        <div className="text-left sm:text-right max-w-xl sm:p-3 p-0 sm:border-l sm:border-accent rounded-md">
          <h2 className="text-lg font-semibold text-gray-900">
            Profile Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your personal and account details. Update your personal and
            account details.
          </p>
        </div>
      </div>

      {/* <ProfileForm /> */}
      <ProfileForm profile={data?.data?.profile} />
    </section>
  );
}
