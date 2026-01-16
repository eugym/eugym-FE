"use client";

import React, { useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function OtpInput({
  length = 4,
  value,
  onChange,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    if (!/^[0-9]?$/.test(val)) return; // allow only single digit

    const newOtp = [...value];
    newOtp[index] = val;
    onChange(newOtp);

    // Move to next input automatically
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackSpace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex items-center gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          //   ref={(el) => (inputsRef.current[index] = el)}
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleBackSpace(e, index)}
          className="
            w-14 h-14 text-center text-2xl font-semibold 
            border rounded-xl outline-none
            border-gray-300 
            focus:border-green-500 focus:ring-2 focus:ring-green-200
          "
        />
      ))}
    </div>
  );
}
