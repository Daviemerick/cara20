import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer';
}

interface Client {
  id: string;
  name: string;
  email: string;
  plan_type: 'starter' | 'pro' | 'enterprise';
}

interface ClientCredentials {
  google_calendar: boolean;
  google_meet: boolean;
  whatsapp: boolean;
  evolution_api: boolean;
  supabase_configured: boolean;
  n8n_configured: boolean;
}

interface AuthContextType {
  user: User | null;
  client: Client | null;
  credentials: ClientCredentials | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateCredentials: (type: string, credentials: any) => Promise<boolean>;
  refreshCredentialFlags: () => Promise<void>;
  updateClient: (clientData: Partial<Client>) => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [credentials, setCredentials] = useState<ClientCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!client;

  // Verificar se já existe uma sessão ativa ao carregar
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_data');
    const savedClient = localStorage.getItem('client_data');
    const savedCredentials = localStorage.getItem('client_credentials');
    
    if (token && savedUser && savedClient) {
      try {
        let userData = JSON.parse(savedUser);
        let clientData = JSON.parse(savedClient);
        
        // Verificar se há dados atualizados do usuário no localStorage
        const updatedUserName = localStorage.getItem('user-name');
        const updatedUserEmail = localStorage.getItem('user-email');
        
        if (updatedUserName) {
          userData.name = updatedUserName;
        }
        if (updatedUserEmail) {
          userData.email = updatedUserEmail;
        }
        
        setUser(userData);
        
        // Verificar se há dados atualizados da empresa no localStorage
        const updatedClientName = localStorage.getItem('client-name');
        const updatedClientEmail = localStorage.getItem('client-email');
        
        if (updatedClientName) {
          clientData.name = updatedClientName;
        }
        if (updatedClientEmail) {
          clientData.email = updatedClientEmail;
        }
        
        setClient(clientData);
        if (savedCredentials) {
          setCredentials(JSON.parse(savedCredentials));
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  // Demo credentials for development/testing
  const demoCredentials = [
    {
      email: 'admin@empresaa.com',
      password: '123456',
      user: {
        id: '1',
        email: 'admin@empresaa.com',
        name: 'Admin Empresa A',
        role: 'admin' as const
      },
      client: {
        id: '1',
        name: 'Empresa A',
        email: 'admin@empresaa.com',
        plan_type: 'enterprise' as const
      }
    },
    {
      email: 'gestor@empresab.com',
      password: 'senha123',
      user: {
        id: '2',
        email: 'gestor@empresab.com',
        name: 'Gestor Empresa B',
        role: 'viewer' as const
      },
      client: {
        id: '2',
        name: 'Empresa B',
        email: 'gestor@empresab.com',
        plan_type: 'pro' as const
      }
    },
    {
      email: 'executivo@empresa.com',
      password: '123456',
      user: {
        id: '3',
        email: 'executivo@empresa.com',
        name: 'Executivo Demo',
        role: 'admin' as const
      },
      client: {
        id: '3',
        name: 'Empresa Demo',
        email: 'executivo@empresa.com',
        plan_type: 'starter' as const
      }
    }
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check demo credentials first
      const demoUser = demoCredentials.find(
        cred => cred.email === email && cred.password === password
      );
      
      if (demoUser) {
        // Generate demo token
        const token = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Demo credentials configuration
        const demoCredentialsConfig: ClientCredentials = {
          google_calendar: true,
          google_meet: true,
          whatsapp: true,
          evolution_api: true,
          supabase_configured: true,
          n8n_configured: true
        };
        
        // Save demo data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(demoUser.user));
        localStorage.setItem('client_data', JSON.stringify(demoUser.client));
        localStorage.setItem('client_credentials', JSON.stringify(demoCredentialsConfig));
        
        // Update state
        setUser(demoUser.user);
        setClient(demoUser.client);
        setCredentials(demoCredentialsConfig);
        
        setIsLoading(false);
        return true;
      }
      
      // If not demo credentials, try API request (fallback for production)
      try {
        const response = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        
        if (response.success) {
          // Salvar token
          localStorage.setItem('auth_token', response.token);
          
          // Salvar dados do usuário
          setUser(response.user);
          localStorage.setItem('user_data', JSON.stringify(response.user));
          
          // Salvar dados do cliente
          setClient(response.client);
          localStorage.setItem('client_data', JSON.stringify(response.client));
          
          // Salvar flags de credenciais
          setCredentials(response.credentials);
          localStorage.setItem('client_credentials', JSON.stringify(response.credentials));
          
          setIsLoading(false);
          return true;
        }
      } catch (apiError) {
        console.log('API unavailable, usando apenas credenciais demo');
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const updateCredentials = async (type: string, newCredentials: any): Promise<boolean> => {
    try {
      // Try API request first (for production backend)
      try {
        await apiRequest(`/credentials/${type}`, {
          method: 'PUT',
          body: JSON.stringify(newCredentials)
        });
        
        // Refresh credential flags after successful update
        await refreshCredentialFlags();
        
        return true;
      } catch (apiError) {
        console.log('API unavailable, using local storage for credentials');
      }
      
      // Fallback to local storage for demo/development
      if (!user || !client) {
        console.error('User or client not logged in');
        return false;
      }
      
      // Save credentials locally per client
      const clientCredentialsKey = `credentials_${client.id}`;
      const existingCredentials = JSON.parse(localStorage.getItem(clientCredentialsKey) || '{}');
      
      // Update specific credential type
      existingCredentials[type] = newCredentials;
      localStorage.setItem(clientCredentialsKey, JSON.stringify(existingCredentials));
      
      // Update credential flags
      const updatedFlags = { ...credentials };
      if (type === 'supabase') {
        updatedFlags.supabase_configured = true;
        // Update Supabase environment variables for immediate use
        if (newCredentials.url && newCredentials.anon_key) {
          (window as any).VITE_SUPABASE_URL = newCredentials.url;
          (window as any).VITE_SUPABASE_ANON_KEY = newCredentials.anon_key;
        }
      } else if (type === 'google_calendar') {
        updatedFlags.google_calendar = true;
        updatedFlags.google_meet = true;
      } else if (type === 'whatsapp') {
        updatedFlags.whatsapp = true;
      } else if (type === 'evolution_api') {
        updatedFlags.evolution_api = true;
      } else if (type === 'n8n') {
        updatedFlags.n8n_configured = true;
      }
      
      setCredentials(updatedFlags);
      localStorage.setItem('client_credentials', JSON.stringify(updatedFlags));
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar credenciais:', error);
      return false;
    }
  };

  const refreshCredentialFlags = async () => {
    try {
      const credentialFlags = await apiRequest('/credentials');
      setCredentials(credentialFlags);
      localStorage.setItem('client_credentials', JSON.stringify(credentialFlags));
    } catch (error) {
      console.error('Erro ao buscar flags de credenciais:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const updateClient = (clientData: Partial<Client>) => {
    if (client) {
      const updatedClient = { ...client, ...clientData };
      setClient(updatedClient);
      localStorage.setItem('client_data', JSON.stringify(updatedClient));
    }
  };

  const logout = () => {
    setUser(null);
    setClient(null);
    setCredentials(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('client_data');
    localStorage.removeItem('client_credentials');
    localStorage.removeItem('user-name');
    localStorage.removeItem('user-email');
    localStorage.removeItem('client-name');
    localStorage.removeItem('client-email');
  };

  const value: AuthContextType = {
    user,
    client,
    credentials,
    isAuthenticated,
    login,
    logout,
    isLoading,
    updateCredentials,
    refreshCredentialFlags,
    updateClient,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};