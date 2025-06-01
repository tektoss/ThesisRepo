'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

export default function AdvancedFilters({ setFilteredPapers }: { setFilteredPapers: (papers: any[]) => void }) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    country: '',
    subject: '',
    level: '',
    type: '',
    date: '',
    institution: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async () => {
    try {
      let query = supabase.from('global_research_repository').select('*');
      if (filters.country) query = query.eq('country', filters.country);
      if (filters.subject) query = query.eq('subject', filters.subject);
      if (filters.level) query = query.eq('level', filters.level);
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.institution) query = query.ilike('institution', `%${filters.institution}%`);
      if (filters.date) {
        if (filters.date === 'older') {
          query = query.lt('submitted', '2020-01-01');
        } else {
          query = query.gte('submitted', `${filters.date}-01-01`).lte('submitted', `${filters.date}-12-31`);
        }
      }
      query = query.order('submitted', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      setFilteredPapers(data || []);
    } catch (error) {
      console.error('Filter failed:', error);
      setFilteredPapers([]);
    }
  };

  const clearFilters = () => {
    setFilters({
      country: '',
      subject: '',
      level: '',
      type: '',
      date: '',
      institution: '',
    });
    applyFilters();
  };

  return (
    <div className="filter-section rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{t('advancedSearchFilters')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">{t('countryRegion')}</label>
          <select
            id="country"
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            aria-label={t('countryRegion')}
          >
            <option value="">{t('allCountries')}</option>
            <option value="Nigeria">{t('nigeria')}</option>
            <option value="Kenya">{t('kenya')}</option>
            <option value="Ghana">{t('ghana')}</option>
            <option value="South Africa">{t('southAfrica')}</option>
            <option value="Egypt">{t('egypt')}</option>
            <option value="India">{t('india')}</option>
            <option value="Bangladesh">{t('bangladesh')}</option>
            <option value="Pakistan">{t('pakistan')}</option>
            <option value="Indonesia">{t('indonesia')}</option>
            <option value="Philippines">{t('philippines')}</option>
            <option value="Brazil">{t('brazil')}</option>
            <option value="Mexico">{t('mexico')}</option>
            <option value="Colombia">{t('colombia')}</option>
            <option value="Peru">{t('peru')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">{t('subjectClassification')}</label>
          <select
            id="subject"
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            aria-label={t('subjectClassification')}
          >
            <option value="">{t('allSubjects')}</option>
            <option value="agri">{t('agriculture')}</option>
            <option value="cs">{t('computerScience')}</option>
            <option value="econ">{t('economics')}</option>
            <option value="edu">{t('education')}</option>
            <option value="env">{t('environmentalScience')}</option>
            <option value="med">{t('medicineHealth')}</option>
            <option value="math">{t('mathematics')}</option>
            <option value="physics">{t('physics')}</option>
            <option value="soc">{t('socialSciences')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">{t('educationLevel')}</label>
          <select
            id="level"
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            aria-label={t('educationLevel')}
          >
            <option value="">{t('allLevels')}</option>
            <option value="high-school">{t('highSchool')}</option>
            <option value="undergraduate">{t('undergraduate')}</option>
            <option value="community">{t('communityBased')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">{t('publicationType')}</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            aria-label={t('publicationType')}
          >
            <option value="">{t('allTypes')}</option>
            <option value="article">{t('journalArticle')}</option>
            <option value="conference_paper">{t('conferencePaper')}</option>
            <option value="book">{t('book')}</option>
            <option value="book_chapter">{t('bookChapter')}</option>
            <option value="thesis">{t('thesis')}</option>
            <option value="dissertation">{t('dissertation')}</option>
            <option value="technical_report">{t('technicalReport')}</option>
            <option value="working_paper">{t('workingPaper')}</option>
            <option value="preprint">{t('preprint')}</option>
            <option value="review_article">{t('reviewArticle')}</option>
            <option value="case_study">{t('caseStudy')}</option>
            <option value="letter">{t('letter')}</option>
            <option value="patent">{t('patent')}</option>
            <option value="presentation">{t('presentation')}</option>
            <option value="poster">{t('poster')}</option>
            <option value="dataset">{t('dataset')}</option>
            <option value="software">{t('software')}</option>
            <option value="community_report">{t('communityReport')}</option>
            <option value="other">{t('other')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">{t('dateRange')}</label>
          <select
            id="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            aria-label={t('dateRange')}
          >
            <option value="">{t('allDates')}</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="older">{t('before2020')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">{t('institution')}</label>
          <input
            id="institution"
            type="text"
            name="institution"
            value={filters.institution}
            onChange={handleFilterChange}
            placeholder={t('institutionPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            aria-label={t('institution')}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={applyFilters} className="arxiv-button px-6 py-2 rounded-md font-medium">
          {t('applyFilters')}
        </button>
        <button onClick={clearFilters} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          {t('clearAll')}
        </button>
      </div>
    </div>
  );
}