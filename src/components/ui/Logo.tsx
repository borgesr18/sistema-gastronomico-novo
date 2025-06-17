import Image from 'next/image';
import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', showTagline = false }) => (
  <span`}>
    <Image src="/logo.svg" alt="GastroChef" width={24} height={24} />
    <span className="font-bold">GastroChef</span>
    {showTagline && (
      <span className="text-xs whitespace-nowrap">Sistema de Fichas Técnicas</span>
    )}
  </span>
);

export default Logo;
