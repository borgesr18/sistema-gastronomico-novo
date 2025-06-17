'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', showTagline = false }) => (
  <span className={`flex items-center space-x-2 ${className}`}>
    <Image src="/logo.svg" alt="GastroChef" width={24} height={24} />
    <span className="font-bold">GastroChef</span>
    {showTagline && (
      <span className="text-sm text-gray-500">Sistema Gastronômico</span>
    )}
  </span>
);

export default Logo;
