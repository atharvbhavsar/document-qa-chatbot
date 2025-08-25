'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/button/Button';
import LoadingIndicator from '../../components/LoadingIndicator';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
      } else {
        setError(data.error || 'Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocument(docId === selectedDocument ? null : docId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Search Documents</h1>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSearching}
            />
            <Button
              type="submit"
              disabled={isSearching || !query.trim()}
              variant="default" 
              className="px-6"
            >
              Search
            </Button>
          </div>
        </form>

        {isSearching && (
          <div className="text-center py-8">
            <LoadingIndicator isVisible={true} message="Searching documents..." />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-lg font-semibold p-4 border-b">
              Search Results ({results.length})
            </h2>
            <ul className="divide-y">
              {results.map((result, index) => (
                <li key={index} className="p-4 hover:bg-gray-50">
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleDocumentSelect(result.id)}
                  >
                    <h3 className="font-medium text-blue-600">
                      {result.title || 'Document Excerpt'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.source || 'Unknown source'}
                    </p>
                    <p className="mt-2 text-gray-800">
                      {result.content}
                    </p>
                    {selectedDocument === result.id && result.fullContent && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-gray-800">{result.fullContent}</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isSearching && results.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p>Enter a question to search your documents</p>
          </div>
        )}
      </div>
    </div>
  );
}
