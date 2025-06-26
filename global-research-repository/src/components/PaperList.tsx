'use client';

import { ResearchPaper, PaperListProps } from '../types';
import PaperItem from './PaperItem';
import { useTranslation } from 'react-i18next';

export default function PaperList({
  papers,
  currentPage,
  setCurrentPage,
  papersPerPage,
  sortBy,
  setSortBy,
}: PaperListProps) {
  const { t } = useTranslation();

  const totalPages = Math.ceil(papers.length / papersPerPage);
  const paginatedPapers = papers.slice(
    (currentPage - 1) * papersPerPage,
    currentPage * papersPerPage
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (papers.length === 0) {
    return (
      <div className="card text-center py-20">
        <div className="space-y-4">
          <h3 className="h3 text-text-primary">{t('noResultsFound')}</h3>
          <p className="p-body text-text-secondary">{t('tryDifferentKeywords')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <span className="text-sm text-text-secondary font-medium">
          {t('showingResults', {
            start: (currentPage - 1) * papersPerPage + 1,
            end: Math.min(currentPage * papersPerPage, papers.length),
            total: papers.length,
          })}
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-input w-auto px-4 py-2 text-sm"
        >
          <option value="newest">{t('sortByNewest')}</option>
          <option value="oldest">{t('sortByOldest')}</option>
        </select>
      </div>

      <div className="space-y-6">
        {paginatedPapers.map((paper) => (
          <PaperItem key={paper.id} paper={paper} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center pt-8">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === number
                    ? 'btn-primary'
                    : 'bg-surface text-text-secondary hover:bg-border border border-border'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}