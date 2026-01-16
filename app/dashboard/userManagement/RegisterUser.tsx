import InputField from "@/components/inputs/input";
import SelectInput, { SelectOption } from "@/components/inputs/select";
import Button from "@/components/ui/Button";
import { useFormMutation } from "@/hooks/useFormMutation";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import toast from "react-hot-toast";

const roleOptions: SelectOption[] = [
  { label: "Regular", value: "REGULAR" },
  { label: "Standard", value: "STANDARD" },
  { label: "Premium", value: "PREMIUM" },
];

interface RegUserProps {
  onSuccess: () => void;
}

const initialFormState = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  role: "",
};

function RegisterUser({ onSuccess }: RegUserProps) {
  const [form, setForm] = useState(initialFormState);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  interface InviteUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }

  interface InviteUserResponse {
    success: boolean;
    message: string;
  }

  const inviteUserMutation = useFormMutation<
    InviteUserPayload,
    InviteUserResponse
  >({
    url: "invite/user",
    method: "POST",
    onSuccess: (data) => {
      toast.success(data.message || "Invitation sent successfully");
      setForm(initialFormState);

      onSuccess();
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error.message ||
          " failed";

        console.error("ERROR:", {
          status: error.response?.status,
          message,
          data: error.response?.data,
        });
      } else {
        console.error(
          "Unexpected error: check the detials and try again",
          error
        );
      }
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phoneNumber ||
      !form.role
    ) {
      toast.error("Please fill all fields");
      setForm(initialFormState);
      return;
    }
    await inviteUserMutation.mutateAsync(form);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <InputField
            label="First Name"
            placeholder="Martins"
            value={form?.firstName}
            onChange={(val) => handleChange("firstName", val)}
          />

          <InputField
            label="Last Name"
            placeholder="Ake"
            value={form?.lastName}
            onChange={(val) => handleChange("lastName", val)}
          />

          <InputField
            label="Phone number"
            placeholder="0903333333"
            type="number"
            value={form?.phoneNumber}
            onChange={(val) => handleChange("phoneNumber", val)}
          />
          <InputField
            label="Email"
            type="email"
            value={form?.email}
            onChange={(val) => handleChange("email", val)}
          />

          <SelectInput
            label="Role"
            name="role"
            value={form.role}
            options={roleOptions}
            onChange={handleChange}
          />
          <Button
            className="mt-4"
            type="submit"
            loading={inviteUserMutation.isPending}
          >
            {inviteUserMutation.isPending ? "Registering..." : "Register User"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default RegisterUser;
