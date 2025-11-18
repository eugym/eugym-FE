import React from "react";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs text-gray-600  uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-3 py-2 rounded-md border border-gray-900 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-lite"
      />
    </div>
  );
};

export default InputField;
