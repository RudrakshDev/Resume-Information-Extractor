# Resume Information Extractor

A full-stack web application that extracts and highlights key information from resumes in PDF format. The application identifies and extracts details such as name, college/university, projects, achievements, and contact information.

## Features

- Upload PDF resumes
- Extract key information using text parsing and pattern matching
- Display the uploaded PDF with highlighted extracted information
- Clean, responsive UI built with Tailwind CSS
- Real-time processing and feedback

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Libraries**:
  - pdf-parse: For text extraction from PDFs
  - @react-pdf-viewer: For PDF viewing and highlighting
  - multer: For file upload handling

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd resume-code
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development servers:
   - In one terminal, start the Next.js frontend:
     ```bash
     npm run dev
     ```
   - In another terminal, start the Express backend:
     ```bash
     cd server
     npm install
     node index.js
     ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## How It Works

1. **Upload**: Users can drag and drop or select a PDF resume file.
2. **Process**: The backend processes the PDF to extract text and identify key information.
3. **Display**: The frontend displays the PDF with highlighted sections and shows the extracted information in a clean, organized format.

## Customization

You can modify the text extraction patterns in `server/index.js` to better match different resume formats. The current implementation uses simple regex patterns that can be adjusted as needed.

## License

This project is open source and available under the [MIT License](LICENSE).
