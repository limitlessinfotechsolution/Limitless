import React, { useState } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

interface SearchFunctionalityProps {
  faqs: FAQ[];
  onSearchResults: (results: FAQ[], searchTerm: string) => void;
  className?: string;
}

const SearchFunctionality: React.FC<SearchFunctionalityProps> = ({
  faqs,
  onSearchResults,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term.trim()) {
      onSearchResults(faqs, '');
      return;
    }

    const filtered = faqs.filter(faq =>
      faq.question.toLowerCase().includes(term.toLowerCase()) ||
      faq.answer.toLowerCase().includes(term.toLowerCase())
    );

    onSearchResults(filtered, term);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchFunctionality;
