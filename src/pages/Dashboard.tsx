import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeaderNavigation from '@/components/HeaderNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  MessageCircle,
  DollarSign,
  Clock,
  ArrowUpRight,
  Users,
  Calendar,
  Settings,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const { user, client, credentials } = useAuth();
  const navigate = useNavigate();

  // Dados mock para o dashboard
  const metrics = [
    {
      title: 'Conversas Hoje',
      value: '156',
      change: '+23%',
      description: 'vs ontem',
      icon: MessageCircle,
      color: 'text-blue-500'
    },
    {
      title: 'Taxa de Conversão',
      value: '27.4%',
      change: '+12%',
      description: 'vs semana passada',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Receita do Mês',
      value: 'R$ 68.400',
      change: '+89%',
      description: 'vs mês anterior',
      icon: DollarSign,
      color: 'text-secondary'
    },
    {
      title: 'Tempo de Resposta',
      value: '2.3s',
      change: '-15%',
      description: 'média atual',
      icon: Clock,
      color: 'text-primary'
    }
  ];


  const recentActivities = [
    {
      title: 'Nova conversa iniciada',
      description: 'Cliente interessado em consultoria',
      time: '5 min atrás',
      type: 'conversation'
    },
    {
      title: 'Reunião agendada',
      description: 'Reunião com Dr. Silva para amanhã',
      time: '15 min atrás',
      type: 'calendar'
    },
    {
      title: 'Pagamento recebido',
      description: 'R$ 2.500 do cliente Premium',
      time: '1 hora atrás',
      type: 'payment'
    },
    {
      title: 'Novo lead qualificado',
      description: 'Lead com alto potencial identificado',
      time: '2 horas atrás',
      type: 'lead'
    }
  ];

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
        
        {/* Welcome Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight gradient-text">
              Bem-vindo, {user?.name}
            </h1>
            <p className="text-xl text-muted-foreground/80 mt-2">
              Dashboard executivo para {client?.name}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-3 py-1">
              <Shield className="w-3 h-3 mr-1" />
              Plano {client?.plan_type?.toUpperCase()}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              {user?.role === 'admin' ? 'Administrador' : 'Visualizador'}
            </Badge>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="glass-card border-border/20 hover:shadow-luxury transition-elegant" data-testid={`card-metric-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black gradient-text mb-1" data-testid={`text-metric-value-${index}`}>{metric.value}</div>
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">{metric.change}</span>
                  <span className="text-xs text-muted-foreground">{metric.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Atividades Recentes */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Atividades Recentes */}
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-secondary" />
                <span>Atividades Recentes</span>
              </CardTitle>
              <CardDescription>Últimas ações no seu sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors" data-testid={`activity-${index}`}>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {activity.type === 'conversation' && <MessageCircle className="w-4 h-4 text-primary" />}
                      {activity.type === 'calendar' && <Calendar className="w-4 h-4 text-primary" />}
                      {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-primary" />}
                      {activity.type === 'lead' && <Users className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-card border-border/20">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse as principais funcionalidades do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2" variant="outline" data-testid="button-analysis" onClick={() => navigate('/analise')}>
                <BarChart3 className="w-6 h-6" />
                <span>Ver Análises</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" data-testid="button-clients" onClick={() => navigate('/clients')}>
                <Users className="w-6 h-6" />
                <span>Gerenciar Clientes</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" data-testid="button-calendar" onClick={() => navigate('/calendar')}>
                <Calendar className="w-6 h-6" />
                <span>Calendário</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline" data-testid="button-settings" onClick={() => navigate('/settings')}>
                <Settings className="w-6 h-6" />
                <span>Configurações</span>
              </Button>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default Dashboard;