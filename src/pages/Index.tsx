import { useNavigate } from "react-router-dom";
import { Scissors, Calendar, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-8 flex items-center justify-center shadow-glow">
          <Scissors className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="text-5xl font-display font-bold mb-6 text-foreground">
          Barbearia Elite
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Sistema de agendamentos moderno para uma experiência única.<br/>
          Tradição e inovação em cada corte.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            variant="hero" 
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => navigate("/")}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Agendar Horário
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => navigate("/admin")}
          >
            <Users className="w-5 h-5 mr-2" />
            Área do Dono
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Profissionais</h3>
            <p className="text-sm text-muted-foreground">Barbeiros experientes e qualificados</p>
          </div>
          
          <div className="p-4">
            <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Agendamento</h3>
            <p className="text-sm text-muted-foreground">Sistema fácil e intuitivo</p>
          </div>
          
          <div className="p-4">
            <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center">
              <Star className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Qualidade</h3>
            <p className="text-sm text-muted-foreground">Avaliação 4.9/5 dos clientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
