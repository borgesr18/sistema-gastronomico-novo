'use client';

import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="font-medium">{label}</label>
      <input {...props} className="border p-2 rounded" />
    </div>
  );
}
