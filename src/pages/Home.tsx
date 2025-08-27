import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Scissors, Clock, Users, Star, MapPin, Phone, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/barbershop-hero.jpg";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [barbershops, setBarbershops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarbershops();
  }, []);

  const fetchBarbershops = async () => {
    try {
      const { data, error } = await supabase
        .from('barbershops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar barbearias:', error);
        return;
      }

      setBarbershops(data || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBarbershops = barbershops.filter(barbershop =>
    barbershop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (barbershop.address && barbershop.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scissors className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">BarberSystem</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost">Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Encontre sua Barbearia Ideal
          </h2>
          <p className="text-xl md:text-2xl mb-8">
            Agende seus cortes com os melhores profissionais
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 bg-background">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar barbearias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barbershops Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold mb-6">Barbearias Disponíveis</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <p>Carregando barbearias...</p>
            </div>
          ) : filteredBarbershops.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma barbearia encontrada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBarbershops.map((barbershop) => (
                <Card key={barbershop.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{barbershop.name}</CardTitle>
                      <Badge variant="secondary">Aberto</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {barbershop.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{barbershop.address}</span>
                      </div>
                    )}
                    {barbershop.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{barbershop.phone}</span>
                      </div>
                    )}
                    <Link to={`/book/${barbershop.slug}`}>
                      <Button className="w-full">
                        Agendar Agora
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">
              Por que escolher o BarberSystem?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Agendamento Rápido</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Agende seu horário em poucos cliques
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Profissionais Qualificados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Barbeiros experientes e especializados
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Variedade de Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cortes, barba, bigode e muito mais
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scissors className="h-6 w-6 text-primary" />
            <h4 className="text-lg font-semibold">BarberSystem</h4>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 BarberSystem. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;