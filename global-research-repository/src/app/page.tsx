'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { ResearchPaper } from '../types';
import { cache } from '../lib/cache';
import { useUI } from '../context/UIContext';
import SearchSection from '../components/SearchSection';
import AdvancedFilters from '../components/AdvancedFilters';
import PaperList from '../components/PaperList';
import UploadModal from '../components/UploadModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { t } = useTranslation();
  const { isModalOpen, closeModal, refreshKey } = useUI();
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<ResearchPaper[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const papersPerPage = 10;

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Attempting to fetch papers...');

        // NOTE: Caching is temporarily disabled for debugging purposes.
        
        const { data, error: fetchError } = await supabase
          .from('global_research_repository')
          .select('*')
          .order('submitted', { ascending: false });

        // This is the most important log. It will tell us what Supabase is returning.
        console.log('%cSupabase response:', 'color: lime; font-weight: bold;', { data, fetchError });

        if (fetchError) throw fetchError;

        const papersData = data || [];
        setPapers(papersData);
        setFilteredPapers(papersData);
      } catch (err) {
        console.error('An error occurred while fetching papers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch papers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapers();
  }, [refreshKey]);

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  const sortedPapers = [...filteredPapers].sort((a, b) => {
    if (sortBy === 'oldest') {
      return new Date(a.submitted).getTime() - new Date(b.submitted).getTime();
    }
    // Default to newest
    return new Date(b.submitted).getTime() - new Date(a.submitted).getTime();
  });

  if (error) {
    return (
      <div className="card text-center py-16">
        <div className="space-y-6">
          <h3 className="h3 text-red-500">
            {t('somethingWentWrong')}
          </h3>
          <p className="p-body text-text-secondary">{error}</p>
          <button onClick={handleRetry} className="btn-primary px-8 py-3 font-semibold">
            {t('reloadPage')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12">
        <SearchSection
          setFilteredPapers={setFilteredPapers}
          setShowAdvanced={setShowAdvanced}
          showAdvanced={showAdvanced}
          allPapers={papers}
        />

        {showAdvanced && (
          <AdvancedFilters setFilteredPapers={setFilteredPapers} />
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <LoadingSpinner size="lg" text={t('loading')} />
          </div>
        ) : (
          <PaperList
            papers={sortedPapers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            papersPerPage={papersPerPage}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        )}
      </div>

      {isModalOpen && <UploadModal onClose={closeModal} />}
    </>
  );
}