"use client";

import { useState } from "react";
import { useUpdateProfile } from "@/hooks/useProfile";
import InputField from "../inputs/input";
import Button from "../ui/Button";

export default function ProfileForm({ profile }: { profile: any }) {
  const [form, setForm] = useState(profile);

  // console.log("profile info", form);

  const { mutateAsync, isPending } = useUpdateProfile();

  const handleChange = (name: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="First Name"
          placeholder=""
          type="text"
          value={form?.firstName}
          onChange={(val) => handleChange("firstName", val)}
        />

        <InputField
          label="Email Address"
          placeholder="example@gmail.com"
          type="email"
          value={form?.lastName}
          onChange={(val) => handleChange("lastName", val)}
        />
        {/* <Input
          label="First Name"
          name="firstName"
          value={form?.firstName}
          onChange={handleChange}
        />
        <Input
          label="Last Name"
          name="lastName"
          value={form?.lastName}
          onChange={handleChange}
        /> */}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Email Address"
          placeholder="example@gmail.com"
          type="email"
          value={form?.email}
          onChange={(val) => handleChange("email", val)}
        />

        <InputField
          label="Phone number"
          placeholder=""
          type="text"
          value={form?.phoneNumber}
          onChange={(val) => handleChange("number", val)}
        />
        {/* <Input
          label="Email"
          name="email"
          value={form?.email}
          onChange={handleChange}
        /> */}

        {/* <Input
          label="Phone number"
          name="number"
          value={form?.phone_number}
          onChange={handleChange}
        /> */}
      </div>

      <Textarea
        label="Bio"
        name="bio"
        value={form?.bio}
        onChange={handleChange}
      />

      <div className="flex justify-end">
        <Button
          // disabled={isPending}
          disabled
          className="rounded-lg bg-gray-900 px-6 py-2 text-sm text-white disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

/* Reusable Inputs */
const Input = ({ label, ...props }: any) => (
  <div>
    <label className="text-sm font-medium text-gray-700 ">{label}</label>
    <input
      {...props}
      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm "
    />
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      rows={4}
      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-lite"
    />
  </div>
);
