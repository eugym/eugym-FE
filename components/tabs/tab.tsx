"use client";

import React from "react";
import clsx from "clsx";

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  activeTab,
  onChange,
}) => {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={clsx(
            "px-4 py-1 text-sm font-medium rounded-md transition-all",
            activeTab === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
