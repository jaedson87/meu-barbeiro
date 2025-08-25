import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Settings, Users, Store } from 'lucide-react';

interface Barbershop {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
  isActive: boolean;
}

const SuperAdmin = () => {
  const { user, profile, signOut } = useAuth();
  const [barbershops, setBarbershops] = useState<Barbershop[]>([
    {
      id: '1',
      name: 'Barbearia Central',
      ownerName: 'João Silva',
      ownerEmail: 'joao@barbearia.com',
      createdAt: '2024-01-15',
      isActive: true
    },
    {
      id: '2',
      name: 'Barbearia Premium',
      ownerName: 'Carlos Santos',
      ownerEmail: 'carlos@premium.com',
      createdAt: '2024-02-10',
      isActive: true
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBarbershop, setNewBarbershop] = useState({
    name: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: ''
  });

  if (!user || !profile || profile.role !== 'super_admin') {
    return <Navigate to="/auth" replace />;
  }

  const handleCreateBarbershop = (e: React.FormEvent) => {
    e.preventDefault();
    
    const barbershop: Barbershop = {
      id: Date.now().toString(),
      name: newBarbershop.name,
      ownerName: newBarbershop.ownerName,
      ownerEmail: newBarbershop.ownerEmail,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    };
    
    setBarbershops(prev => [...prev, barbershop]);
    setNewBarbershop({ name: '', ownerName: '', ownerEmail: '', ownerPassword: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Barbearia criada com sucesso!",
      description: `${barbershop.name} foi adicionada ao sistema.`
    });
  };

  const toggleBarbershopStatus = (id: string) => {
    setBarbershops(prev => prev.map(b => 
      b.id === id ? { ...b, isActive: !b.isActive } : b
    ));
    toast({
      title: "Status atualizado",
      description: "Status da barbearia foi alterado."
    });
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
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{barbershops.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Barbearias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{barbershops.filter(b => b.isActive).length}</p>
                  <p className="text-sm text-muted-foreground">Barbearias Ativas</p>
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
                  <p className="text-2xl font-bold">
                    {barbershops.filter(b => {
                      const today = new Date();
                      const created = new Date(b.createdAt);
                      const diffTime = Math.abs(today.getTime() - created.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 30;
                    }).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Novas (30 dias)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barbershops Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciamento de Barbearias</CardTitle>
                <CardDescription>
                  Gerencie todas as barbearias do sistema
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Barbearia
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Nova Barbearia</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar uma nova barbearia e seu dono
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateBarbershop} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="barbershop-name">Nome da Barbearia</Label>
                      <Input
                        id="barbershop-name"
                        placeholder="Ex: Barbearia Central"
                        value={newBarbershop.name}
                        onChange={(e) => setNewBarbershop(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-name">Nome do Dono</Label>
                      <Input
                        id="owner-name"
                        placeholder="Ex: João Silva"
                        value={newBarbershop.ownerName}
                        onChange={(e) => setNewBarbershop(prev => ({ ...prev, ownerName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-email">Email do Dono</Label>
                      <Input
                        id="owner-email"
                        type="email"
                        placeholder="joao@email.com"
                        value={newBarbershop.ownerEmail}
                        onChange={(e) => setNewBarbershop(prev => ({ ...prev, ownerEmail: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-password">Senha Inicial</Label>
                      <Input
                        id="owner-password"
                        type="password"
                        placeholder="••••••••"
                        value={newBarbershop.ownerPassword}
                        onChange={(e) => setNewBarbershop(prev => ({ ...prev, ownerPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        Criar Barbearia
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barbearia</TableHead>
                  <TableHead>Dono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {barbershops.map((barbershop) => (
                  <TableRow key={barbershop.id}>
                    <TableCell className="font-medium">{barbershop.name}</TableCell>
                    <TableCell>{barbershop.ownerName}</TableCell>
                    <TableCell>{barbershop.ownerEmail}</TableCell>
                    <TableCell>{new Date(barbershop.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        barbershop.isActive 
                          ? 'bg-accent/10 text-accent' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {barbershop.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBarbershopStatus(barbershop.id)}
                      >
                        {barbershop.isActive ? 'Desativar' : 'Ativar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SuperAdmin;