import InputField from "@/components/inputs/input";
import Button from "@/components/ui/Button";
import { useFormMutation } from "@/hooks/useFormMutation";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface RegUserProps {
  onSuccess: () => void;
}
function RegisterUser({ onSuccess }: RegUserProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

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
    url: "invite/regular",
    method: "POST",
    onSuccess: (data) => {
      toast.success(data.message || "Invitation sent successfully");
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
        console.error("Unexpected error:", error);
      }
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phoneNumber) {
      toast.error("Please fill all fields");
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
          <Button className="mt-4" type="submit">
            {inviteUserMutation.isPending ? "Registering..." : "Register User"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default RegisterUser;
