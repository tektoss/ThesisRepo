'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdvancedFilters({ setFilteredPapers }: { setFilteredPapers: (papers: any[]) => void }) {
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
      let query = supabase.from('publications').select('*');
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
      if (!error) {
        setFilteredPapers(data);
      }
    } catch (error) {
      console.error('Filter failed:', error);
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
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Advanced Search Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country/Region</label>
          <select name="country" value={filters.country} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">All Countries</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Kenya">Kenya</option>
            <option value="Ghana">Ghana</option>
            <option value="South Africa">South Africa</option>
            <option value="Egypt">Egypt</option>
            <option value="India">India</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Philippines">Philippines</option>
            <option value="Brazil">Brazil</option>
            <option value="Mexico">Mexico</option>
            <option value="Colombia">Colombia</option>
            <option value="Peru">Peru</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject Classification</label>
          <select name="subject" value={filters.subject} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">All Subjects</option>
            <option value="cs">Computer Science</option>
            <option value="eess">Electrical Engineering and Systems Science</option>
            <option value="econ">Economics</option>
            <option value="q-bio">Quantitative Biology</option>
            <option value="stat">Statistics</option>
            <option value="math">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="q-fin">Quantitative Finance</option>
            <option value="agri">Agriculture</option>
            <option value="med">Medicine</option>
            <option value="env">Environmental Science</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
          <select name="level" value={filters.level} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">All Levels</option>
            <option value="high-school">High School</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="postgraduate">Postgraduate</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Publication Type</label>
          <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            <option value="article">Research Article</option>
            <option value="thesis">Thesis</option>
            <option value="conference">Conference Paper</option>
            <option value="review">Review</option>
            <option value="preprint">Preprint</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select name="date" value={filters.date} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="">All Dates</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="older">Before 2020</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
          <input
            type="text"
            name="institution"
            value={filters.institution}
            onChange={handleFilterChange}
            placeholder="University or Institution"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={applyFilters} className="arxiv-button px-6 py-2 rounded-md font-medium">
          Apply Filters
        </button>
        <button onClick={clearFilters} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          Clear All
        </button>
      </div>
    </div>
  );
}