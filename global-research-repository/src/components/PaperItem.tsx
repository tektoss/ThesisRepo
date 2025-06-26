'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ResearchPaper } from '@/types';
import { useTranslation } from 'react-i18next';

interface PaperItemProps {
  paper: ResearchPaper;
}

const PaperItem = ({ paper }: PaperItemProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Fallback for missing date
  const displayDate = paper.submitted ? new Date(paper.submitted).toLocaleDateString() : 'N/A';

  return (
    <article className="card card-hover p-6">
      <div className="space-y-4">
        <div>
          <h3 className="h3 mb-3">
            <Link href={`/paper/${paper.id}`} className="text-link hover:text-accent-green transition-colors">
              {paper.title}
            </Link>
          </h3>
          <p className="text-highlight font-medium mb-4">
            {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
          </p>
        </div>
        
        <div className="p-body">
          <p className={`${isExpanded ? '' : 'line-clamp-3'} leading-relaxed`}>
            {paper.abstract}
          </p>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="btn-link text-sm font-medium hover:text-accent-green transition-colors"
        >
          {isExpanded ? t('showLess') : t('showMore')}
        </button>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
          <span className="meta-tag">{paper.subject}</span>
          <span className="meta-tag">{paper.level}</span>
          {paper.institution && <span className="meta-tag">{paper.institution}</span>}
          <span className="text-sm text-text-secondary font-medium ml-auto">{displayDate}</span>
        </div>
      </div>
    </article>
  );
};

export default PaperItem; 