'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import SearchSection from '../components/SearchSection';
import AdvancedFilters from '../components/AdvancedFilters';
import PaperList from '../components/PaperList';
import UploadModal from '../components/UploadModal';

export default function Home() {
  const { t } = useTranslation();
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const papersPerPage = 10;

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const { data, error } = await supabase
          .from('global_research_repository')
          .select('*')
          .order('submitted', { ascending: false });
        if (error) throw error;
        setPapers(data || []);
        setFilteredPapers(data || []);
      } catch (error) {
        console.error('Fetch papers failed:', error);
      }
    };
    fetchPapers();
  }, []);

  return (
    <div>
      <header className="arxiv-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="arxiv-logo text-2xl">{t('siteTitle')}</div>
              <div className="text-sm text-gray-600">{t('siteSubtitle')}</div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowModal(true)} className="arxiv-button px-4 py-2 rounded text-sm font-medium">
                {t('submitResearch')}
              </button>
              <Link href="/help" className="text-blue-600 hover:text-blue-800 text-sm">
                {t('help')}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <nav className="arxiv-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-12 items-center text-sm">
            <Link href="/browse" className="text-blue-600 hover:text-blue-800 font-medium">{t('browse')}</Link>
            <Link href="/search" className="text-blue-600 hover:text-blue-800 font-medium">{t('search')}</Link>
            <Link href="/stats" className="text-blue-600 hover:text-blue-800 font-medium">{t('statistics')}</Link>
            <Link href="/about" className="text-blue-600 hover:text-blue-800 font-medium">{t('about')}</Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">{t('contact')}</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchSection setFilteredPapers={setFilteredPapers} setShowAdvanced={setShowAdvanced} showAdvanced={showAdvanced} />
        {showAdvanced && <AdvancedFilters setFilteredPapers={setFilteredPapers} />}
        <PaperList papers={filteredPapers} currentPage={currentPage} setCurrentPage={setCurrentPage} papersPerPage={papersPerPage} />
      </div>
      {showModal && <UploadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}