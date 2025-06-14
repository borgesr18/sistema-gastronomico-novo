"use client";

import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-2 border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 font-medium border-b-2 focus:outline-none ${active === tab.id ? 'border-[var(--cor-acao)] text-[var(--cor-acao)]' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

