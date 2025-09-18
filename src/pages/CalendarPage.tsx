import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeaderNavigation from '@/components/HeaderNavigation';
import { Calendar, Clock, Video, Phone, Users, MapPin, Bell } from 'lucide-react';

const CalendarPage = () => {
  const appointments = [
    {
      id: '1',
      title: 'Reunião com Dr. Silva',
      description: 'Discussão sobre novo tratamento',
      date: '2024-01-16',
      time: '09:00',
      duration: 60,
      type: 'video',
      client: 'Dr. João Silva',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Consulta - Maria Santos',
      description: 'Consulta de acompanhamento',
      date: '2024-01-16',
      time: '10:30',
      duration: 45,
      type: 'presential',
      client: 'Maria Santos',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Apresentação - Clínica Vida Nova',
      description: 'Apresentação de novos serviços',
      date: '2024-01-16',
      time: '14:00',
      duration: 90,
      type: 'phone',
      client: 'Clínica Vida Nova',
      status: 'confirmed'
    },
    {
      id: '4',
      title: 'Follow-up - Cliente Premium',
      description: 'Revisão mensal dos resultados',
      date: '2024-01-17',
      time: '11:00',
      duration: 30,
      type: 'video',
      client: 'Cliente Premium',
      status: 'confirmed'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'confirmed') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Confirmado</Badge>;
    }
    if (status === 'pending') {
      return <Badge variant="outline" className="border-orange-300 text-orange-600">Pendente</Badge>;
    }
    return <Badge variant="secondary">Cancelado</Badge>;
  };

  const todayAppointments = appointments.filter(apt => apt.date === '2024-01-16');
  const tomorrowAppointments = appointments.filter(apt => apt.date === '2024-01-17');

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
              Calendário de Reuniões
            </h1>
            <p className="text-xl text-muted-foreground/80">
              Gerencie seus compromissos e reuniões agendadas
            </p>
          </div>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Hoje */}
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Hoje - 16 Janeiro</span>
              </CardTitle>
              <CardDescription>{todayAppointments.length} reuniões agendadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment, index) => (
                  <div key={appointment.id} className="p-4 bg-muted/20 rounded-lg border border-border/10 hover:bg-muted/30 transition-colors" data-testid={`appointment-today-${appointment.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-sm font-medium">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          {getTypeIcon(appointment.type)}
                          <span>{appointment.duration}min</span>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{appointment.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{appointment.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{appointment.client}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" data-testid={`button-edit-${appointment.id}`}>
                          Editar
                        </Button>
                        <Button size="sm" data-testid={`button-join-${appointment.id}`}>
                          {appointment.type === 'video' ? 'Entrar' : 'Ligar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {todayAppointments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma reunião agendada para hoje</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Amanhã */}
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <span>Amanhã - 17 Janeiro</span>
              </CardTitle>
              <CardDescription>{tomorrowAppointments.length} reuniões agendadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tomorrowAppointments.map((appointment, index) => (
                  <div key={appointment.id} className="p-4 bg-muted/20 rounded-lg border border-border/10 hover:bg-muted/30 transition-colors" data-testid={`appointment-tomorrow-${appointment.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-sm font-medium">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          {getTypeIcon(appointment.type)}
                          <span>{appointment.duration}min</span>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{appointment.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{appointment.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{appointment.client}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" data-testid={`button-edit-${appointment.id}`}>
                          Editar
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-reminder-${appointment.id}`}>
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendário do Google */}
        <Card className="glass-card border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Calendário Completo</span>
            </CardTitle>
            <CardDescription>Visualização completa do calendário integrado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden rounded-lg border border-border/20 bg-background shadow-sm">
              <iframe 
                src="https://calendar.google.com/calendar/embed?src=daviemericko04%40gmail.com&ctz=America%2FSao_Paulo"
                className="w-full h-[600px] border-0"
                title="Calendário Google"
                data-testid="google-calendar-iframe"
              ></iframe>
            </div>
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/10">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sincronizado com Google Calendar</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-4"></div>
                <span>Timezone: América/São Paulo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card className="glass-card border-border/20">
          <CardHeader>
            <CardTitle>Estatísticas do Calendário</CardTitle>
            <CardDescription>Resumo dos seus compromissos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-black gradient-text" data-testid="text-total-appointments">
                  {appointments.length}
                </div>
                <div className="text-sm text-muted-foreground">Total de Reuniões</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black gradient-text" data-testid="text-confirmed-appointments">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </div>
                <div className="text-sm text-muted-foreground">Confirmadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black gradient-text" data-testid="text-video-appointments">
                  {appointments.filter(a => a.type === 'video').length}
                </div>
                <div className="text-sm text-muted-foreground">Por Vídeo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black gradient-text" data-testid="text-total-duration">
                  {Math.round(appointments.reduce((sum, a) => sum + a.duration, 0) / 60)}h
                </div>
                <div className="text-sm text-muted-foreground">Duração Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default CalendarPage;