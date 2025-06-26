'use client';

import { useState } from 'react';
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

  const applyFilters = () => {
    setFilteredPapers([]); // Trigger filtering in parent (page.tsx)
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
    <div className="card p-8">
      <div className="mb-6">
        <h3 className="h3 mb-2">{t('advancedSearchFilters')}</h3>
        <p className="p-body text-text-secondary">Refine your search with specific criteria</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label htmlFor="country" className="form-label">{t('countryRegion')}</label>
          <select
            id="country"
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            className="form-input"
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
        
        <div className="space-y-2">
          <label htmlFor="subject" className="form-label">{t('subjectClassification')}</label>
          <select
            id="subject"
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            className="form-input"
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
        
        <div className="space-y-2">
          <label htmlFor="level" className="form-label">{t('educationLevel')}</label>
          <select
            id="level"
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="form-input"
            aria-label={t('educationLevel')}
          >
            <option value="">{t('allLevels')}</option>
            <option value="high-school">{t('highSchool')}</option>
            <option value="undergraduate">{t('undergraduate')}</option>
            <option value="community">{t('communityBased')}</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="type" className="form-label">{t('publicationType')}</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="form-input"
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
        
        <div className="space-y-2">
          <label htmlFor="date" className="form-label">{t('dateRange')}</label>
          <select
            id="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="form-input"
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
        
        <div className="space-y-2">
          <label htmlFor="institution" className="form-label">{t('institution')}</label>
          <input
            id="institution"
            type="text"
            name="institution"
            value={filters.institution}
            onChange={handleFilterChange}
            placeholder={t('institutionPlaceholder')}
            className="form-input"
            aria-label={t('institution')}
          />
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <button onClick={applyFilters} className="btn-primary px-8 py-3 font-semibold">
          {t('applyFilters')}
        </button>
        <button onClick={clearFilters} className="btn-secondary px-8 py-3 font-semibold">
          {t('clearAll')}
        </button>
      </div>
    </div>
  );
}