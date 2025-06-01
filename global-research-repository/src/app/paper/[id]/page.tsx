import { supabase } from '../../../lib/supabase';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default async function PaperPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation();
  const { data: paper, error } = await supabase
    .from('global_research_repository')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !paper) {
    return <div>{t('researchNotFound')}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="paper-title text-2xl text-gray-900 mb-4">{paper.title}</h1>
      <p className="paper-authors text-gray-700 mb-3">{paper.authors.join(', ')}</p>
      <p className="text-sm text-gray-600 mb-3">
        {paper.institution || t('notApplicable')} | {paper.country} | {paper.level} | {t(paper.type)}
      </p>
      <p className="paper-abstract text-gray-800 mb-4">{paper.abstract}</p>
      <div className="flex space-x-4">
        <Link href={`/api/global_research_repository/${paper.id}/download`} className="text-blue-600 hover:text-blue-800">
          {t('downloadPDF')}
        </Link>
        <Link href="#" className="text-blue-600 hover:text-blue-800">
          {t('cite')}
        </Link>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        {paper.downloads} {t('downloads')} • {paper.views} {t('views')}
      </p>
    </div>
  );
}