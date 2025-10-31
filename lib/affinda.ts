const AFFINDA_API_KEY = process.env.NEXT_PUBLIC_AFFINDA_API_KEY || '';
const AFFINDA_API_URL = 'https://api.affinda.com/v2';

if (!AFFINDA_API_KEY) {
  console.warn('AFFINDA_API_KEY is not set. Resume parsing will not work.');
}

export interface AffindaResumeData {
  data: {
    name?: {
      raw?: string;
      first?: string;
      last?: string;
      middle?: string;
      title?: string;
    } | string;
    email?: string;
    emails?: string[];
    phoneNumber?: string;
    phoneNumbers?: string[];
    education?: Array<{
      organization?: string;
      institution?: string;
      degree?: string;
      area?: string;
      startDate?: string;
      endDate?: string;
      gpa?: number;
      location?: string | {
        raw?: string;
      };
    }>;
    workExperience?: Array<{
      jobTitle?: string;
      position?: string;
      organization?: string;
      company?: string;
      startDate?: string;
      endDate?: string;
      summary?: string;
      description?: string;
    }>;
    skills?: Array<{
      name?: string;
      type?: string;
    } | string>;
    languages?: Array<{
      name?: string;
      code?: string;
    } | string>;
    certifications?: string[];
    rawText?: string;
    fullText?: string;
    summary?: string;
    linkedin?: string;
    websites?: string[];
    dateOfBirth?: string | null;
  };
  meta?: {
    ready?: boolean;
    failed?: boolean;
    errorDetail?: string;
    [key: string]: any;
  };
  status?: string;
}

export async function parseResumeWithAffinda(file: File): Promise<AffindaResumeData> {
  if (!AFFINDA_API_KEY) {
    throw new Error('Affinda API key is not configured');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Uploading document to Affinda...');
    const uploadResponse = await fetch(`${AFFINDA_API_URL}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AFFINDA_API_KEY}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    const uploadData = await uploadResponse.json().catch(() => ({}));
    
    if (!uploadResponse.ok) {
      console.error('Affinda upload error:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: uploadData,
        headers: Object.fromEntries(uploadResponse.headers.entries())
      });
      
      throw new Error(
        `Failed to upload document: ${uploadResponse.status} - ${uploadData.detail || uploadData.message || uploadResponse.statusText || 'Unknown error'}`
      );
    }

    const documentId = uploadData.identifier || uploadData.document?.identifier;
    if (!documentId) {
      console.error('No document ID in response:', uploadData);
      throw new Error('No document ID received from Affinda');
    }

    console.log(`Document uploaded with ID: ${documentId}, waiting for processing...`);
    
    let attempts = 0;
    const maxAttempts = 15; 
    let result: any = null;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Processing attempt ${attempts}/${maxAttempts}...`);
      
      try {
        const statusResponse = await fetch(`${AFFINDA_API_URL}/documents/${documentId}`, {
          headers: {
            'Authorization': `Bearer ${AFFINDA_API_KEY}`,
            'Accept': 'application/json',
          },
        });

        const statusData = await statusResponse.json();
        console.log('Status check response:', {
          status: statusResponse.status,
          data: statusData
        });
        
        if (statusResponse.ok && (statusData.meta?.ready || statusData.status === 'success')) {
          result = statusData;
          console.log('Document processing complete');
          break;
        } else if (statusData.meta?.failed) {
          throw new Error(`Document processing failed: ${statusData.meta.errorDetail || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error checking document status:', error);
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if (!result) {
      throw new Error(`Document processing timed out after ${maxAttempts} attempts`);
    }

    console.log('Successfully processed resume with Affinda');
    return result as AffindaResumeData;
  } catch (error) {
    console.error('Error in parseResumeWithAffinda:', error);
    throw error; 
  }
}

export function transformAffindaData(data: AffindaResumeData) {
  try {
    const resume = data.data || data;
    
    let fullName = 'Name not found';
    if (resume.name) {
      if (typeof resume.name === 'string') {
        fullName = resume.name;
      } else {
        fullName = [
          resume.name.title,
          resume.name.first,
          resume.name.middle,
          resume.name.last
        ]
          .filter(Boolean)
          .join(' ')
          .trim() || resume.name.raw || 'Name not found';
      }
    }

    const emails = [];
    if (resume.email) emails.push(resume.email);
    if (Array.isArray(resume.emails)) emails.push(...resume.emails);
    const primaryEmail = emails[0] || 'No email found';

    const phoneNumbers = [];
    if (resume.phoneNumber) phoneNumbers.push(resume.phoneNumber);
    if (Array.isArray(resume.phoneNumbers)) phoneNumbers.push(...resume.phoneNumbers);
    const primaryPhone = phoneNumbers[0] || 'No phone number found';

    const education = (resume.education || []).map(edu => ({
      institution: edu.organization || edu.institution || 'Unknown Institution',
      degree: edu.degree || edu.area || undefined,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa,
      location: typeof edu.location === 'string' 
        ? edu.location 
        : edu.location?.raw
    }));

    const work = (resume.workExperience || []).map(work => ({
      company: work.organization || work.company || 'Unknown Company',
      position: work.jobTitle || work.position || 'Position not specified',
      startDate: work.startDate,
      endDate: work.endDate,
      summary: work.summary || work.description || ''
    }));

    const skills = (resume.skills || []).map(skill => 
      typeof skill === 'string' ? skill : skill?.name || ''
    ).filter(Boolean);

    const languages = (resume.languages || []).map(lang => 
      typeof lang === 'string' ? lang : lang?.name || ''
    ).filter(Boolean);

    const result = {
      name: fullName,
      email: primaryEmail,
      phone: primaryPhone,
      linkedin: resume.linkedin,
      websites: resume.websites || [],
      dateOfBirth: resume.dateOfBirth,
      
      summary: resume.summary,
      
      education: education,
      work: work,
      
      skills: skills,
      languages: languages,
      certifications: resume.certifications || [],
      
      rawText: resume.rawText || resume.fullText || '',
      
      meta: {
      }
    };

    console.log('Transformed resume data:', JSON.stringify(result, null, 2));
    return result;
    
  } catch (error) {
    console.error('Error transforming Affinda data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to transform resume data: ${errorMessage}`);
  }
}
