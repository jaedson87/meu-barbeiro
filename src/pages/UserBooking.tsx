import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock, MapPin, Phone, Scissors, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UserBooking = () => {
  const { barbershopSlug } = useParams();
  const { toast } = useToast();
  
  const [barbershop, setBarbershop] = useState<any>(null);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (barbershopSlug) {
      fetchBarbershopData();
    }
  }, [barbershopSlug]);

  useEffect(() => {
    if (selectedDate && selectedBarber) {
      fetchAppointments();
    }
  }, [selectedDate, selectedBarber]);

  const fetchBarbershopData = async () => {
    try {
      // Buscar barbearia
      const { data: barbershopData, error: barbershopError } = await supabase
        .from('barbershops')
        .select('*')
        .eq('slug', barbershopSlug)
        .single();

      if (barbershopError) {
        console.error('Erro ao buscar barbearia:', barbershopError);
        return;
      }

      setBarbershop(barbershopData);

      // Buscar barbeiros
      const { data: barbersData, error: barbersError } = await supabase
        .from('barbers')
        .select('*')
        .eq('barbershop_id', barbershopData.id)
        .eq('is_active', true);

      if (barbersError) {
        console.error('Erro ao buscar barbeiros:', barbersError);
        return;
      }

      setBarbers(barbersData || []);

      // Buscar serviços
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('barbershop_id', barbershopData.id)
        .eq('is_active', true);

      if (servicesError) {
        console.error('Erro ao buscar serviços:', servicesError);
        return;
      }

      setServices(servicesData || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    if (!selectedDate || !selectedBarber || !barbershop) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('barbershop_id', barbershop.id)
        .eq('barber_id', selectedBarber)
        .eq('appointment_date', format(selectedDate, 'yyyy-MM-dd'))
        .in('status', ['pending', 'confirmed']);

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const isBooked = appointments.some(apt => apt.appointment_time === timeStr);
        slots.push({ time: timeStr, available: !isBooked });
      }
    }
    return slots;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedBarber || !selectedService || !selectedTime || 
        !customerName || !customerPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          barbershop_id: barbershop.id,
          barber_id: selectedBarber,
          service_id: selectedService,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: selectedTime,
          notes: notes,
          status: 'pending'
        });

      if (error) {
        console.error('Erro ao criar agendamento:', error);
        toast({
          title: "Erro ao agendar",
          description: "Ocorreu um erro ao criar o agendamento. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Agendamento realizado!",
        description: "Seu agendamento foi criado com sucesso. Aguarde a confirmação.",
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedBarber("");
      setSelectedService("");
      setSelectedTime("");
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setNotes("");
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Barbearia não encontrada</p>
            <Link to="/">
              <Button>Voltar ao início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedServiceData = services.find(s => s.id === selectedService);
  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Scissors className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">{barbershop.name}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Barbershop Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Barbearia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {barbershop.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{barbershop.address}</span>
                  </div>
                )}
                {barbershop.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{barbershop.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Seg-Sex: 8h às 18h</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Serviços Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.duration}min</p>
                      </div>
                      <p className="font-semibold">R$ {service.price}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Agendar Serviço</CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para fazer seu agendamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Service Selection */}
                <div>
                  <Label>Serviço *</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.duration}min - R$ {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Barber Selection */}
                <div>
                  <Label>Barbeiro *</Label>
                  <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um barbeiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {barbers.map((barber) => (
                        <SelectItem key={barber.id} value={barber.id}>
                          {barber.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div>
                  <Label>Data *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Escolha uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                {selectedDate && selectedBarber && (
                  <div>
                    <Label>Horário *</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className="h-10"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Alguma observação especial?"
                    rows={3}
                  />
                </div>

                {/* Summary */}
                {selectedServiceData && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Resumo do Agendamento</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Serviço:</strong> {selectedServiceData.name}</p>
                      <p><strong>Duração:</strong> {selectedServiceData.duration} minutos</p>
                      <p><strong>Valor:</strong> R$ {selectedServiceData.price}</p>
                      {selectedDate && <p><strong>Data:</strong> {format(selectedDate, "PPP", { locale: ptBR })}</p>}
                      {selectedTime && <p><strong>Horário:</strong> {selectedTime}</p>}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBooking} 
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting ? "Agendando..." : "Confirmar Agendamento"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBooking;