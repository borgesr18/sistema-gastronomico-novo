'use client';

import React, { ReactNode, useEffect } from 'react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

const SlideOver: React.FC<SlideOverProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  } as const;

  return (
    <div}> 
      <div`}
        onClick={onClose}
      ></div>
      <div ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b" style={{ borderColor: 'var(--cor-borda)' }}>
          <h3 className="text-lg font-medium" style={{ color: 'var(--cor-texto-principal)' }}>{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-full">{children}</div>
      </div>
    </div>
  );
};

export default SlideOver;
