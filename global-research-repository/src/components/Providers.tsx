'use client';

import { UIProvider } from '@/context/UIContext';
import I18nProvider from '@/components/I18nProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <I18nProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </I18nProvider>
    </UIProvider>
  );
} 