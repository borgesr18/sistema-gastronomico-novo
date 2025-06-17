'use client';

import React, { ReactNode, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useRouter, usePathname } from 'next/navigation';
import { ModalProvider } from '@/contexts/ModalContext';
import { AuthProvider, useAuth } from '@/lib/useAuth';

interface MainLayoutProps {
  children: ReactNode;
}

const LayoutContent: React.FC<MainLayoutProps> = ({ children }) => {
  const { usuario, carregando } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!carregando) {
      if (!usuario && pathname !== '/login') {
        router.push('/login');
      }
      if (usuario && pathname === '/login') {
        router.push('/');
      }
    }
  }, [usuario, carregando, pathname, router]);

  if (carregando) {
    return <div>Carregando...</div>;
  }

  const hideLayout =
    pathname === '/login' ||
    pathname.includes('/imprimir');

  return (
    <ModalProvider>
      <div className="flex h-screen" style={{ backgroundColor: 'var(--cor-fundo)' }}>
        {!hideLayout && <Sidebar />}
        <div className="flex flex-col flex-1 overflow-hidden">
          {!hideLayout && <Header />}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          {!hideLayout && (
            <footer
              className="p-4 text-center text-sm border-t"
              style={{
                backgroundColor: 'white',
                color: 'var(--cor-texto-secundario)',
                borderColor: 'var(--cor-borda)',
              }}
            >
              CustoChef &copy; {new Date().getFullYear()}
            </footer>
          )}
        </div>
      </div>
    </ModalProvider>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
};

export default MainLayout;
