import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { parseResumeWithAffinda, transformAffindaData } from '@/lib/affinda';

// Define types for the resume data
interface Education {
  institution: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
}

interface WorkExperience {
  company: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
}

interface Project {
  name: string;
  description?: string;
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  education: Education[];
  skills: string[];
  work: WorkExperience[];
  projects: Project[];
}

// Simplified interface for the response
export interface ResumeResponse {
  success: boolean;
  fileUrl: string;
  extractedInfo: {
    name: string;
    email: string;
    phone: string;
    education: Array<{
      institution: string;
      degree?: string;
      startDate?: string;
      endDate?: string;
      gpa?: number;
      location?: string;
    }>;
    work: Array<{
      company: string;
      position?: string;
      startDate?: string;
      endDate?: string;
      summary?: string;
    }>;
    skills: string[];
    rawText: string;
  } | null;
  error?: string;
}

// Disable body parsing, we'll handle it manually
// This is the new Next.js 13+ route segment config format
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for processing
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File | null;
    
    if (!process.env.NEXT_PUBLIC_AFFINDA_API_KEY) {
      throw new Error('Affinda API key is not configured');
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Only PDF and DOCX files are allowed' },
        { status: 400 }
      );
    }

    // Read the file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${randomUUID()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure uploads directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Save the uploaded file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Ensure temp directory exists
    const tempDir = path.join(process.cwd(), 'temp');
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }
    
    // Save the file temporarily
    const tempFilePath = path.join(tempDir, filename);
    await writeFile(tempFilePath, buffer);

    try {
      console.log('Sending file to Affinda API...');
      const affindaResponse = await parseResumeWithAffinda(file);
      
      if (!affindaResponse?.data) {
        console.error('Invalid response from Affinda API:', affindaResponse);
        throw new Error('Invalid response from resume parsing service');
      }
      
      console.log('Received response from Affinda API, transforming data...');
      const extractedInfo = transformAffindaData(affindaResponse);
      console.log('Data transformation complete');

      // Clean up temp file
      await unlink(tempFilePath).catch(console.error);

      return NextResponse.json({
        success: true,
        fileUrl: `/uploads/${filename}`,
        extractedInfo,
      } as ResumeResponse);
    } catch (error) {
      console.error('Affinda parsing failed:', error);
      // Include more detailed error information
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorResponse = {
        success: false,
        error: `Failed to parse resume: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing file:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        success: false, 
        error: `Error processing file: ${errorMessage}`,
        fileUrl: '',
        extractedInfo: null
      } as unknown as ResumeResponse,
      { status: 500 }
    );
  }
}
