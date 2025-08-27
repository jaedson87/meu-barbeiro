import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Criar usuário admin automaticamente quando a página carregar
  useEffect(() => {
    const createAdminIfNotExists = async () => {
      try {
        // Tentar fazer login silencioso para verificar se o admin existe
        const { error } = await signIn('admin@sistema.com', '123456');
        if (error) {
          // Se o login falhou, criar o usuário admin
          console.log('Criando usuário admin...');
          const { error: signUpError } = await signUp('admin@sistema.com', '123456', 'Super Admin', 'super_admin');
          if (!signUpError) {
            toast({
              title: 'Usuário admin criado!',
              description: 'O usuário admin@sistema.com foi criado automaticamente.',
            });
          }
        }
      } catch (error) {
        console.log('Erro ao verificar/criar admin:', error);
      }
    };

    createAdminIfNotExists();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Erro no login',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo de volta.',
      });
      navigate('/');
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast({
        title: 'Erro no cadastro',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Verifique seu email para confirmar a conta.',
      });
    }

    setIsLoading(false);
  };

  const createTestAccounts = async () => {
    setIsLoading(true);
    
    try {
      // Criar conta de Super Admin
      const adminResult = await signUp('admin@sistema.com', '123456', 'Super Admin', 'super_admin');
      
      // Criar conta de Owner
      const ownerResult = await signUp('dono@barbearia.com', '123456', 'Dono da Barbearia', 'owner');
      
      if (adminResult.error || ownerResult.error) {
        toast({
          title: 'Erro ao criar contas de teste',
          description: 'Algumas contas podem já existir ou houve um erro.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Contas de teste criadas!',
          description: 'As contas admin@sistema.com e dono@barbearia.com foram criadas com sucesso.',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao criar contas de teste',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sistema Barbearia</CardTitle>
          <CardDescription>
            Faça login ou crie sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Senha</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
              
              <div className="text-center text-sm text-muted-foreground border-t pt-4 space-y-3">
                <p>Contas de teste:</p>
                <p><strong>Super Admin:</strong> admin@sistema.com / 123456</p>
                <p><strong>Dono:</strong> dono@barbearia.com / 123456</p>
                <Button 
                  onClick={createTestAccounts} 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Criando...' : 'Criar Contas de Teste'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;