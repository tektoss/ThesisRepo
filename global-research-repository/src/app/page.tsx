'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SearchSection from '../components/SearchSection';
import AdvancedFilters from '../components/AdvancedFilters';
import PaperList from '../components/PaperList';
import UploadModal from '../components/UploadModal';

export default function Home() {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const papersPerPage = 10;

  useEffect(() => {
    const fetchPapers = async () => {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('submitted', { ascending: false });
      if (!error) {
        setPapers(data);
        setFilteredPapers(data);
      }
    };
    fetchPapers();
  }, []);

  return (
    <div>
      <header className="arxiv-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="arxiv-logo text-2xl">Global South Research Repository by inested.com</div>
              <div className="text-sm text-gray-600">Research for Developing Nations</div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowModal(true)} className="arxiv-button px-4 py-2 rounded text-sm font-medium">
                Submit Paper
              </button>
              <Link href="/help" className="text-blue-600 hover:text-blue-800 text-sm">
                Help
              </Link>
              <Link href="/login" className="text-blue-600 hover:text-blue-800 text-sm">
                Login/Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>
      <nav className="arxiv-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-12 items-center text-sm">
            <Link href="/browse" className="text-blue-600 hover:text-blue-800 font-medium">Browse</Link>
            <Link href="/search" className="text-blue-600 hover:text-blue-800 font-medium">Search</Link>
            <Link href="/stats" className="text-blue-600 hover:text-blue-800 font-medium">Statistics</Link>
            <Link href="/about" className="text-blue-600 hover:text-blue-800 font-medium">About</Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">Contact</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchSection setFilteredPapers={setFilteredPapers} setShowAdvanced={setShowAdvanced} />
        {showAdvanced && <AdvancedFilters setFilteredPapers={setFilteredPapers} />}
        <PaperList papers={filteredPapers} currentPage={currentPage} setCurrentPage={setCurrentPage} papersPerPage={papersPerPage} />
      </div>
      {showModal && <UploadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}