import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--cor-texto-principal)' }}>
            {label}
          </label>
        )}
        <textarea ref={ref} ${className} />
          rows={4}
          {...props}
        />
        {error && <p className="mt-1 text-sm" style={{ color: 'var(--cor-erro)' }}>{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm" style={{ color: 'var(--cor-texto-secundario)' }}>{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

)