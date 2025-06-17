import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { ModalProvider } from '@/contexts/ModalContext';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Sistema Gastronômico',
  description: 'Sistema de gestão gastronômica',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ModalProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
