'use client';

import Link from 'next/link';

export default function PaperList({ papers, currentPage, setCurrentPage, papersPerPage }: { papers: any[]; currentPage: number; setCurrentPage: (page: number) => void; papersPerPage: number }) {
  const startIndex = (currentPage - 1) * papersPerPage;
  const endIndex = startIndex + papersPerPage;
  const papersToShow = papers.slice(startIndex, endIndex);

  const totalPages = Math.ceil(papers.length / papersPerPage);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
          <p className="text-gray-600 text-sm">
            Showing {Math.min(startIndex + 1, papers.length)}-{Math.min(endIndex, papers.length)} of {papers.length} papers
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-700">Sort by:</label>
          <select
            onChange={(e) => {
              // Implement sorting logic
            }}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="relevance">Relevance</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {papersToShow.map((paper) => (
          <div key={paper.id} className="paper-item border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="subject-class px-2 py-1 rounded text-xs font-medium">{paper.subject}</div>
              <div className="text-sm text-gray-500">{new Date(paper.submitted).toLocaleDateString()}</div>
            </div>
            <h3 className="paper-title text-lg text-blue-700 hover:text-blue-900 mb-2">
              <Link href={`/paper/${paper.id}`}>{paper.title}</Link>
            </h3>
            <div className="paper-authors text-gray-700 mb-3">{paper.authors.join(', ')}</div>
            <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">{paper.institution}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{paper.country}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{paper.level}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{paper.type}</span>
            </div>
            <div className="paper-abstract text-gray-800 mb-4 leading-relaxed">{paper.abstract}</div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <a href={`/api/publications/${paper.id}/download`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  [PDF]
                </a>
                <Link href={`/paper/${paper.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  [View]
                </Link>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  [Cite]
                </a>
              </div>
              <div className="text-sm text-gray-500">
                {paper.downloads} downloads • {paper.views} views
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-arxivRed text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}