'use client';

interface Education {
  institution: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
  gpa?: number;
  location?: string;
}

interface WorkExperience {
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
}

interface ExtractedInfo {
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
}

export default function InfoDisplay({ info }: { info: ExtractedInfo }) {
  if (!info) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Extracted Information
      </h2>
      
      <div className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-1">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Name</h4>
              <p className="text-gray-900">{info.name || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <a href={`mailto:${info.email}`} className="text-blue-600 hover:underline">
                {info.email || 'Not provided'}
              </a>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Phone</h4>
              <a href={`tel:${info.phone}`} className="text-gray-900">
                {info.phone || 'Not provided'}
              </a>
            </div>
            {info.linkedin && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">LinkedIn</h4>
                <a 
                  href={info.linkedin.startsWith('http') ? info.linkedin : `https://${info.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {info.linkedin}
                </a>
              </div>
            )}
            {info.websites?.map((site, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium text-gray-500">
                  {index === 0 ? 'Website' : ' '}
                </h4>
                <a 
                  href={site.startsWith('http') ? site : `https://${site}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {site}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {info.summary && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">Summary</h3>
            <p className="text-gray-700 whitespace-pre-line">{info.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {info.work.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
              Work Experience
            </h3>
            <div className="space-y-4">
              {info.work.map((work, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{work.position}</h4>
                      <p className="text-gray-700">{work.company}</p>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {work.startDate && formatDate(work.startDate)} - {work.endDate ? formatDate(work.endDate) : 'Present'}
                    </div>
                  </div>
                  {work.summary && (
                    <p className="mt-1 text-gray-600 text-sm">{work.summary}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {info.education.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">Education</h3>
            <div className="space-y-4">
              {info.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-green-200 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {[edu.degree, edu.institution].filter(Boolean).join(', ')}
                      </h4>
                      {edu.location && (
                        <p className="text-gray-600 text-sm">{edu.location}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {edu.startDate && formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {info.skills.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {info.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {info.languages.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {info.languages.map((lang, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {info.certifications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">Certifications</h3>
            <ul className="list-disc list-inside space-y-1">
              {info.certifications.map((cert, index) => (
                <li key={index} className="text-gray-700">{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
