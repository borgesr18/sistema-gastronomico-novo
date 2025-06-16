'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const baseClass = 'px-4 py-2 rounded font-medium';
  const variantClass =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-300 text-gray-800 hover:bg-gray-400';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button {...props} className={`${baseClass} ${variantClass} ${widthClass}`}>
      {children}
    </button>
  );
}
