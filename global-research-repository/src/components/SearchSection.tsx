'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

export default function SearchSection({
  setFilteredPapers,
  setShowAdvanced,
  showAdvanced,
}: {
  setFilteredPapers: (papers: any[]) => void;
  setShowAdvanced: (show: boolean) => void;
  showAdvanced: boolean;
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase
        .from('global_research_repository')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,authors.ilike.%${searchTerm}%,abstract.ilike.%${searchTerm}%`)
        .order('submitted', { ascending: false });
      if (error) throw error;
      setFilteredPapers(data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setFilteredPapers([]);
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{t('searchTheRepository')}</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label={t('searchPlaceholder')}
          />
          <button
            onClick={handleSearch}
            className="arxiv-button px-6 py-2 rounded-md font-medium"
            aria-label={t('search')}
          >
            {t('search')}
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-800 text-sm"
            aria-label={t('toggleAdvancedSearch')}
          >
            {showAdvanced ? t('hideAdvancedSearch') : t('showAdvancedSearch')}
          </button>
        </div>
      </div>
    </div>
  );
}