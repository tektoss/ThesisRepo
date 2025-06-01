'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function PaperList({
  papers,
  currentPage,
  setCurrentPage,
  papersPerPage,
}: {
  papers: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  papersPerPage: number;
}) {
  const { t } = useTranslation();
  const startIndex = (currentPage - 1) * papersPerPage;
  const endIndex = startIndex + papersPerPage;
  const papersToShow = papers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(papers.length / papersPerPage);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t('recentSubmissions')}</h2>
          <p className="text-gray-600 text-sm">
            {t('showingPapers', {
              start: Math.min(startIndex + 1, papers.length),
              end: Math.min(endIndex, papers.length),
              total: papers.length,
            })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-700">{t('sortBy')}</label>
          <select
            onChange={(e) => {
              // Implement sorting logic
            }}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
            aria-label={t('sortBy')}
          >
            <option value="date-desc">{t('newestFirst')}</option>
            <option value="date-asc">{t('oldestFirst')}</option>
            <option value="title-asc">{t('titleAZ')}</option>
            <option value="relevance">{t('relevance')}</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {papersToShow.map((paper) => (
          <div key={paper.id} className="paper-item border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="subject-class px-2 py-1 rounded text-xs font-medium">{t(paper.subject)}</div>
              <div className="text-sm text-gray-500">{new Date(paper.submitted).toLocaleDateString()}</div>
            </div>
            <h3 className="paper-title text-lg text-blue-700 hover:text-blue-900 mb-2">
              <Link href={`/paper/${paper.id}`}>{paper.title}</Link>
            </h3>
            <div className="paper-authors text-gray-700 mb-3">{paper.authors.join(', ')}</div>
            <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">{paper.institution || t('notApplicable')}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{paper.country}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{t(paper.level)}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{t(paper.type)}</span>
            </div>
            <div className="paper-abstract text-gray-800 mb-4 leading-relaxed">{paper.abstract}</div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <Link href={`/api/global_research_repository/${paper.id}/download`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  [{t('pdf')}]
                </Link>
                <Link href={`/paper/${paper.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  [{t('view')}]
                </Link>
                <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  [{t('cite')}]
                </Link>
              </div>
              <div className="text-sm text-gray-500">
                {paper.downloads} {t('downloads')} • {paper.views} {t('views')}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2" aria-label={t('pagination')}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-arxivRed text-white' : 'bg-gray-200'}`}
              aria-current={currentPage === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}