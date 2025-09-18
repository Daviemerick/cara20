import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Production-safe logging (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('Supabase configuration check:');
  console.log('URL exists:', !!supabaseUrl);
  console.log('Key exists:', !!supabaseAnonKey);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('REACT_APP_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET');
  console.error('REACT_APP_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET');
  throw new Error('Missing Supabase environment variables: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') && !supabaseUrl.startsWith('http://')) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Must start with https:// or http://`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for dashboard_completo_v5 table (actual structure)
export interface DashboardCompleteV5 {
  telefone: string;
  nome_completo: string;
  email_principal: string;
  status_atendimento: string;
  setor_atual: string | null;
  ativo: boolean | null;
  tipo_reuniao_atual: string | null;
  primeiro_contato: string;
  ultimo_contato: string;
  total_registros: number;
  registros_dados_cliente: number;
  total_mensagens_chat: number;
  total_transcricoes: number;
  fontes_dados: number;
  tem_dados_cliente: boolean;
  tem_historico_chat: boolean;
  tem_transcricoes: boolean;
  ultima_atividade: string;
  id_reuniao_atual: string | null;
  ultima_transcricao: string;
  mensagens_cliente: string;
  mensagens_agente: string;
  todas_mensagens_chat?: string;
  primeira_mensagem?: string;
  ultima_mensagem?: string;
  ultima_transcricao_completa?: string;
  ultimo_resumo_estruturado?: string;
}

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    const { error } = await supabase
      .from('dashboard_completo_v5')
      .select('*', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}