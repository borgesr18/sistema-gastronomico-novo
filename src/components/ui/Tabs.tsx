'use client';

import React from 'react';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTabId: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTabId, onChange }: TabsProps) {
  return (
    <div>
      <div className="border-b flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-t ${
              activeTabId === tab.id
                ? 'bg-white border border-b-0'
                : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
