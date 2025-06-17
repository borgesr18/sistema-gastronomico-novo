'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div>
      {/* Header das abas */}
      <div className="border-b flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`px-3 py-2 text-sm font-medium ${
              activeTabId === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba ativa */}
      <div>{activeTab?.content}</div>
    </div>
  );
}
