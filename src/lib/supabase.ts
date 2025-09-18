import { createClient } from '@supabase/supabase-js';

// In Replit, environment variables are injected at runtime
const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for dashboard_completo_v5 table (matches server interface)
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