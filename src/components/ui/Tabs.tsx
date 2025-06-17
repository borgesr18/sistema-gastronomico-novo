'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  active?: string;
  onChange?: (id: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, active: controlledActive, onChange, className = '' }) => {
  const isControlled = controlledActive !== undefined && onChange !== undefined;
  const [internalActive, setInternalActive] = useState(tabs[0]?.id);

  const activeTabId = isControlled ? controlledActive : internalActive;

  const setActiveTab = (id: string) => {
    if (isControlled) {
      onChange(id);
    } else {
      setInternalActive(id);
    }
  };

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div>
      {/* Header das abas */}
      <div className="border-b flex space-x-2 mb-4">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium border-b-2 ${
                isActive
                  ? 'border-[var(--cor-acao)] text-[var(--cor-acao)]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              `}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo da aba ativa */}
      <div>{activeTab.content}</div>
    </div>
  );
};

export default Tabs;

)