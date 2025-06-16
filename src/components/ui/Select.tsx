'use client';

import React, { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export default function Select({ label, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="font-medium">{label}</label>
      <select {...props} className="border p-2 rounded">
        {children}
      </select>
    </div>
  );
}
