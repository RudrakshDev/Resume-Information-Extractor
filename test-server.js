const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Test server is running' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    success: true,
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  }));
});

const port = 3002;
server.listen(port, '0.0.0.0', () => {
  console.log(`Test server running at http://localhost:${port}/`);
  console.log(`Test health check: http://localhost:${port}/api/health`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Test server error:', error);
  process.exit(1);
});
