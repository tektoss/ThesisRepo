// src/app/layout.tsx (SERVER COMPONENT)
import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/globals.css';
import { Providers } from '../components/Providers';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'Global Research Repository | inested.com',
  description: 'A modern, open-access repository for research from the Global South.',
  keywords: ['research', 'open access', 'Global South', 'academic papers', 'science'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-container">
            <Header />
            <main className="main-content">
              {children}
            </main>
            <footer className="app-footer">
              <p>&copy; {new Date().getFullYear()} inested. All rights reserved.</p>
              <p className="mt-2">
                <Link href="/privacy" className="btn-link">Privacy Policy</Link> |
                <Link href="/terms" className="ml-2 btn-link">Terms of Service</Link>
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
