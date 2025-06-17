'use client';

import React, { ChangeEvent, ReactNode } from 'react';

export interface SelectProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options?: { value: string; label: string }[];
  children?: ReactNode;
  error?: string;
  className?: string;
  name?: string;
  required?: boolean;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  children,
  error,
  className = '',
  name,
  required,
}: SelectProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`border rounded px-3 py-2 w-full ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
