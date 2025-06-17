'use client';

import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseClasses = 'rounded px-4 py-2 font-semibold focus:outline-none transition';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-400 text-gray-700 hover:bg-gray-100',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };

  return (
    <button
      disabled={isLoading || props.disabled}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        { 'w-full': fullWidth, 'opacity-50 cursor-not-allowed': isLoading },
        className
      )}
      {...props}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}

)