'use client';

import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Card({ title, children, footer }: CardProps) {
  return (
    <div className="bg-white shadow rounded-md overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--cor-borda)' }}>
          <h3 className="text-lg font-medium" style={{ color: 'var(--cor-texto-principal)' }}>{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 border-t">{footer}</div>}
    </div>
  );
}
