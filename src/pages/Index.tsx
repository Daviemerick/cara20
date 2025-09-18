import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Eye, EyeOff, Crown, Zap, Shield } from 'lucide-react';

const Index = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setLoginError('Email ou senha inválidos. Verifique suas credenciais.');
      }
    } catch (error) {
      setLoginError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-lg font-semibold text-foreground">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury relative overflow-hidden flex items-center justify-center">
      {/* Luxury Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/98 to-muted/3" />
      
      {/* Premium Ambient Lights */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-primary/4 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-0 right-1/3 w-80 h-80 bg-secondary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="relative z-10 w-full max-w-md mx-auto p-4">
        <div className="space-y-4 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="relative">
                <img src="/src/assets/nexus-logo-full.png" alt="NEXUS Intelligence" className="h-48 w-auto object-contain animate-breathe" />
              </div>
            </div>
          </div>

          {/* Login Form */}
          <Card className="glass-card border-border/20">
            <CardHeader className="text-center pt-4 pb-4">
              <CardTitle className="text-xl font-bold">Acesso Executivo</CardTitle>
              <CardDescription>Entre com suas credenciais para continuar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="h-12"
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-12 pr-12"
                        required
                        data-testid="input-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {loginError && (
                  <Alert variant="destructive">
                    <AlertDescription data-testid="text-login-error">{loginError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/90"
                  disabled={isSubmitting}
                  data-testid="button-login"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Conectando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4" />
                      <span>Entrar no Sistema</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
};

export default Index;