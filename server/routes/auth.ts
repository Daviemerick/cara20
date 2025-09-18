import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Client configuration - easily changeable for different clients
const currentClientConfig = {
  user: {
    id: '1',
    email: process.env.CLIENT_LOGIN_EMAIL || 'admin@empresa.com',
    password: process.env.CLIENT_LOGIN_PASSWORD_HASH || '$2b$10$sxI6Ai8icfl0P3tKdF67wOsCmweeQvr314iAs/wIb3DDvowy60qP.', // 123456
    name: process.env.CLIENT_USER_NAME || 'Administrador',
    role: 'admin' as const
  },
  client: {
    id: '1',
    name: process.env.CLIENT_COMPANY_NAME || 'Sua Empresa',
    email: process.env.CLIENT_COMPANY_EMAIL || 'contato@empresa.com',
    plan_type: (process.env.CLIENT_PLAN_TYPE as 'starter' | 'pro' | 'enterprise') || 'pro'
  }
};

// Demo users for development - now using environment variables
const demoUsers = [currentClientConfig];

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const userConfig = demoUsers.find(u => u.user.email === email);
    if (!userConfig) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userConfig.user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token with more secure secret handling
    const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' 
      ? (() => { throw new Error('JWT_SECRET is required in production'); })()
      : 'demo-secret-key-for-development-only');
    
    const token = jwt.sign(
      { 
        userId: userConfig.user.id,
        email: userConfig.user.email,
        clientId: userConfig.client.id 
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Demo credentials configuration
    const credentials = {
      google_calendar: true,
      google_meet: true,
      whatsapp: true,
      evolution_api: true,
      supabase_configured: true,
      n8n_configured: true
    };

    res.json({
      success: true,
      token,
      user: {
        id: userConfig.user.id,
        email: userConfig.user.email,
        name: userConfig.user.name,
        role: userConfig.user.role
      },
      client: userConfig.client,
      credentials
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Token validation endpoint
router.get('/validate', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' 
      ? (() => { throw new Error('JWT_SECRET is required in production'); })()
      : 'demo-secret-key-for-development-only');
    
    const decoded = jwt.verify(token, jwtSecret) as any;
    const userConfig = demoUsers.find(u => u.user.id === decoded.userId);
    
    if (!userConfig) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    res.json({
      success: true,
      user: {
        id: userConfig.user.id,
        email: userConfig.user.email,
        name: userConfig.user.name,
        role: userConfig.user.role
      },
      client: userConfig.client
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

export { router as authRoutes };