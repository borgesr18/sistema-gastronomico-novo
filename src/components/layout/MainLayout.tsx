'use client';

import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
        <footer className="bg-white p-4 text-center text-sm text-gray-500 border-t">
          Sistema de Gestão Gastronômica &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
