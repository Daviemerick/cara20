import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRoutes } from './routes/auth.js';
import { dashboardRoutes } from './routes/dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || (process.env.NODE_ENV === 'production' ? 3000 : 3001);

// CORS configuration - secure for Replit environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-replit-domain.replit.app' 
    : ['http://localhost:5000', 'http://0.0.0.0:5000'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes (these come BEFORE static file serving)
app.use('/auth', authRoutes);
app.use('/api', dashboardRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  
  // Serve static assets with proper caching headers
  app.use(express.static(distPath, {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      // Disable cache for HTML files to ensure latest version is served
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api') || 
        req.path.startsWith('/auth') || 
 
        req.path.startsWith('/health')) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
});