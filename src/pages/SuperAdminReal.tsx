import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Settings, Users, Store, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Owner {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  barbershop?: {
    id: string;
    name: string;
    slug: string;
  };
}

const SuperAdminReal = () => {
  const { user, profile, signOut, signUp } = useAuth();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newOwner, setNewOwner] = useState({
    fullName: '',
    email: '',
    password: '',
    barbershopName: ''
  });

  if (!user || !profile || profile.role !== 'super_admin') {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          created_at,
          barbershops (
            id,
            name,
            slug
          )
        `)
        .eq('role', 'owner')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar donos",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      const transformedData = data?.map(owner => ({
        ...owner,
        barbershop: owner.barbershops?.[0] || undefined
      })) || [];

      setOwners(transformedData);
    } catch (error) {
      console.error('Error fetching owners:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos donos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Create auth user
      const { error: signUpError } = await signUp(
        newOwner.email,
        newOwner.password,
        newOwner.fullName,
        'owner'
      );

      if (signUpError) {
        toast({
          title: "Erro ao criar usuário",
          description: signUpError.message,
          variant: "destructive"
        });
        return;
      }

      // Create barbershop if name provided
      if (newOwner.barbershopName.trim()) {
        // Get the created user ID
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData.user) {
          const slug = newOwner.barbershopName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

          const { error: barbershopError } = await supabase
            .from('barbershops')
            .insert({
              owner_id: userData.user.id,
              name: newOwner.barbershopName,
              slug: `${slug}-${Date.now()}`
            });

          if (barbershopError) {
            console.error('Error creating barbershop:', barbershopError);
          }
        }
      }

      toast({
        title: "Dono criado com sucesso!",
        description: `${newOwner.fullName} foi adicionado ao sistema.`
      });

      setNewOwner({ fullName: '', email: '', password: '', barbershopName: '' });
      setIsDialogOpen(false);
      fetchOwners(); // Refresh the list
    } catch (error) {
      console.error('Error creating owner:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar dono",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const stats = {
    total: owners.length,
    withBarbershop: owners.filter(o => o.barbershop).length,
    recent: owners.filter(o => {
      const created = new Date(o.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return created >= thirtyDaysAgo;
    }).length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Super Admin</h1>
                <p className="text-sm text-muted-foreground">Gerenciamento do Sistema</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Bem-vindo, {profile?.full_name}
              </span>
              <Button variant="outline" onClick={signOut}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total de Donos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.withBarbershop}</p>
                  <p className="text-sm text-muted-foreground">Com Barbearia</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.recent}</p>
                  <p className="text-sm text-muted-foreground">Novos (30 dias)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Owners Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciamento de Donos</CardTitle>
                <CardDescription>
                  Crie e gerencie donos de barbearia do sistema
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={isLoading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Dono
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Dono</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar um novo dono de barbearia
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateOwner} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Nome Completo</Label>
                      <Input
                        id="full-name"
                        placeholder="Ex: João Silva"
                        value={newOwner.fullName}
                        onChange={(e) => setNewOwner(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="joao@email.com"
                        value={newOwner.email}
                        onChange={(e) => setNewOwner(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={newOwner.password}
                          onChange={(e) => setNewOwner(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barbershop-name">Nome da Barbearia (Opcional)</Label>
                      <Input
                        id="barbershop-name"
                        placeholder="Ex: Barbearia Central"
                        value={newOwner.barbershopName}
                        onChange={(e) => setNewOwner(prev => ({ ...prev, barbershopName: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1" disabled={isCreating}>
                        {isCreating ? 'Criando...' : 'Criar Dono'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isCreating}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Barbearia</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Nenhum dono cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    owners.map((owner) => (
                      <TableRow key={owner.id}>
                        <TableCell className="font-medium">{owner.full_name}</TableCell>
                        <TableCell>{owner.email}</TableCell>
                        <TableCell>
                          {owner.barbershop ? (
                            <span className="text-sm text-muted-foreground">
                              {owner.barbershop.name}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Sem barbearia
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(owner.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SuperAdminReal;