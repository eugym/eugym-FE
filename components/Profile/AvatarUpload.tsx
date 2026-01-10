"use client";

import { useState } from "react";

export default function AvatarUpload({ avatar }: { avatar: string }) {
  const [preview, setPreview] = useState(avatar);

  const onChange = (e: any) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex items-center gap-4">
      <img
        src={preview}
        className="h-20 w-20 rounded-full object-cover"
        alt="Avatar"
      />

      <label className="cursor-pointer rounded-lg border px-3 py-2 text-sm">
        Upload Picture
        <input type="file" hidden onChange={onChange} />
      </label>
    </div>
  );
}
