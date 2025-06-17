'use client';

import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'success';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
   fullWidth={true}?: boolean;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
   fullWidth={true} = false,
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseClass =
    'rounded px-4 py-2 font-medium transition duration-150 focus:outline-none focus:ring';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-400 text-black hover:bg-gray-100',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };

  const finalClass = clsx(
    baseClass,
    sizeClasses[size],
    variantClasses[variant],
     fullWidth={true} && 'w-full',
    isLoading && 'opacity-50 cursor-not-allowed',
    className
  );

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={finalClass}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}

