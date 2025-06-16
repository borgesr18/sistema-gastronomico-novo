'use client';

import React from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center space-x-2">
      <span>{message}</span>
      <button onClick={onClose} className="text-white font-bold ml-2">
        ×
      </button>
    </div>
  );
}
