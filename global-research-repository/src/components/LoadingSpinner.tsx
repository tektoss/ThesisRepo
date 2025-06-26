'use client';

import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const { t } = useTranslation();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const displayText = text || t('loading');

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]}`} />
      {displayText && (
        <p className="mt-2 text-sm text-gray-600">{displayText}</p>
      )}
    </div>
  );
}

export function LoadingOverlay({ 
  isLoading, 
  children 
}: { 
  isLoading: boolean; 
  children: React.ReactNode 
}) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
} 