'use client';

import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input {...props}
        className={`block w-full border px-3 py-2 rounded ${error ? 'border-red-500' : 'border-gray-300'} />
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
