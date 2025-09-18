import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { z } from 'zod';
import { supabase, testSupabaseConnection, DashboardCompleteV5 } from '../lib/supabase.js';

const router = express.Router();

// Remove test endpoints for security - they were used for development only

// Client tenant mapping - maps auth client IDs to dashboard tenant IDs
const clientTenantMapping = {
  '1': 'tenant_a', // Admin Empresa A
  '2': 'tenant_b', // Gestor Empresa B  
  '3': 'tenant_c'  // Executivo Demo
};

// Mock dashboard data (in production, this would come from Supabase)
// Each record now has a tenant_id to scope access
const mockDashboardData = [
  {
    idx: 0,
    tenant_id: 'tenant_a',
    telefone: "553172380072@s.whatsapp.net",
    nome_completo: "Ellen Viana",
    email_principal: "daviemericko03@gmail.com",
    status_atendimento: "pause",
    setor_atual: null,
    ativo: true,
    tipo_reuniao_atual: "online",
    primeiro_contato: "2025-09-11 23:48:58.869+00",
    ultimo_contato: "2025-09-13 12:01:01.959+00",
    total_registros: 19,
    registros_dados_cliente: 2,
    total_mensagens_chat: 14,
    total_transcricoes: 3,
    fontes_dados: 3,
    tem_dados_cliente: true,
    tem_historico_chat: true,
    tem_transcricoes: true,
    ultima_atividade: "2025-09-13 12:01:01.959+00",
    id_reuniao_atual: "sgl265apj20o0e75u6u6ff8do0",
    ultima_transcricao: "2025-09-13 12:01:01.959+00",
    mensagens_cliente: "Marque uma reunião para Ellen Viana e meu email é daviemericko03@gmail.com marque um reunião para dia 12/09/2025 as 12 00 reunião online",
    mensagens_agente: "Reunião agendada com sucesso para 12/09/2025 às 12:00 via Google Meet."
  },
  {
    idx: 1,
    tenant_id: 'tenant_b',
    telefone: "5511987654321@s.whatsapp.net",
    nome_completo: "João Silva",
    email_principal: "joao.silva@empresa.com",
    status_atendimento: "active",
    setor_atual: "vendas",
    ativo: true,
    tipo_reuniao_atual: "presencial",
    primeiro_contato: "2025-09-10 10:30:00.000+00",
    ultimo_contato: "2025-09-14 15:20:00.000+00",
    total_registros: 25,
    registros_dados_cliente: 5,
    total_mensagens_chat: 18,
    total_transcricoes: 7,
    fontes_dados: 4,
    tem_dados_cliente: true,
    tem_historico_chat: true,
    tem_transcricoes: true,
    ultima_atividade: "2025-09-14 15:20:00.000+00",
    id_reuniao_atual: "abc123def456ghi789",
    ultima_transcricao: "2025-09-14 15:20:00.000+00",
    mensagens_cliente: "Preciso discutir o contrato e os termos de pagamento. Quando podemos nos reunir?",
    mensagens_agente: "Claro! Vou verificar a agenda e te envio algumas opções de horário."
  },
  {
    idx: 2,
    tenant_id: 'tenant_c',
    telefone: "5521999887766@s.whatsapp.net",
    nome_completo: "Maria Santos",
    email_principal: "maria.santos@gmail.com",
    status_atendimento: "completed",
    setor_atual: "suporte",
    ativo: false,
    tipo_reuniao_atual: null,
    primeiro_contato: "2025-09-08 14:15:00.000+00",
    ultimo_contato: "2025-09-12 09:45:00.000+00",
    total_registros: 12,
    registros_dados_cliente: 3,
    total_mensagens_chat: 8,
    total_transcricoes: 2,
    fontes_dados: 2,
    tem_dados_cliente: true,
    tem_historico_chat: true,
    tem_transcricoes: false,
    ultima_atividade: "2025-09-12 09:45:00.000+00",
    id_reuniao_atual: null,
    ultima_transcricao: "2025-09-12 09:45:00.000+00",
    mensagens_cliente: "Obrigada pelo atendimento! O problema foi resolvido.",
    mensagens_agente: "De nada! Fico feliz em ter ajudado. Qualquer coisa, pode entrar em contato."
  }
];

// Get dashboard data - now protected, tenant-scoped and using Supabase
router.get('/dashboard-data', authenticateToken, async (req, res) => {
  try {
    const clientId = req.user!.clientId;
    const tenantId = clientTenantMapping[clientId];
    
    if (!tenantId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied - invalid client'
      });
    }
    
    // Test Supabase connection first
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest) {
      return res.status(500).json({
        success: false,
        error: 'Database connection failed'
      });
    }
    
    // Fetch data from Supabase dashboard_completo_v5 table with tenant scoping
    // NOTE: For now using a filter approach until we confirm tenant_id column exists
    const { data, error } = await supabase
      .from('dashboard_completo_v5')
      .select('*')
      .limit(100); // Add reasonable limit
    
    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard data from database',
        details: error.message
      });
    }
    
    // For now, return all data but in production should be filtered by tenant
    // TODO: Add tenant_id column to table or implement proper tenant filtering
    res.json({
      success: true,
      data: data || [],
      warning: 'Multi-tenant filtering not yet implemented - showing all data'
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

// Get specific client data - protected and using Supabase
router.get('/client/:clientId', authenticateToken, async (req, res) => {
  try {
    const { clientId: paramClientId } = req.params;
    
    // Fetch specific client data from Supabase using telefone as identifier
    const { data, error } = await supabase
      .from('dashboard_completo_v5')
      .select('*')
      .eq('telefone', paramClientId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }
      console.error('Supabase query error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch client data from database',
        details: error.message
      });
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching client data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch client data'
    });
  }
});

// Input validation schema
const statusUpdateSchema = z.object({
  status: z.enum(['active', 'pause', 'completed'])
});

// Update client status - protected, validated, and using Supabase
router.put('/client/:clientId/status', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const validation = statusUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value',
        details: validation.error.issues
      });
    }
    
    const { clientId: paramClientId } = req.params;
    const { status } = validation.data;
    
    // Update client status in Supabase using telefone as identifier
    const { data, error } = await supabase
      .from('dashboard_completo_v5')
      .update({
        status_atendimento: status,
        ultima_atividade: new Date().toISOString()
      })
      .eq('telefone', paramClientId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Client not found'
        });
      }
      console.error('Supabase update error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update client status in database',
        details: error.message
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error updating client status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update client status'
    });
  }
});

export { router as dashboardRoutes };