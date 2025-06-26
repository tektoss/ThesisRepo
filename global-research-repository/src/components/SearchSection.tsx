'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { ResearchPaper } from '@/types';

interface SearchSectionProps {
  setFilteredPapers: (papers: ResearchPaper[] | ((prev: ResearchPaper[]) => ResearchPaper[])) => void;
  setShowAdvanced: (show: boolean) => void;
  showAdvanced: boolean;
  allPapers: ResearchPaper[];
}

const SearchSection = ({ setFilteredPapers, setShowAdvanced, showAdvanced, allPapers }: SearchSectionProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      // If query is empty, reset to show all papers
      setFilteredPapers(allPapers);
      return;
    }

    const { data } = await supabase
      .from('global_research_repository')
      .select('*')
      .or(`title.ilike.%${searchQuery}%,authors.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%`);
    
    setFilteredPapers(data || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // If user clears the input, reset the list
    if (query.trim() === '') {
      setFilteredPapers(allPapers);
    }
  };

  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <h1 className="h1 mb-4">
          {t('siteTitle')}
        </h1>
        <p className="p-lead max-w-2xl mx-auto">
          {t('siteSubtitle')}
        </p>
      </div>
      <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={t('searchPlaceholder')}
            className="form-input flex-grow px-4 py-3 text-lg"
          />
          <button type="submit" className="btn-primary px-8 py-3 text-lg font-semibold w-full sm:w-auto">
            {searchQuery.trim() === '' ? t('viewAll') : t('search')}
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn-secondary px-6 py-2 text-sm font-medium"
          >
            {showAdvanced ? t('hideAdvancedSearch') : t('showAdvancedSearch')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchSection;