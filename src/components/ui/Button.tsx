'use client';

import React from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  const baseClasses = 'rounded px-4 py-2 font-medium focus:outline-none transition';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-500 text-gray-700 hover:bg-gray-100',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], sizeClasses[size])}
      {...props}
    >
      {children}
    </button>
  );
}
