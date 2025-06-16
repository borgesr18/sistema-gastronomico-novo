'use client';

import React, { ChangeEvent } from 'react';

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
}: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="block w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  );
}
