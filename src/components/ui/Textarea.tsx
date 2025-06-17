'use client';

import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium mb-1 text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          className={`block w-full border px-3 py-2 rounded ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
        ></textarea>
        {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
