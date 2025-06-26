'use client';

import Link from 'next/link';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  const { openModal } = useUI();

  return (
    <header className="app-header">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-bold text-text-primary transition-colors hover:text-accent-green">
            inested
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                {t('browse')}
              </a>
              <a href="#" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                {t('about')}
              </a>
              <a href="#" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                {t('help')}
              </a>
            </nav>
            <button onClick={openModal} className="btn-primary px-6 py-3 text-sm font-semibold">
              {t('submitResearch')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 