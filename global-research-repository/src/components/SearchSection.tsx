'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SearchSection({ setFilteredPapers, setShowAdvanced }: { setFilteredPapers: (papers: any[]) => void; setShowAdvanced: (show: boolean) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,authors.ilike.%${searchTerm}%,abstract.ilike.%${searchTerm}%`)
        .order('submitted', { ascending: false });
      if (!error) {
        setFilteredPapers(data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Search the Repository</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for papers by title, author, abstract, or subject..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button onClick={handleSearch} className="arxiv-button px-6 py-2 rounded-md font-medium">
            Search
          </button>
        </div>
        <div className="mt-4">
          <button onClick={() => setShowAdvanced((prev: boolean) => !prev)} className="text-blue-600 hover:text-blue-800 text-sm">
            {showAdvanced ? 'Hide Advanced Search' : 'Show Advanced Search'}
          </button>
        </div>
      </div>
    </div>
  );
}