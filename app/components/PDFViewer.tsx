'use client';

import { useState, useEffect } from 'react';

export default function PDFViewer({ fileUrl }: { fileUrl: string; highlights?: { text: string }[] }) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Create a blob URL for the PDF
  useEffect(() => {
    if (!fileUrl) return;

    const fetchPdf = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Failed to load PDF');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load the PDF file');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [fileUrl]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="animate-pulse text-gray-500">Loading PDF...</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 border-b">
        <h3 className="text-sm font-medium text-gray-700">Resume Preview</h3>
      </div>
      <div className="h-[600px] w-full">
        {pdfUrl && (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full"
            title="PDF Viewer"
          />
        )}
      </div>
    </div>
  );
}
