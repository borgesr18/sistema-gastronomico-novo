'use client';

import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };

  const finalClassName = clsx(
    baseStyles,
    variantStyles[variant],
    fullWidth && 'w-full',
    className
  );

  return (
    <button className={finalClassName} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}
