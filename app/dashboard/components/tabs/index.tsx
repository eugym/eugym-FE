import { useState, KeyboardEvent } from "react";

export interface ITab {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: ITab[];
  active: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (e.key === "ArrowRight") {
      const next = (index + 1) % tabs.length;
      if (!tabs[next].disabled) onChange(tabs[next].id);
    } else if (e.key === "ArrowLeft") {
      const prev = (index - 1 + tabs.length) % tabs.length;
      if (!tabs[prev].disabled) onChange(tabs[prev].id);
    }
  };

  return (
    <div
      role="tablist"
      className="flex bg-gray-100 rounded-md p-1 w-full max-w-md mx-auto mt-6"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          aria-disabled={tab.disabled}
          tabIndex={tab.disabled ? -1 : 0}
          disabled={tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition 
            ${tab.disabled ? "opacity-40 cursor-not-allowed" : ""}
            ${
              active === tab.id
                ? "bg-green-600 text-white flex items-center gap-1.5 justify-around"
                : "text-gray-600 hover:bg-gray-200 flex items-center gap-1.5 justify-around"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
