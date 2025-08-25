'use client';

import { useState, useEffect } from 'react';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink: string;
}

interface DriveFileBrowserProps {
  tokens: any;
  onFilesSelected: (fileIds: string[]) => void;
  selectedFiles: string[];
}

export default function DriveFileBrowser({ tokens, onFilesSelected, selectedFiles }: DriveFileBrowserProps) {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (tokens) {
      loadFiles();
    }
  }, [tokens]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        tokens: encodeURIComponent(JSON.stringify(tokens)),
        maxResults: '50'
      });
      
      const response = await fetch(`/api/drive/files?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchFiles = async () => {
    if (!searchQuery.trim()) {
      loadFiles();
      return;
    }

    try {
      setSearching(true);
      const response = await fetch('/api/drive/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokens,
          query: searchQuery,
          maxResults: 50
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error searching files:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleFileToggle = (fileId: string) => {
    const newSelection = selectedFiles.includes(fileId)
      ? selectedFiles.filter(id => id !== fileId)
      : [...selectedFiles, fileId];
    
    onFilesSelected(newSelection);
  };

  const formatFileSize = (size?: string) => {
    if (!size) return 'Unknown size';
    const bytes = parseInt(size);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('document')) return '📄';
    if (mimeType.includes('presentation')) return '📊';
    if (mimeType.includes('spreadsheet')) return '📈';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('text')) return '📝';
    return '📄';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading Google Drive files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search your Google Drive..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchFiles()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={searchFiles}
          disabled={searching}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {searching ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); loadFiles(); }}
            className="px-3 py-2 text-gray-500 hover:text-gray-700"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* File List */}
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        {files.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? 'No files found matching your search.' : 'No files found in your Google Drive.'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {files.map((file) => (
              <div
                key={file.id}
                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedFiles.includes(file.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleFileToggle(file.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => handleFileToggle(file.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-xl">{getFileIcon(file.mimeType)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • Modified {formatDate(file.modifiedTime)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                    title="Open in Google Drive"
                  >
                    Open ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selection Info */}
      {selectedFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected for processing
          </p>
        </div>
      )}
    </div>
  );
}
