"use client";

import { Upload, UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";

interface AvatarUploadProps {
  avatar?: string; // optional
}

export default function AvatarUpload({ avatar }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (avatar) {
      setPreview(avatar);
    }
  }, [avatar]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar preview */}
      {preview ? (
        <img
          src={preview}
          alt="Avatar"
          className="h-20 w-20 rounded-full object-cover"
          onError={() => setPreview(null)} // fallback if image fails
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <UserRoundPen size={32} />
        </div>
      )}

      {/* Upload button */}
      <label className="flex cursor-pointer items-center gap-2 rounded-md border border-amber-100 px-2 py-1 text-sm">
        <Upload size={16} />
        Profile image
        <input type="file" accept="image/*" hidden onChange={onChange} />
      </label>
    </div>
  );
}
