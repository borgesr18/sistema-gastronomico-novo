'use client';

import React from 'react';

export interface Tab {
  id: string;
  title: string;
  content?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div>
      {/* Header das abas */}
      <div className="border-b flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-t ${
              activeTab === tab.id
                ? 'bg-white border-l border-t border-r font-semibold text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="p-4 border rounded-b bg-white">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
