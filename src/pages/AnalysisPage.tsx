import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import HeaderNavigation from "@/components/HeaderNavigation";
import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  MessageCircle,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Users,
  Calendar,
  Filter,
  Download
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell,
  PieChart,
  Pie
} from "recharts";

const AnalysisPage = () => {
  const { toast } = useToast();
  
  // Estados para controle de filtros e período
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    showConversations: true,
    showRevenue: true,
    showMetrics: true,
    showClients: true,
    showKeywords: true,
    showAIPerformance: true
  });

  // Função para converter período em multiplicador de dados
  const getDataForPeriod = (period: string) => {
    const multipliers = {
      "7days": 0.25,
      "30days": 1,
      "90days": 2.5,
      "year": 12
    };
    return multipliers[period as keyof typeof multipliers] || 1;
  };

  // Função para exportar dados para CSV
  const handleExport = () => {
    const currentMultiplier = getDataForPeriod(selectedPeriod);
    const exportData = [
      ['Período', getPeriodLabel(selectedPeriod)],
      ['Conversas Atendidas', Math.round(1247 * currentMultiplier).toLocaleString('pt-BR')],
      ['Taxa de Conversão', '27.4%'],
      ['Receita Gerada', (68400 * currentMultiplier).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
      ['Tempo Resposta Médio', '2.3s']
    ];

    const csvContent = exportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `analise-executiva-${selectedPeriod}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Dados Exportados",
      description: `Arquivo CSV baixado com dados do período: ${getPeriodLabel(selectedPeriod)}`
    });
  };

  // Função para obter label do período
  const getPeriodLabel = (period: string) => {
    const labels = {
      "7days": "Últimos 7 dias",
      "30days": "Últimos 30 dias", 
      "90days": "Últimos 90 dias",
      "year": "Este ano"
    };
    return labels[period as keyof typeof labels] || "Período desconhecido";
  };

  // Função para aplicar filtros
  const handleApplyFilters = (newFilters: typeof appliedFilters) => {
    setAppliedFilters(newFilters);
    setIsFiltersOpen(false);
    toast({
      title: "Filtros Aplicados",
      description: "Os dados foram atualizados conforme os filtros selecionados."
    });
  };

  // Calcular dados dinâmicos baseado no período atual
  const currentMultiplier = getDataForPeriod(selectedPeriod);
  
  // Dados temporários para garantir funcionamento
  const executiveMetrics = [
    {
      title: "Conversas Atendidas",
      value: Math.round(1247 * currentMultiplier).toLocaleString('pt-BR'),
      change: "+23%",
      changeType: "increase" as const,
      description: "vs período anterior",
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      title: "Taxa de Conversão",
      value: "27.4%",
      change: "+12%",
      changeType: "increase" as const, 
      description: "vs período anterior",
      icon: Target,
      color: "text-green-500"
    },
    {
      title: "Receita Gerada",
      value: (68400 * currentMultiplier).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }),
      change: "+89%",
      changeType: "increase" as const,
      description: "vs período anterior", 
      icon: DollarSign,
      color: "text-secondary"
    },
    {
      title: "Tempo Resposta Médio",
      value: "2.3s",
      change: "-15%",
      changeType: "decrease" as const,
      description: "vs período anterior",
      icon: Clock,
      color: "text-primary"
    }
  ];

  const conversationData = [
    { date: '01', conversations: Math.round(42 * currentMultiplier), conversions: Math.round(11 * currentMultiplier) },
    { date: '05', conversations: Math.round(48 * currentMultiplier), conversions: Math.round(13 * currentMultiplier) },
    { date: '10', conversations: Math.round(45 * currentMultiplier), conversions: Math.round(12 * currentMultiplier) },
    { date: '15', conversations: Math.round(52 * currentMultiplier), conversions: Math.round(15 * currentMultiplier) },
    { date: '20', conversations: Math.round(38 * currentMultiplier), conversions: Math.round(10 * currentMultiplier) },
    { date: '25', conversations: Math.round(55 * currentMultiplier), conversions: Math.round(16 * currentMultiplier) },
    { date: '30', conversations: Math.round(49 * currentMultiplier), conversions: Math.round(14 * currentMultiplier) }
  ];

  const funnelData = [
    { name: 'Leads Recebidos', value: Math.round(1247 * currentMultiplier), percentage: 100 },
    { name: 'Respostas Automáticas', value: Math.round(1189 * currentMultiplier), percentage: 95.3 },
    { name: 'Interesse Demonstrado', value: Math.round(487 * currentMultiplier), percentage: 39.0 },
    { name: 'Agendamentos', value: Math.round(342 * currentMultiplier), percentage: 27.4 },
    { name: 'Reuniões Confirmadas', value: Math.round(274 * currentMultiplier), percentage: 22.0 }
  ];

  const revenueData = [
    { month: 'Jul', revenue: Math.round(45200 * currentMultiplier) },
    { month: 'Ago', revenue: Math.round(52800 * currentMultiplier) },
    { month: 'Set', revenue: Math.round(48100 * currentMultiplier) },
    { month: 'Out', revenue: Math.round(67300 * currentMultiplier) },
    { month: 'Nov', revenue: Math.round(71200 * currentMultiplier) },
    { month: 'Dez', revenue: Math.round(68400 * currentMultiplier) }
  ];

  const aiPerformance = {
    precision: 94.7,
    responseTime: 2.3,
    uptime: 99.8,
    satisfaction: 4.6
  };

  const topClients = [
    { rank: 1, name: 'Empresa Alpha', revenue: Math.round(12400 * currentMultiplier), conversations: Math.round(89 * currentMultiplier) },
    { rank: 2, name: 'Beta Solutions', revenue: Math.round(11200 * currentMultiplier), conversations: Math.round(76 * currentMultiplier) },
    { rank: 3, name: 'Gamma Corp', revenue: Math.round(9800 * currentMultiplier), conversations: Math.round(65 * currentMultiplier) },
    { rank: 4, name: 'Delta Industries', revenue: Math.round(8900 * currentMultiplier), conversations: Math.round(58 * currentMultiplier) },
    { rank: 5, name: 'Epsilon Ltd', revenue: Math.round(7600 * currentMultiplier), conversations: Math.round(52 * currentMultiplier) },
    { rank: 6, name: 'Zeta Group', revenue: Math.round(6800 * currentMultiplier), conversations: Math.round(47 * currentMultiplier) },
    { rank: 7, name: 'Eta Enterprises', revenue: Math.round(5900 * currentMultiplier), conversations: Math.round(41 * currentMultiplier) },
    { rank: 8, name: 'Theta Partners', revenue: Math.round(5200 * currentMultiplier), conversations: Math.round(38 * currentMultiplier) },
    { rank: 9, name: 'Iota Holdings', revenue: Math.round(4700 * currentMultiplier), conversations: Math.round(34 * currentMultiplier) },
    { rank: 10, name: 'Kappa Systems', revenue: Math.round(4100 * currentMultiplier), conversations: Math.round(29 * currentMultiplier) }
  ];

  const keywordsData = [
    { keyword: 'consulta', count: Math.round(234 * currentMultiplier) },
    { keyword: 'agendamento', count: Math.round(198 * currentMultiplier) },
    { keyword: 'preço', count: Math.round(156 * currentMultiplier) },
    { keyword: 'horário', count: Math.round(134 * currentMultiplier) },
    { keyword: 'disponibilidade', count: Math.round(112 * currentMultiplier) },
    { keyword: 'orçamento', count: Math.round(89 * currentMultiplier) },
    { keyword: 'tratamento', count: Math.round(67 * currentMultiplier) },
    { keyword: 'consulta online', count: Math.round(45 * currentMultiplier) },
    { keyword: 'primeira consulta', count: Math.round(34 * currentMultiplier) },
    { keyword: 'emergência', count: Math.round(23 * currentMultiplier) }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-luxury relative overflow-hidden">
      {/* Header Navigation */}
      <HeaderNavigation />
      
      {/* Luxury Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/98 to-muted/3" />
      
      {/* Premium Ambient Lights */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-0 right-1/3 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <main className="relative z-10 container-luxury py-8 space-y-8 animate-fade-in" style={{ paddingTop: '6rem' }}>
        
        {/* Header da Página */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground tracking-tight gradient-text">
              Análise Executiva
            </h1>
            <p className="text-xl text-muted-foreground/80">
              Métricas avançadas e insights estratégicos do seu negócio
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40" data-testid="select-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                <SelectItem value="30days">Últimos 30 dias</SelectItem>
                <SelectItem value="90days">Últimos 90 dias</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-filters">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filtros Avançados</DialogTitle>
                  <DialogDescription>
                    Selecione quais seções deseja exibir no relatório
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="conversations"
                      checked={appliedFilters.showConversations}
                      onCheckedChange={(checked) => 
                        setAppliedFilters(prev => ({...prev, showConversations: !!checked}))
                      }
                    />
                    <Label htmlFor="conversations">Conversas por Dia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="revenue"
                      checked={appliedFilters.showRevenue}
                      onCheckedChange={(checked) => 
                        setAppliedFilters(prev => ({...prev, showRevenue: !!checked}))
                      }
                    />
                    <Label htmlFor="revenue">Receita por Mês</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="metrics"
                      checked={appliedFilters.showMetrics}
                      onCheckedChange={(checked) => 
                        setAppliedFilters(prev => ({...prev, showMetrics: !!checked}))
                      }
                    />
                    <Label htmlFor="metrics">Métricas Executivas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="clients"
                      checked={appliedFilters.showClients}
                      onCheckedChange={(checked) => 
                        setAppliedFilters(prev => ({...prev, showClients: !!checked}))
                      }
                    />
                    <Label htmlFor="clients">Top 10 Clientes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="keywords"
                      checked={appliedFilters.showKeywords}
                      onCheckedChange={(checked) => 
                        setAppliedFilters(prev => ({...prev, showKeywords: !!checked}))
                      }
                    />
                    <Label htmlFor="keywords">Palavras-chave</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="aiperformance"
                      checked={appliedFilters.showAIPerformance}
                      onCheckedChange={(checked) => 
                        setAppliedFilters(prev => ({...prev, showAIPerformance: !!checked}))
                      }
                    />
                    <Label htmlFor="aiperformance">Performance da IA</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsFiltersOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => handleApplyFilters(appliedFilters)} data-testid="button-apply-filters">
                    Aplicar Filtros
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="default" size="sm" onClick={handleExport} data-testid="button-export">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Métricas Executivas - 4 Cards */}
        {appliedFilters.showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {executiveMetrics.map((metric, index) => (
            <Card key={index} className="glass-card border-border/20 hover:shadow-luxury transition-elegant">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black gradient-text mb-1">{metric.value}</div>
                <div className="flex items-center space-x-1">
                  {metric.changeType === 'increase' ? (
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-green-500" />
                  )}
                  <span className="text-xs text-green-500 font-medium">{metric.change}</span>
                  <span className="text-xs text-muted-foreground">{metric.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* Gráficos Principais - Grid 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Conversas por Dia */}
          {appliedFilters.showConversations && (
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Conversas por Dia</span>
              </CardTitle>
              <CardDescription>Evolução diária das conversas nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={conversationData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversations" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          )}

          {/* Funil de Conversão */}
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-secondary" />
                <span>Funil de Conversão</span>
              </CardTitle>
              <CardDescription>Processo de conversão de leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelData.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{stage.name}</span>
                      <span className="text-muted-foreground">{stage.value} ({stage.percentage}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Receita por Mês */}
          {appliedFilters.showRevenue && (
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-secondary" />
                <span>Receita por Mês</span>
              </CardTitle>
              <CardDescription>Evolução da receita nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Receita']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          )}

          {/* Performance da IA */}
          {appliedFilters.showAIPerformance && (
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Performance da IA</span>
              </CardTitle>
              <CardDescription>Métricas de desempenho do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20"></div>
                    <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-black gradient-text">{aiPerformance.precision}%</div>
                        <div className="text-xs text-muted-foreground">Precisão</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">{aiPerformance.responseTime}s</div>
                    <div className="text-xs text-muted-foreground">Tempo</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-secondary">{aiPerformance.uptime}%</div>
                    <div className="text-xs text-muted-foreground">Uptime</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{aiPerformance.satisfaction}/5</div>
                    <div className="text-xs text-muted-foreground">Satisfação</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          )}
        </div>

        {/* Análise Avançada - Grid 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top 10 Clientes */}
          {appliedFilters.showClients && (
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Top 10 Clientes</span>
              </CardTitle>
              <CardDescription>Ranking por conversas e receita</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                        {client.rank}
                      </Badge>
                      <span className="font-medium">{client.name}</span>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold">{formatCurrency(client.revenue)}</div>
                      <div className="text-muted-foreground">{client.conversations} conversas</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          )}

          {/* Palavras-chave Mais Usadas */}
          {appliedFilters.showKeywords && (
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-secondary" />
                <span>Palavras-chave Mais Usadas</span>
              </CardTitle>
              <CardDescription>Termos mais frequentes nas conversas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keywordsData.slice(0, 8).map((keyword, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{keyword.keyword}</span>
                      <span className="text-muted-foreground">{keyword.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(keyword.count / keywordsData[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          )}
        </div>

      </main>
    </div>
  );
};

export default AnalysisPage;