
import React from 'react';

interface SlideOverProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function SlideOver({ onClose, children }: SlideOverProps) {
  return (
    <div>
      <div onClick={onClose}></div>
      {children}
    </div>
  );
}
