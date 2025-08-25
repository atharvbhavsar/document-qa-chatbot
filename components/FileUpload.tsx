'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onUploadSuccess: (filename: string) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadStatus('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus(`✅ ${result.message} (${result.chunksCount} chunks created)`);
        onUploadSuccess(result.filename);
      } else {
        // Check for specific rate limit errors
        if (result.error && (
          result.error.includes('rate limit') ||
          result.error.includes('Quota exceeded') ||
          result.error.includes('API rate limit')
        )) {
          setUploadStatus(`❌ Google API rate limit reached. Please wait a minute before trying again.`);
        } else {
          setUploadStatus(`❌ ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-4xl">📄</div>
          {uploading ? (
            <p className="text-gray-600">Uploading and processing...</p>
          ) : isDragActive ? (
            <p className="text-blue-600">Drop the file here...</p>
          ) : (
            <div>
              <p className="text-gray-600">
                Drag & drop a PDF, DOCX, PNG or JPG file here, or click to select
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Supported formats: PDF, DOCX, PNG, JPG
              </p>
            </div>
          )}
        </div>
      </div>
      
      {uploadStatus && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50 text-sm">
          {uploadStatus}
        </div>
      )}
    </div>
  );
}
