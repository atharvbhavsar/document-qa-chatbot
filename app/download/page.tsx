'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/button/Button';

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const documents = [
    { id: 1, title: 'Annual Report 2023', size: '4.2 MB', type: 'PDF', date: '2023-12-15' },
    { id: 2, title: 'Q4 Financial Analysis', size: '2.1 MB', type: 'DOCX', date: '2023-11-30' },
    { id: 3, title: 'Market Research Data', size: '8.7 MB', type: 'XLSX', date: '2023-10-22' },
    { id: 4, title: 'Product Roadmap 2024', size: '1.5 MB', type: 'PDF', date: '2023-12-05' },
    { id: 5, title: 'Customer Survey Results', size: '3.3 MB', type: 'PPTX', date: '2023-09-18' },
  ];

  const handleDownload = (id: number) => {
    setDownloading(true);
    
    // Simulate download delay
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
      
      // Reset download complete status after 3 seconds
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
    }, 2000);
  };

  const handleBulkDownload = () => {
    setDownloading(true);
    
    // Simulate download delay
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
      
      // Reset download complete status after 3 seconds
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
    }, 3500);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Your Documents
        </h1>
        <Button 
          variant="gradient" 
          size="lg"
          loading={downloading}
          onClick={handleBulkDownload}
          disabled={downloading}
        >
          Download All
        </Button>
      </div>
      
      {downloadComplete && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-center text-green-800 dark:text-green-300">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Download complete! Your files are ready.</span>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Document Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {doc.type === 'PDF' && (
                        <svg className="h-8 w-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 384 512">
                          <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-16.8 15.8-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z" />
                        </svg>
                      )}
                      {doc.type === 'DOCX' && (
                        <svg className="h-8 w-8 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 384 512">
                          <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm57.1 120H305c7.7 0 13.4 7.1 11.7 14.7l-38 168c-1.2 5.5-6.1 9.3-11.7 9.3h-38c-5.5 0-10.3-3.8-11.6-9.1-25.8-103.5-20.8-81.2-25.6-110.5h-.5c-1.1 14.3-2.4 17.4-25.6 110.5-1.3 5.3-6.1 9.1-11.6 9.1H117c-5.6 0-10.5-3.9-11.7-9.4l-37.8-168c-1.7-7.5 4-14.6 11.7-14.6h24.7c5.7 0 10.7 4 11.8 9.7 15.6 78 20.1 109.5 21 122.2 1.6-10.2 7.3-32.7 29.4-122.7 1.3-5.4 6.1-9.1 11.7-9.1h29.1c5.6 0 10.4 3.8 11.7 9.2 24 100.4 28.8 124 29.6 129.4-.2-11.2-2.6-17.8 21.6-129.2 1-5.6 5.9-9.5 11.5-9.5zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
                        </svg>
                      )}
                      {doc.type === 'XLSX' && (
                        <svg className="h-8 w-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 384 512">
                          <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L224 336l60.1 93.5c5.1 8-.6 18.5-10.1 18.5h-34.9c-4.4 0-8.5-2.4-10.6-6.3C208.9 405.5 192 373 192 373c-6.4 14.8-10 20-36.6 68.8-2.1 3.9-6.1 6.3-10.5 6.3H110c-9.5 0-15.2-10.5-10.1-18.5l60.3-93.5-60.3-93.5c-5.2-8 .6-18.5 10.1-18.5h34.8c4.4 0 8.5 2.4 10.6 6.3 26.1 48.8 20 33.6 36.6 68.5 0 0 6.1-11.7 36.6-68.5 2.1-3.9 6.2-6.3 10.6-6.3H274c9.5-.1 15.2 10.4 10.1 18.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
                        </svg>
                      )}
                      {doc.type === 'PPTX' && (
                        <svg className="h-8 w-8 text-orange-500 mr-3" fill="currentColor" viewBox="0 0 384 512">
                          <path d="M193.7 271.2c8.8 0 15.5 2.7 20.3 8.1 9.6 10.9 9.8 32.7-.2 44.1-4.9 5.6-11.9 8.5-21.1 8.5h-26.9v-60.7h27.9zM377.9 121.6L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.4c0-6.4-2.5-12.5-7-16.9zm-153 15.4h-98v-.1h-6v6.5c0 12.9 9.9 14.7 17.7 14.7 7.6 0 8.3-.9 8.3-12.5V124h66v29.5c0 15.1-3.2 22.5-9.6 26.2-6.4 3.7-16.2 4.2-24.9 4.2H88.7c-16.9 0-25.7-5.2-32.7-15.7-7-10.5-7-18.5-7-31.2V80H24c-13.3 0-24 10.7-24 24v264c0 44.2 35.8 80 80 80h224c44.2 0 80-35.8 80-80V160H248c-13.2 0-24-10.8-24-24.1v.1zm72 96v8c0 13.3-10.7 24-24 24h-32v49.7c0 21-19.7 21-21.5 21-23.1 0-32.5-31.5-32.5-31.5l22.5-7.5V221.5c0-13.3 10.7-24 24-24h60c13.3 0 24 10.7 24 24z" />
                        </svg>
                      )}
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {doc.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {new Date(doc.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => handleDownload(doc.id)}
                      loading={downloading}
                      disabled={downloading}
                      icon={
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      }
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
