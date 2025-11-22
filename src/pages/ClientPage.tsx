import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeaderNavigation from '@/components/HeaderNavigation';
import { useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, DollarSign, MessageCircle, Clock, User, Activity, Database, FileText, CheckCircle, XCircle, AlertCircle, Video, Bot, UserIcon, FileAudio, ClipboardList, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import completeClientData from '@/data/completeClientData.json';

const ClientPage = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dados completos dos clientes baseados no JSON fornecido
  const clients = completeClientData.map((client, index) => ({
    ...client,
    id: String(client.idx + 1),
    // Campos para compatibilidade com a UI existente
    name: client.nome_completo,
    email: client.email_principal,
    phone: client.telefone.replace('@s.whatsapp.net', '').replace('55', '+55 '),
    status: client.status_atendimento === 'pause' ? 'active' : client.status_atendimento,
    lastContact: new Date(client.ultimo_contato).toISOString().split('T')[0],
    totalRevenue: Math.floor(Math.random() * 20000) + 5000, // Valor fictício para compatibilidade
    conversationsCount: client.total_mensagens_chat,
    plan: ['Premium', 'Standard', 'Enterprise'][index % 3]
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Ativo</Badge>;
    }
    return <Badge variant="secondary">Inativo</Badge>;
  };

  const getAttendanceStatusBadge = (status: string) => {
    const statusMap = {
      'active': { label: 'Ativo', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      'pause': { label: 'Pausado', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      'waiting': { label: 'Aguardando', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      'inactive': { label: 'Inativo', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' }
    };
    
    const config = statusMap[status] || statusMap['inactive'];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const openClientDetails = (client: any) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  // Função para formatar as mensagens no estilo WhatsApp usando o campo correto
  const formatWhatsAppMessages = (selectedClient: any) => {
    if (!selectedClient.todas_mensagens_chat) return [];
    
    const messages = [];
    const rawMessages = selectedClient.todas_mensagens_chat.split('\n\n---\n\n');
    
    rawMessages.forEach((message: string, index: number) => {
      if (message.trim()) {
        // Verificar se é mensagem do cliente (👤) ou agente (🤖)
        const isClient = message.includes('👤');
        const isAgent = message.includes('🤖');
        
        // Limpar emojis e espaços extras
        const cleanMessage = message.replace(/[👤🤖]\s*/, '').trim();
        
        if (cleanMessage && (isClient || isAgent)) {
          messages.push({
            id: index,
            text: cleanMessage,
            isClient: isClient,
            timestamp: new Date(Date.now() - (1000 * 60 * (rawMessages.length - index))).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            sender: isClient ? 'Cliente' : 'Agente AI',
            originalOrder: index
          });
        }
      }
    });
    
    // Manter a ordem original (cronológica)
    return messages.sort((a, b) => a.originalOrder - b.originalOrder);
  };

  // Função para truncar texto longo
  const truncateText = (text: string, limit: number) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-luxury relative overflow-hidden">
      <HeaderNavigation />
      
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/98 to-muted/3" />
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-0 right-1/3 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <main className="relative z-10 container-luxury py-8 space-y-8 animate-fade-in" style={{ paddingTop: '6rem' }}>
        
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground tracking-tight gradient-text">
              Gerenciamento de Clientes
            </h1>
            <p className="text-xl text-muted-foreground/80">
              Visualize e gerencie seus clientes de forma eficiente
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client, index) => (
            <Card key={client.id} className="glass-card border-border/20 hover:shadow-luxury transition-elegant" data-testid={`card-client-${client.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">{client.name}</CardTitle>
                  {getStatusBadge(client.status)}
                </div>
                <CardDescription className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <DollarSign className="w-5 h-5 mx-auto text-primary mb-1" />
                      <div className="text-sm font-bold" data-testid={`text-revenue-${client.id}`}>
                        {formatCurrency(client.totalRevenue)}
                      </div>
                      <div className="text-xs text-muted-foreground">Receita Total</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/5 rounded-lg">
                      <MessageCircle className="w-5 h-5 mx-auto text-secondary mb-1" />
                      <div className="text-sm font-bold" data-testid={`text-conversations-${client.id}`}>
                        {client.conversationsCount}
                      </div>
                      <div className="text-xs text-muted-foreground">Conversas</div>
                    </div>
                  </div>
                  
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Plano: <span className="font-medium">{client.plan}</span></span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{client.lastContact}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="w-full" onClick={() => openClientDetails(client)} data-testid={`button-view-${client.id}`}>
                        Ver Detalhes
                      </Button>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/labels/${client.id}`)}
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir
                      </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-card border-border/20">
          <CardHeader>
            <CardTitle>Resumo dos Clientes</CardTitle>
            <CardDescription>Estatísticas gerais da sua base de clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-black gradient-text" data-testid="text-total-clients">{clients.length}</div>
                <div className="text-sm text-muted-foreground">Total de Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black gradient-text" data-testid="text-active-clients">
                  {clients.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Clientes Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black gradient-text" data-testid="text-total-revenue">
                  {formatCurrency(clients.reduce((sum, c) => sum + c.totalRevenue, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Receita Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black gradient-text" data-testid="text-total-conversations">
                  {clients.reduce((sum, c) => sum + c.conversationsCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total de Conversas</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>

      {/* Modal Detalhado do Cliente */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" aria-describedby="client-details-description">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">
              Detalhes Completos do Cliente
            </DialogTitle>
            <p id="client-details-description" className="text-sm text-muted-foreground">
              Visualização completa dos dados do cliente, incluindo conversações, transcrições e resumos estruturados
            </p>
          </DialogHeader>
          
          {selectedClient && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              
              {/* Informações Pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Informações Pessoais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Nome Completo:</span>
                    <span className="text-muted-foreground">{selectedClient.nome_completo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email Principal:</span>
                    <span className="text-muted-foreground">{selectedClient.email_principal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Telefone:</span>
                    <span className="text-muted-foreground">{selectedClient.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status:</span>
                    {getAttendanceStatusBadge(selectedClient.status_atendimento)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Ativo:</span>
                    {selectedClient.ativo ? 
                      <CheckCircle className="w-5 h-5 text-green-500" /> : 
                      <XCircle className="w-5 h-5 text-red-500" />
                    }
                  </div>
                </CardContent>
              </Card>

              {/* Informações de Contato */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Histórico de Contato</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Primeiro Contato:</span>
                    <span className="text-muted-foreground">{formatDateTime(selectedClient.primeiro_contato)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Último Contato:</span>
                    <span className="text-muted-foreground">{formatDateTime(selectedClient.ultimo_contato)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Última Atividade:</span>
                    <span className="text-muted-foreground">{formatDateTime(selectedClient.ultima_atividade)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Setor Atual:</span>
                    <span className="text-muted-foreground">{selectedClient.setor_atual || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Informações de Reunião */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>Informações de Reunião</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Tipo de Reunião Atual:</span>
                    <span className="text-muted-foreground">{selectedClient.tipo_reuniao_atual || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ID Reunião Atual:</span>
                    <span className="text-muted-foreground text-xs">{selectedClient.id_reuniao_atual || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Última Transcrição:</span>
                    <span className="text-muted-foreground">{formatDateTime(selectedClient.ultima_transcricao)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas de Atividade */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Estatísticas de Atividade</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total de Registros:</span>
                    <Badge variant="outline">{selectedClient.total_registros}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Registros Dados Cliente:</span>
                    <Badge variant="outline">{selectedClient.registros_dados_cliente}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Mensagens no Chat:</span>
                    <Badge variant="outline">{selectedClient.total_mensagens_chat}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Transcrições:</span>
                    <Badge variant="outline">{selectedClient.total_transcricoes}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Fontes de Dados:</span>
                    <Badge variant="outline">{selectedClient.fontes_dados}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Flags de Dados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Disponibilidade de Dados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tem Dados Cliente:</span>
                    {selectedClient.tem_dados_cliente ? 
                      <CheckCircle className="w-5 h-5 text-green-500" /> : 
                      <XCircle className="w-5 h-5 text-red-500" />
                    }
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tem Histórico Chat:</span>
                    {selectedClient.tem_historico_chat ? 
                      <CheckCircle className="w-5 h-5 text-green-500" /> : 
                      <XCircle className="w-5 h-5 text-red-500" />
                    }
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tem Transcrições:</span>
                    {selectedClient.tem_transcricoes ? 
                      <CheckCircle className="w-5 h-5 text-green-500" /> : 
                      <XCircle className="w-5 h-5 text-red-500" />
                    }
                  </div>
                </CardContent>
              </Card>

              {/* Conversação Completa Estilo WhatsApp */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Conversação Completa</span>
                    <Badge variant="outline">{selectedClient.total_mensagens_chat} mensagens</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 p-4 rounded-lg border">
                    {selectedClient && selectedClient.todas_mensagens_chat ? (
                      <div className="space-y-4">
                        {formatWhatsAppMessages(selectedClient).map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.isClient ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                                message.isClient
                                  ? 'bg-blue-500 text-white rounded-br-none border-blue-600'
                                  : 'bg-green-500 text-white rounded-bl-none border-green-600'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  {message.isClient ? (
                                    <UserIcon className="w-4 h-4 text-blue-100" />
                                  ) : (
                                    <Bot className="w-4 h-4 text-green-100" />
                                  )}
                                  <span className={`text-xs font-medium ${
                                    message.isClient ? 'text-blue-100' : 'text-green-100'
                                  }`}>
                                    {message.sender}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {truncateText(message.text, 300)}
                                  </p>
                                  <p className={`text-xs mt-2 opacity-75 ${
                                    message.isClient ? 'text-blue-100' : 'text-green-100'
                                  }`}>
                                    {message.timestamp}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30" />
                        <p>Nenhuma conversação disponível</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Primeira e Última Mensagem */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card className="border border-blue-200 dark:border-blue-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Primeira Mensagem</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground">
                          {truncateText(selectedClient.primeira_mensagem || 'N/A', 150)}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-green-200 dark:border-green-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Última Mensagem</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground">
                          {truncateText(selectedClient.ultima_mensagem || 'N/A', 150)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Transcrição Completa */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileAudio className="w-5 h-5" />
                    <span>Transcrição Completa</span>
                    <Badge variant="outline">{selectedClient.total_transcricoes} transcrições</Badge>
                  </CardTitle>
                  <CardDescription>Data da última transcrição: {formatDateTime(selectedClient.ultima_transcricao)}</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedClient.ultima_transcricao_completa ? (
                    <div className="max-h-64 overflow-y-auto bg-muted/30 p-4 rounded-lg border">
                      <pre className="text-xs whitespace-pre-wrap text-foreground">
                        {selectedClient.ultima_transcricao_completa}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileAudio className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30" />
                      <p>Nenhuma transcrição disponível</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resumo Estruturado */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="w-5 h-5" />
                    <span>Resumo Estruturado</span>
                  </CardTitle>
                  <CardDescription>Análise estruturada da última interação</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedClient.ultimo_resumo_estruturado ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
                        <div className="prose prose-sm max-w-none">
                          <pre className="text-sm whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                            {selectedClient.ultimo_resumo_estruturado}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ClipboardList className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30" />
                      <p>Nenhum resumo estruturado disponível</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ClientPage;