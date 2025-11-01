const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/upload', upload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Simulate processing
    const extractedInfo = {
      name: 'John Doe',
      college: 'Sample University',
      projects: 'Sample Project: Built a resume parser',
      achievements: 'Sample Achievement: Won a coding competition',
      contact: 'john.doe@example.com'
    };

    res.json({
      success: true,
      fileUrl: `/uploads/${req.file.filename}`,
      extractedInfo
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});




















// const http = require('http');
// const fs = require('fs');
// const path = require('path');

// const server = http.createServer((req, res) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Request-Method', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
//   res.setHeader('Access-Control-Allow-Headers', '*');

//   if (req.method === 'OPTIONS') {
//     res.writeHead(200);
//     res.end();
//     return;
//   }

//   if (req.url === '/api/health' && req.method === 'GET') {
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ status: 'ok', message: 'Server is running' }));
//     return;
//   }

//   if (req.url === '/api/upload' && req.method === 'POST') {
//     let body = [];
//     req.on('data', chunk => body.push(chunk));
//     req.on('end', () => {
//       console.log('Received file upload');
//       res.writeHead(200, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify({
//         success: true,
//         fileUrl: 'test-url',
//         extractedInfo: {
//           name: 'Test User',
//           college: 'Test University',
//           projects: 'Sample Project',
//           achievements: 'Sample Achievement',
//           contact: '123-456-7890'
//         }
//       }));
//     });
//     return;
//   }

//   res.writeHead(404, { 'Content-Type': 'application/json' });
//   res.end(JSON.stringify({ error: 'Not Found' }));
// });

// const port = 3001; // Changed from 5000 to 3001
// server.listen(port, '0.0.0.0', () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });

// // Handle server errors
// server.on('error', (error) => {
//   if (error.code === 'EADDRINUSE') {
//     console.error(`Port ${port} is already in use`);
//   } else {
//     console.error('Server error:', error);
//   }
//   process.exit(1);
// });

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Extract text from PDF
// async function extractTextFromPdf(filePath) {
//   try {
//     const dataBuffer = fs.readFileSync(filePath);
//     const data = await pdf(dataBuffer);
//     return data.text;
//   } catch (error) {
//     console.error('Error extracting text from PDF:', error);
//     throw new Error('Failed to extract text from PDF');
//   }
// }

// // Extract information from text
// function extractInfo(text) {
//   const info = {
//     name: extractName(text),
//     college: extractCollege(text),
//     projects: extractProjects(text),
//     achievements: extractAchievements(text),
//     contact: extractContact(text),
//   };
//   return info;
// }

// function extractName(text) {
//   // Simple regex to find a potential name (first line or first two words that start with capital letters)
//   const nameMatch = text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m);
//   return nameMatch ? nameMatch[0].trim() : '';
// }

// function extractCollege(text) {
//   // Look for common college/university patterns
//   const collegeMatch = text.match(/(?:university|college|institute)[^\n,;.]+/i);
//   return collegeMatch ? collegeMatch[0].trim() : '';
// }

// function extractProjects(text) {
//   // Look for project sections
//   const projectMatch = text.match(/projects?:([\s\S]*?)(?=achievements|education|experience|skills|\n\s*\n|$)/i);
//   return projectMatch ? projectMatch[1].trim() : '';
// }

// function extractAchievements(text) {
//   // Look for achievements sections
//   const achievementMatch = text.match(/(?:achievements|awards|certifications):([\s\S]*?)(?=projects|education|experience|skills|\n\s*\n|$)/i);
//   return achievementMatch ? achievementMatch[1].trim() : '';
// }

// function extractContact(text) {
//   // Look for phone numbers
//   const phoneMatch = text.match(/(\+?[\d\s\-\(\)]{10,})/);
//   return phoneMatch ? phoneMatch[0].trim() : '';
// }

// // API endpoint for file upload and processing
// app.post('/api/upload', upload.single('resume'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const filePath = path.join(__dirname, '..', req.file.path);
//     const text = await extractTextFromPdf(filePath);
//     const extractedInfo = extractInfo(text);

//     // Clean up the uploaded file
//     fs.unlinkSync(filePath);

//     res.json({
//       success: true,
//       fileUrl: `/uploads/${req.file.filename}`,
//       extractedInfo,
//       text // For debugging
//     });
//   } catch (error) {
//     console.error('Error processing file:', error);
//     res.status(500).json({ error: 'Error processing file' });
//   }
// });

// // Serve static files from the uploads directory
// app.use('/uploads', express.static('uploads'));

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
