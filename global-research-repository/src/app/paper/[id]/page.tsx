import { supabase } from '../../../lib/supabase';

export default async function PaperPage({ params }: { params: { id: string } }) {
  const { data: paper, error } = await supabase
    .from('publications')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !paper) {
    return <div>Paper not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="paper-title text-2xl text-gray-900 mb-4">{paper.title}</h1>
      <p className="paper-authors text-gray-700 mb-3">{paper.authors.join(', ')}</p>
      <p className="text-sm text-gray-600 mb-3">
        {paper.institution} | {paper.country} | {paper.level} | {paper.type}
      </p>
      <p className="paper-abstract text-gray-800 mb-4">{paper.abstract}</p>
      <div className="flex space-x-4">
        <a href={`/api/publications/${paper.id}/download`} className="text-blue-600 hover:text-blue-800">
          Download PDF
        </a>
        <a href="#" className="text-blue-600 hover:text-blue-800">
          Cite
        </a>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        {paper.downloads} downloads • {paper.views} views
      </p>
    </div>
  );
}