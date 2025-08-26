import { useState } from "react";
import { useNavigate } from "react-router-dom";  
import { Calendar, Clock, Users, Scissors, Star, MapPin, Phone, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/barbershop-hero.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const barbers = [
    {
      id: "1",
      name: "João Silva",
      avatar: "👨‍💼",
      rating: 4.9,
      specialties: ["Corte Clássico", "Barba", "Bigode"]
    },
    {
      id: "2", 
      name: "Carlos Santos",
      avatar: "👨‍🎨",
      rating: 4.8,
      specialties: ["Corte Moderno", "Degradê", "Sobrancelha"]
    },
    {
      id: "3",
      name: "Miguel Oliveira", 
      avatar: "👨‍🔧",
      rating: 5.0,
      specialties: ["Corte + Barba", "Tratamentos", "Penteados"]
    }
  ];

  const services = [
    {
      id: "1",
      name: "Corte de Cabelo",
      duration: 30,
      price: 40,
      description: "Corte profissional personalizado"
    },
    {
      id: "2", 
      name: "Barba Completa",
      duration: 30,
      price: 35,
      description: "Aparar e modelar a barba"
    },
    {
      id: "3",
      name: "Corte + Barba",
      duration: 60,
      price: 70,
      description: "Pacote completo de cuidados"
    },
    {
      id: "4",
      name: "Sobrancelha",
      duration: 15,
      price: 20,
      description: "Design e aparar sobrancelhas"
    }
  ];

  const availableSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  return (
    <div className="min-h-screen gradient-hero relative">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Scissors className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold text-foreground">
                  Barbearia Elite
                </h1>
                <p className="text-sm text-muted-foreground">Tradição e modernidade</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="hidden md:flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Rua das Flores, 123</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(11) 99999-9999</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="transition-spring hover:scale-105"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seleção de Barbeiro */}
          <Card className="gradient-card shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Escolha seu Barbeiro</span>
              </CardTitle>
              <CardDescription>
                Selecione o profissional de sua preferência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  className={`p-4 rounded-lg border transition-smooth cursor-pointer ${
                    selectedBarber === barber.id
                      ? "border-primary shadow-glow bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedBarber(barber.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{barber.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">{barber.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="text-sm font-medium">{barber.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {barber.specialties.join(" • ")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Seleção de Serviço */}
          <Card className="gradient-card shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-primary" />
                <span>Escolha o Serviço</span>
              </CardTitle>
              <CardDescription>
                Selecione o tipo de atendimento desejado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 rounded-lg border transition-smooth cursor-pointer ${
                    selectedService === service.id
                      ? "border-primary shadow-glow bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {service.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-primary">
                        R$ {service.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Horários Disponíveis */}
          <Card className="gradient-card shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Horários Disponíveis</span>
              </CardTitle>
              <CardDescription>
                Hoje, 18 de Agosto de 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedBarber || !selectedService ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Selecione um barbeiro e serviço para ver os horários disponíveis
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? "default" : "outline"}
                        size="sm"
                        className="transition-spring hover:scale-105"
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    className="w-full gradient-primary shadow-elegant transition-spring hover:scale-105"
                    disabled={!selectedTime}
                    onClick={() => navigate("/booking")}
                  >
                    Continuar Agendamento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <section className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="gradient-card shadow-card text-center animate-slide-up">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Horário de Funcionamento</h3>
              <p className="text-sm text-muted-foreground">
                Seg - Sáb: 09:00 - 18:00<br />
                Dom: Fechado
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card text-center animate-slide-up">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Localização</h3>
              <p className="text-sm text-muted-foreground">
                Rua das Flores, 123<br />
                Centro, São Paulo - SP
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card text-center animate-slide-up">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Contato</h3>
              <p className="text-sm text-muted-foreground">
                (11) 99999-9999<br />
                WhatsApp disponível
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card text-center animate-slide-up">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Avaliação</h3>
              <p className="text-sm text-muted-foreground">
                4.9 ★★★★★<br />
                +500 clientes satisfeitos
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Home;