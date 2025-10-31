export function extractInfoFromText(text: string) {

  const nameMatch = text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m);
  const name = nameMatch ? nameMatch[0].trim() : 'Your Name';

  const emailMatch = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/);
  const email = emailMatch ? emailMatch[0] : 'your.email@example.com';

  const phoneMatch = text.match(/(\+?\d[\d\s-]+\.?\d{2,})/);
  const phone = phoneMatch ? phoneMatch[0].trim() : 'Your Phone';

  const educationMatch = text.match(/(?:education|university|college|institute)[\s\S]*?(?=(?:experience|skills|projects|$))/i);
  const education = educationMatch ? educationMatch[0].trim() : 'Your education details will appear here';

  const skillsMatch = text.match(/(?:skills|technical skills|technologies)[\s\S]*?(?=(?:experience|education|projects|$))/i);
  const skills = skillsMatch ? skillsMatch[0].trim() : 'Your skills will appear here';

  const projectsMatch = text.match(/(?:projects|work samples)[\s\S]*?(?=(?:education|skills|experience|$))/i);
  const projects = projectsMatch ? projectsMatch[0].trim() : 'Your projects will appear here';

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

export async function parsePdf(buffer: Buffer) {
  const { default: pdfParse } = await import('pdf-parse');
  const data = await pdfParse(buffer);
  return data.text;
}
