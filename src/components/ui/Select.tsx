'use client';

import React, { SelectHTMLAttributes, ChangeEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name?: string;
  error?: string;
  options: Option[];
  required?: boolean;
}

export default function Select({ label, name, value, onChange, options, error, required, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
        className={`block w-full border px-3 py-2 rounded ${error ? 'border-red-500' : 'border-gray-300'`}`}
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

)