'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import PDFViewer from './components/PDFViewer';
import InfoDisplay from './components/InfoDisplay';

type Education = {
  institution: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
  gpa?: number;
  location?: string;
};

type WorkExperience = {
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
};

type ExtractedData = {
  fileUrl: string;
  extractedInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    websites?: string[];
    summary?: string;
    education: Education[];
    work: WorkExperience[];
    skills: string[];
    languages: string[];
    certifications: string[];
    rawText: string;
  };
};

export default function Home() {
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [highlights, setHighlights] = useState<{ text: string }[]>([]);

  const handleFileProcessed = (data: any) => {
    setExtractedData(data);
    
    // Create highlights from extracted info
    const highlights = [
      { text: data.extractedInfo.name },
      { text: data.extractedInfo.email },
      { text: data.extractedInfo.phone },
      ...(data.extractedInfo.education?.map((edu: Education) => ({
        text: [edu.institution, edu.degree].filter(Boolean).join(' - ')
      })) || []),
      ...(data.extractedInfo.work?.map((work: WorkExperience) => ({
        text: [work.company, work.position].filter(Boolean).join(' - ')
      })) || []),
    ].filter(h => h.text); // Remove empty highlights
    
    setHighlights(highlights);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Resume Information Extractor
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Upload your resume and extract key information automatically
          </p>
        </div>

        {!extractedData ? (
          <FileUpload onFileProcessed={handleFileProcessed} />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Resume</h2>
              <PDFViewer 
                fileUrl={extractedData.fileUrl} 
                highlights={highlights} 
              />
              <div className="mt-4">
                <button
                  onClick={() => setExtractedData(null)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload Another Resume
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Extracted Information</h2>
              <InfoDisplay info={extractedData.extractedInfo} />
            </div>
          </div>
        )}
      </div>
    </div>
    //     </div>
    //   </main>
    // </div>
  );
}
