import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import HeaderNavigation from '@/components/HeaderNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Calendar, Video, MessageCircle, Zap, CheckCircle, AlertTriangle, Save } from 'lucide-react';

const ClientConfigPage = () => {
  const { credentials, updateCredentials } = useAuth();
  const [activeTab, setActiveTab] = useState('google-calendar');
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const integrations = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      icon: Calendar,
      status: credentials?.google_calendar || false,
      description: 'Integração com Google Calendar para agendamentos'
    },
    {
      id: 'google-meet',
      name: 'Google Meet',
      icon: Video,
      status: credentials?.google_meet || false,
      description: 'Criação automática de links do Google Meet'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: MessageCircle,
      status: credentials?.whatsapp || false,
      description: 'Envio de mensagens pelo WhatsApp'
    },
    {
      id: 'evolution-api',
      name: 'Evolution API',
      icon: Zap,
      status: credentials?.evolution_api || false,
      description: 'API para automação de WhatsApp'
    }
  ];

  const handleSave = async (integrationType: string, formData: any) => {
    setIsLoading(true);
    setSaveMessage('');
    
    try {
      const success = await updateCredentials(integrationType, formData);
      if (success) {
        setSaveMessage('Configurações salvas com sucesso!');
      } else {
        setSaveMessage('Erro ao salvar configurações. Tente novamente.');
      }
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const renderConfigForm = (integration: any) => {
    switch (integration.id) {
      case 'google-calendar':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client_id">Client ID</Label>
              <Input
                id="client_id"
                placeholder="123456789-abcdef.apps.googleusercontent.com"
                data-testid="input-google-client-id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_secret">Client Secret</Label>
              <Input
                id="client_secret"
                type="password"
                placeholder="GOCSPX-example-secret-key"
                data-testid="input-google-client-secret"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calendar_id">Calendar ID</Label>
              <Input
                id="calendar_id"
                placeholder="primary ou email@gmail.com"
                data-testid="input-google-calendar-id"
              />
            </div>
          </div>
        );
      
      case 'google-meet':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meet_client_id">Client ID</Label>
              <Input
                id="meet_client_id"
                placeholder="123456789-abcdef.apps.googleusercontent.com"
                data-testid="input-meet-client-id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meet_client_secret">Client Secret</Label>
              <Input
                id="meet_client_secret"
                type="password"
                placeholder="GOCSPX-example-secret-key"
                data-testid="input-meet-client-secret"
              />
            </div>
          </div>
        );
      
      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number">Número do Telefone</Label>
              <Input
                id="phone_number"
                placeholder="+5511999999999"
                data-testid="input-whatsapp-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                type="password"
                placeholder="wa-api-key-example"
                data-testid="input-whatsapp-api-key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instance_id">Instance ID</Label>
              <Input
                id="instance_id"
                placeholder="my_instance"
                data-testid="input-whatsapp-instance"
              />
            </div>
          </div>
        );
      
      case 'evolution-api':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api_url">API URL</Label>
              <Input
                id="api_url"
                placeholder="https://api.evolutionapi.com"
                data-testid="input-evolution-url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evolution_api_key">API Key</Label>
              <Input
                id="evolution_api_key"
                type="password"
                placeholder="evolution-api-key"
                data-testid="input-evolution-api-key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instance">Instância</Label>
              <Input
                id="instance"
                placeholder="my_evolution_instance"
                data-testid="input-evolution-instance"
              />
            </div>
          </div>
        );
      
      default:
        return <div>Configuração não encontrada</div>;
    }
  };

  const activeIntegration = integrations.find(i => i.id === activeTab);

  return (
    <div className="min-h-screen bg-luxury relative overflow-hidden">
      <HeaderNavigation />
      
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/98 to-muted/3" />
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-0 right-1/3 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <main className="relative z-10 container-luxury py-8 space-y-8 animate-fade-in" style={{ paddingTop: '6rem' }}>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground tracking-tight gradient-text">
            Configurações de Integração
          </h1>
          <p className="text-xl text-muted-foreground/80">
            Configure suas integrações com serviços externos
          </p>
        </div>

        {saveMessage && (
          <Alert className={saveMessage.includes('sucesso') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <AlertDescription className={saveMessage.includes('sucesso') ? 'text-green-800' : 'text-red-800'}>
              {saveMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lista de Integrações */}
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <span>Integrações</span>
              </CardTitle>
              <CardDescription>Selecione uma integração para configurar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {integrations.map((integration) => (
                  <button
                    key={integration.id}
                    onClick={() => setActiveTab(integration.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      activeTab === integration.id
                        ? 'bg-primary/10 border-primary/20 border'
                        : 'bg-muted/20 hover:bg-muted/30'
                    }`}
                    data-testid={`tab-${integration.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <integration.icon className="w-5 h-5" />
                        <span className="font-medium">{integration.name}</span>
                      </div>
                      {integration.status ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Configuração */}
          <Card className="lg:col-span-2 glass-card border-border/20">
            {activeIntegration && (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <activeIntegration.icon className="w-6 h-6 text-primary" />
                      <div>
                        <CardTitle>{activeIntegration.name}</CardTitle>
                        <CardDescription>{activeIntegration.description}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={activeIntegration.status ? 'default' : 'secondary'}
                      className={activeIntegration.status ? 'bg-green-100 text-green-800' : ''}
                    >
                      {activeIntegration.status ? 'Configurado' : 'Não Configurado'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderConfigForm(activeIntegration)}
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleSave(activeIntegration.id, {})}
                      disabled={isLoading}
                      className="flex-1"
                      data-testid="button-save-integration"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Salvando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>Salvar Configuração</span>
                        </div>
                      )}
                    </Button>
                    <Button variant="outline" data-testid="button-test-integration">
                      Testar Conexão
                    </Button>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Importante:</strong> As credenciais são criptografadas e armazenadas com segurança.
                      Certifique-se de que as informações estão corretas antes de salvar.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </>
            )}
          </Card>
        </div>

      </main>
    </div>
  );
};

export default ClientConfigPage;