import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { ModalProvider } from '@/components/ui/Modal';  // <-- Corrigido aqui

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
            {children}
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
