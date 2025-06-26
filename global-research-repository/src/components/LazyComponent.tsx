'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyComponentProps {
  fallback?: React.ReactNode;
}

export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner size="lg" text="Loading component..." />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Example usage:
// const LazyUploadModal = createLazyComponent(() => import('./UploadModal'));
// const LazyAdvancedFilters = createLazyComponent(() => import('./AdvancedFilters')); 