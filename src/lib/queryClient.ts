import { QueryClient } from '@tanstack/react-query';

// Cliente para requisições da API
export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers
    },
    ...options
  };

  const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';
  const response = await fetch(`${baseURL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || 'Erro na requisição');
  }
  
  return response.json();
};

// Cliente React Query configurado
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const endpoint = queryKey[0] as string;
        return apiRequest(endpoint);
      },
      retry: (failureCount, error) => {
        // Não retentar em erros de autenticação
        if (error?.message?.includes('401') || error?.message?.includes('Token')) {
          return false;
        }
        return failureCount < 3;
      }
    }
  }
});