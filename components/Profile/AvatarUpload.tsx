"use client";

import { Camera } from "lucide-react";
import { useEffect, useState } from "react";

interface AvatarUploadProps {
  avatar?: string;
  initials?: string;
}

export default function AvatarUpload({ avatar, initials = "U" }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (avatar) setPreview(avatar);
  }, [avatar]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="cursor-pointer group">
        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-md">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={() => setPreview(null)}
            />
          ) : (
            <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold select-none">
              {initials}
            </div>
          )}
          {/* Camera overlay */}
          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={22} className="text-white" />
          </div>
        </div>
        <input type="file" accept="image/*" hidden onChange={onChange} />
      </label>
      <p className="text-xs text-gray-400">Click to change photo</p>
    </div>
  );
}
