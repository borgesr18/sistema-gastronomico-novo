import Image from 'next/image';
import React from 'react';

const Logo: React.FC<{className?: string}> = ({ className = '' }) => (
  <span className={`inline-flex items-center space-x-2 ${className}`}>
    <Image src="/logo.svg" alt="CustoChef" width={24} height={24} />
    <span className="font-bold">CustoChef</span>
  </span>
);

export default Logo;
