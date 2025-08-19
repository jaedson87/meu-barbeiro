import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, LogIn, Settings, UserCog, Calendar } from "lucide-react";

const TestNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const routes = [
    {
      path: "/",
      title: "Home",
      description: "Página inicial com seleção de barbeiro e agendamento",
      icon: Home,
      public: true
    },
    {
      path: "/login",
      title: "Login",
      description: "Sistema de autenticação para donos e super admin",
      icon: LogIn,
      public: true
    },
    {
      path: "/admin",
      title: "Admin (Dono)",
      description: "Painel administrativo para donos de barbearia",
      icon: Settings,
      requiresAuth: "owner"
    },
    {
      path: "/super-admin",
      title: "Super Admin",
      description: "Painel para cadastrar novos donos e barbearias",
      icon: UserCog,
      requiresAuth: "super_admin"
    },
    {
      path: "/booking",
      title: "Agendamento",
      description: "Formulário de agendamento para clientes",
      icon: Calendar,
      public: true
    }
  ];

  const canAccess = (route: any) => {
    if (route.public) return true;
    if (!route.requiresAuth) return true;
    if (!user) return false;
    return user.role === route.requiresAuth;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Sistema de Barbearia - Navegação de Teste</h2>
        <p className="text-muted-foreground">
          {user ? `Logado como: ${user.name} (${user.role})` : "Não autenticado"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => {
          const Icon = route.icon;
          const accessible = canAccess(route);
          
          return (
            <Card key={route.path} className={`transition-all ${accessible ? 'hover:shadow-lg cursor-pointer' : 'opacity-50'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {route.title}
                </CardTitle>
                <CardDescription>{route.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(route.path)}
                  disabled={!accessible}
                  variant={accessible ? "default" : "secondary"}
                  className="w-full"
                >
                  {accessible ? "Acessar" : "Sem permissão"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>Credenciais de Teste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <strong>Dono da Barbearia:</strong><br />
            Email: joao@barbearia.com<br />
            Senha: 123456
          </div>
          <div>
            <strong>Super Admin:</strong><br />
            Email: admin@sistema.com<br />
            Senha: 123456
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestNavigation;