import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import HeaderNavigation from '@/components/HeaderNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, User, Shield } from 'lucide-react';
import { useState } from 'react';

const SettingsPage = () => {
  const { user, client, updateClient, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [companyForm, setCompanyForm] = useState({
    name: client?.name || '',
    email: client?.email || ''
  });
  
  const handleSaveProfile = () => {
    // Atualizar o contexto de autenticação com os novos dados do usuário
    updateUser(profileForm);
    localStorage.setItem('user-name', profileForm.name);
    localStorage.setItem('user-email', profileForm.email);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleSaveCompany = () => {
    // Atualizar o contexto de autenticação com os novos dados da empresa
    updateClient(companyForm);
    localStorage.setItem('client-name', companyForm.name);
    localStorage.setItem('client-email', companyForm.email);
    
    toast({
      title: "Empresa atualizada",
      description: "As informações da empresa foram salvas com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-luxury relative overflow-hidden">
      <HeaderNavigation />
      
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/98 to-muted/3" />
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-0 right-1/3 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <main className="relative z-10 container-luxury py-8 space-y-8 animate-fade-in" style={{ paddingTop: '6rem' }}>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground tracking-tight gradient-text">
            Configurações
          </h1>
          <p className="text-xl text-muted-foreground/80">
            Gerencie suas preferências e configurações do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Perfil do Usuário */}
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Perfil do Usuário</span>
              </CardTitle>
              <CardDescription>Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  placeholder="Seu nome" 
                  data-testid="input-name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  placeholder="seu@email.com" 
                  data-testid="input-email" 
                />
              </div>
              <div className="flex items-center space-x-4">
                <Label>Função:</Label>
                <Badge variant="secondary" data-testid="badge-role">
                  {user?.role === 'admin' ? 'Administrador' : 'Visualizador'}
                </Badge>
              </div>
              <Button className="w-full" onClick={handleSaveProfile} data-testid="button-save-profile">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>


          {/* Informações da Empresa */}
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Informações da Empresa</span>
              </CardTitle>
              <CardDescription>Detalhes da sua organização</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Empresa</Label>
                <Input 
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                  placeholder="Nome da sua empresa"
                  data-testid="input-company-name" 
                />
              </div>
              <div className="space-y-2">
                <Label>Email da Empresa</Label>
                <Input 
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                  placeholder="email@empresa.com"
                  data-testid="input-company-email" 
                />
              </div>
              <div className="flex items-center space-x-4">
                <Label>Plano:</Label>
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white" data-testid="badge-plan">
                  {client?.plan_type?.toUpperCase()}
                </Badge>
              </div>
              <Button className="w-full" onClick={handleSaveCompany} data-testid="button-save-company">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Configurações do Sistema */}
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-secondary" />
                <span>Configurações do Sistema</span>
              </CardTitle>
              <CardDescription>Configurações gerais da aplicação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo escuro</Label>
                  <p className="text-sm text-muted-foreground">Ativar tema escuro da interface</p>
                </div>
                <Switch data-testid="switch-dark-mode" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Salvamento automático</Label>
                  <p className="text-sm text-muted-foreground">Salvar alterações automaticamente</p>
                </div>
                <Switch defaultChecked data-testid="switch-auto-save" />
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default SettingsPage;