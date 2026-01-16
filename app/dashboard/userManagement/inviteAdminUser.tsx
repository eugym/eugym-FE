import InputField from "@/components/inputs/input";
import SelectInput, { SelectOption } from "@/components/inputs/select";
import Button from "@/components/ui/Button";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useFormMutation } from "@/hooks/useFormMutation";

const roleOptions: SelectOption[] = [
  { label: "Trainer", value: "trainer" },
  { label: "Affiliate", value: "affiliate" },
  { label: "Cooperate Admin", value: "corporate-admin" },
];

interface InviteUserProps {
  onSuccess: () => void;
}
function inviteAdminUser({ onSuccess }: InviteUserProps) {
  const [addUserForm, setAddUserForm] = useState({
    role: "",
    email: "",
  });

  const handleChange = (name: string, value: string) => {
    setAddUserForm((prev) => ({ ...prev, [name]: value }));
  };

  interface InviteUserPayload {
    email: string;
    role: string;
  }

  interface InviteUserResponse {
    success: boolean;
    message: string;
  }

  const inviteUserMutation = useFormMutation<
    InviteUserPayload,
    InviteUserResponse
  >({
    url: `invite/${addUserForm.role}`,

    method: "POST",
    onSuccess: (data) => {
      toast.success(data.message || "Invitation sent successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
      setAddUserForm({ email: "", role: "" });
      onSuccess();
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addUserForm.email || !addUserForm.role) {
      toast.error("Please fill all fields");
      return;
    }

    await inviteUserMutation.mutateAsync({
      email: addUserForm.email,
      role: addUserForm.role,
    });
  };

  //   if (inviteUserMutation.status === "error") {
  //     onSuccess();
  //   }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex flex-wrap gap-5">
          <SelectInput
            label="User type"
            name="role"
            value={addUserForm.role}
            options={roleOptions}
            placeholder="user role"
            onChange={handleChange}
          />
          <InputField
            label="Email"
            type="email"
            value={addUserForm?.email}
            onChange={(val) => handleChange("email", val)}
          />
        </div>
        <Button type="submit" className=" my-5 w-1/2 flex justify-self-center">
          {inviteUserMutation.isPending ? "Sending..." : "Send Invitation"}
        </Button>
      </form>
    </div>
  );
}

export default inviteAdminUser;
