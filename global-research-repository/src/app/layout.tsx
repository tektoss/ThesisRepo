// src/app/layout.tsx (SERVER COMPONENT)
import type { Metadata } from 'next';
import '../styles/globals.css';
import I18nProvider from '../components/I18nProvider';

export const metadata: Metadata = {
  title: 'Global South Research Repository | inested.com',
  description: 'Research Repository for Developing Nations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
