import { readFile } from 'fs/promises';
import { randomUUID } from 'crypto';

// Helper function to extract information from text
export function extractInfoFromText(text: string) {
  // Extract name (first line that looks like a name)
  const nameMatch = text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m);
  const name = nameMatch ? nameMatch[0].trim() : 'Your Name';

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/);
  const email = emailMatch ? emailMatch[0] : 'your.email@example.com';

  // Extract phone number
  const phoneMatch = text.match(/(\+?\d[\d\s-]+\.?\d{2,})/);
  const phone = phoneMatch ? phoneMatch[0].trim() : 'Your Phone';

  // Extract education
  const educationMatch = text.match(/(?:education|university|college|institute)[\s\S]*?(?=(?:experience|skills|projects|$))/i);
  const education = educationMatch ? educationMatch[0].trim() : 'Your education details will appear here';

  // Extract skills
  const skillsMatch = text.match(/(?:skills|technical skills|technologies)[\s\S]*?(?=(?:experience|education|projects|$))/i);
  const skills = skillsMatch ? skillsMatch[0].trim() : 'Your skills will appear here';

  // Extract projects
  const projectsMatch = text.match(/(?:projects|work samples)[\s\S]*?(?=(?:education|skills|experience|$))/i);
  const projects = projectsMatch ? projectsMatch[0].trim() : 'Your projects will appear here';

  // Extract experience
  const experienceMatch = text.match(/(?:experience|work experience|employment history)[\s\S]*?(?=(?:education|skills|projects|$))/i);
  const experience = experienceMatch ? experienceMatch[0].trim() : 'Your work experience will appear here';

  return {
    name,
    email,
    phone,
    education,
    skills,
    projects,
    experience,
  };
}

// Function to parse PDF buffer
export async function parsePdf(buffer: Buffer) {
  // Dynamically import pdf-parse to avoid module resolution issues
  const { default: pdfParse } = await import('pdf-parse');
  const data = await pdfParse(buffer);
  return data.text;
}
