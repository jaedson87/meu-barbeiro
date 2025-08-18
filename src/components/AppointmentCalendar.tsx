import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AppointmentCalendarProps {
  appointments?: any[];
  staff?: any[];
}

const AppointmentCalendar = ({ appointments = [], staff = [] }: AppointmentCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Mock appointments for today
  const mockAppointments = [
    {
      id: "1",
      time: "09:00",
      duration: 60,
      customer: "João Silva",
      service: "Corte + Barba",
      staffId: "1",
      staffName: "Carlos Santos",
      status: "confirmed",
      price: 70
    },
    {
      id: "2",
      time: "10:30",
      duration: 30,
      customer: "Pedro Oliveira",
      service: "Corte",
      staffId: "2",
      staffName: "João Silva",
      status: "confirmed",
      price: 40
    },
    {
      id: "3",
      time: "14:00",
      duration: 45,
      customer: "Maria Santos",
      service: "Corte Feminino",
      staffId: "3",
      staffName: "Ana Costa",
      status: "pending",
      price: 50
    },
    {
      id: "4",
      time: "15:30",
      duration: 30,
      customer: "Roberto Lima",
      service: "Barba",
      staffId: "1",
      staffName: "Carlos Santos",
      status: "confirmed",
      price: 35
    },
    {
      id: "5",
      time: "16:00",
      duration: 30,
      customer: "Lucas Ferreira",
      service: "Sobrancelha",
      staffId: "2",
      staffName: "João Silva",
      status: "completed",
      price: 20
    }
  ];

  const mockStaff = [
    { id: "1", name: "Carlos Santos", avatar: "👨‍🎨" },
    { id: "2", name: "João Silva", avatar: "👨‍💼" },
    { id: "3", name: "Ana Costa", avatar: "👩‍💼" }
  ];

  const hours = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9; // 9 AM to 6 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: "bg-success/10 text-success border-success/20",
      pending: "bg-warning/10 text-warning border-warning/20",
      completed: "bg-info/10 text-info border-info/20",
      canceled: "bg-destructive/10 text-destructive border-destructive/20"
    };
    return colors[status as keyof typeof colors] || colors.confirmed;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      confirmed: "Confirmado",
      pending: "Pendente",
      completed: "Concluído",
      canceled: "Cancelado"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const getAppointmentForTimeSlot = (time: string, staffId: string) => {
    return mockAppointments.find(apt => apt.time === time && apt.staffId === staffId);
  };

  return (
    <Card className="gradient-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <span>Agenda</span>
            </CardTitle>
            <CardDescription className="capitalize">
              {formatDate(currentDate)}
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('day')}
                className="rounded-none"
              >
                Dia
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
                className="rounded-none"
              >
                Semana
              </Button>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Hoje
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === 'day' ? (
          <div className="space-y-6">
            {/* Staff Headers */}
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium text-muted-foreground">Horário</div>
              {mockStaff.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-2xl">{member.avatar}</span>
                    <span className="font-medium text-foreground">{member.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-2">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-4 gap-4 min-h-[80px] border-b border-border/50 pb-2">
                  <div className="flex items-center font-medium text-muted-foreground">
                    {hour}
                  </div>
                  
                  {mockStaff.map((member) => {
                    const appointment = getAppointmentForTimeSlot(hour, member.id);
                    
                    return (
                      <div key={`${hour}-${member.id}`} className="relative">
                        {appointment ? (
                          <div className="p-3 border border-border rounded-lg bg-card/50 transition-smooth hover:border-primary/50 cursor-pointer animate-scale-in">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-foreground text-sm">
                                {appointment.customer}
                              </span>
                              <Badge variant="outline" className={getStatusColor(appointment.status)}>
                                {getStatusLabel(appointment.status)}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">{appointment.service}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {appointment.duration}min
                                </span>
                                <span className="text-xs font-medium text-primary">
                                  R$ {appointment.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            className="w-full h-full border-2 border-dashed border-border/30 hover:border-primary/50 transition-smooth"
                            onClick={() => {/* Add new appointment logic */}}
                          >
                            <Plus className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Visualização Semanal
            </h3>
            <p className="text-muted-foreground mb-6">
              Em desenvolvimento - Visualização completa da semana
            </p>
            <Button variant="outline" onClick={() => setViewMode('day')}>
              Voltar para Visualização Diária
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendar;