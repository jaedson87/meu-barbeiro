import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, CreditCard, Calendar, Clock, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const BookingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cpf: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - In real app, this would come from URL params or state
  const selectedBooking = {
    barber: "João Silva",
    service: "Corte + Barba",
    date: "18 de Agosto de 2025",
    time: "14:00",
    duration: 60,
    price: 70
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, "");
    if (numbers.length !== 11) return false;
    
    // Basic CPF validation algorithm
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let checkDigit1 = 11 - (sum % 11);
    if (checkDigit1 === 10 || checkDigit1 === 11) checkDigit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    let checkDigit2 = 11 - (sum % 11);
    if (checkDigit2 === 10 || checkDigit2 === 11) checkDigit2 = 0;
    
    return checkDigit1 === parseInt(numbers.charAt(9)) && 
           checkDigit2 === parseInt(numbers.charAt(10));
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === "phone") {
      formattedValue = formatPhone(value);
    } else if (field === "cpf") {
      formattedValue = formatCPF(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.phone.trim()) {
      toast({
        title: "Telefone obrigatório", 
        description: "Por favor, informe seu telefone.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.cpf.trim() || !validateCPF(formData.cpf)) {
      toast({
        title: "CPF inválido",
        description: "Por favor, informe um CPF válido.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Agendamento confirmado!",
      description: `Seu horário está reservado para ${selectedBooking.date} às ${selectedBooking.time}.`,
    });
    
    setIsSubmitting(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="transition-spring hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-display font-semibold text-foreground">
                Finalizar Agendamento
              </h1>
              <p className="text-sm text-muted-foreground">Complete seus dados para confirmar</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="gradient-card shadow-card sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Resumo do Agendamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{selectedBooking.barber}</p>
                      <p className="text-sm text-muted-foreground">Barbeiro</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <Scissors className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{selectedBooking.service}</p>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {selectedBooking.duration} minutos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{selectedBooking.date}</p>
                      <p className="text-sm text-muted-foreground">{selectedBooking.time}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-display font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">R$ {selectedBooking.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Form */}
          <div className="lg:col-span-2">
            <Card className="gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Seus Dados</span>
                </CardTitle>
                <CardDescription>
                  Informe seus dados para confirmar o agendamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground">
                        Nome Completo *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Digite seu nome completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="mt-2 transition-smooth focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-foreground">
                        Telefone *
                      </Label>
                      <div className="relative mt-2">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="pl-10 transition-smooth focus:border-primary"
                          maxLength={15}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Será usado para confirmação via WhatsApp
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="cpf" className="text-foreground">
                        CPF *
                      </Label>
                      <div className="relative mt-2">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cpf"
                          type="text"
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={(e) => handleInputChange("cpf", e.target.value)}
                          className="pl-10 transition-smooth focus:border-primary"
                          maxLength={14}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Necessário para cadastro e identificação
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-foreground mb-2">Política de Cancelamento</h4>
                      <p className="text-sm text-muted-foreground">
                        • Cancelamentos gratuitos até 2 horas antes do horário agendado<br/>
                        • Reagendamentos podem ser feitos até 1 hora antes<br/>
                        • Ausências sem aviso prévio podem resultar em cobrança de taxa
                      </p>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate("/")}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="hero"
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                            Confirmando...
                          </>
                        ) : (
                          "Confirmar Agendamento"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingForm;