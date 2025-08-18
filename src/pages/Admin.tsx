import { useState } from "react";
import { 
  Users, 
  Scissors, 
  Calendar, 
  UserPlus, 
  Settings, 
  BarChart3,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import StaffForm from "@/components/StaffForm";
import ServiceForm from "@/components/ServiceForm";
import AppointmentCalendar from "@/components/AppointmentCalendar";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const stats = [
    {
      title: "Agendamentos Hoje",
      value: "23",
      change: "+12%",
      icon: Calendar,
      color: "text-primary"
    },
    {
      title: "Faturamento do Mês",
      value: "R$ 8.450",
      change: "+18%", 
      icon: BarChart3,
      color: "text-success"
    },
    {
      title: "Clientes Ativos",
      value: "156",
      change: "+5%",
      icon: Users,
      color: "text-info"
    },
    {
      title: "Serviços Realizados",
      value: "89",
      change: "+8%",
      icon: Scissors,
      color: "text-warning"
    }
  ];

  const todayAppointments = [
    {
      id: "1",
      time: "09:00",
      customer: "João Silva",
      service: "Corte + Barba",
      barber: "Carlos Santos",
      status: "confirmed",
      duration: 60,
      price: 70
    },
    {
      id: "2", 
      time: "10:30",
      customer: "Maria Oliveira",
      service: "Corte Feminino",
      barber: "Ana Costa",
      status: "confirmed",
      duration: 45,
      price: 50
    },
    {
      id: "3",
      time: "14:00", 
      customer: "Pedro Santos",
      service: "Barba",
      barber: "João Silva",
      status: "pending",
      duration: 30,
      price: 35
    }
  ];

  const staff = [
    {
      id: "1",
      name: "João Silva",
      role: "Barbeiro Sênior",
      avatar: "👨‍💼",
      rating: 4.9,
      appointmentsToday: 8,
      status: "available"
    },
    {
      id: "2",
      name: "Carlos Santos", 
      role: "Barbeiro",
      avatar: "👨‍🎨",
      rating: 4.8,
      appointmentsToday: 6,
      status: "busy"
    },
    {
      id: "3",
      name: "Ana Costa",
      role: "Cabeleireira",
      avatar: "👩‍💼",
      rating: 5.0,
      appointmentsToday: 5,
      status: "available"
    }
  ];

  const services = [
    {
      id: "1",
      name: "Corte de Cabelo",
      duration: 30,
      price: 40,
      category: "Cabelo",
      status: "active"
    },
    {
      id: "2",
      name: "Barba Completa",
      duration: 30, 
      price: 35,
      category: "Barba",
      status: "active"
    },
    {
      id: "3",
      name: "Corte + Barba",
      duration: 60,
      price: 70,
      category: "Combo",
      status: "active"
    },
    {
      id: "4",
      name: "Sobrancelha",
      duration: 15,
      price: 20,
      category: "Estética",
      status: "active"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "bg-success/10 text-success border-success/20",
      pending: "bg-warning/10 text-warning border-warning/20", 
      canceled: "bg-destructive/10 text-destructive border-destructive/20",
      completed: "bg-info/10 text-info border-info/20",
      available: "bg-success/10 text-success border-success/20",
      busy: "bg-warning/10 text-warning border-warning/20",
      active: "bg-success/10 text-success border-success/20"
    };

    const labels = {
      confirmed: "Confirmado",
      pending: "Pendente",
      canceled: "Cancelado", 
      completed: "Concluído",
      available: "Disponível",
      busy: "Ocupado",
      active: "Ativo"
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleStaffSave = (data: any) => {
    console.log('Staff saved:', data);
    // Here you would save to your backend
  };

  const handleServiceSave = (data: any) => {
    console.log('Service saved:', data);
    // Here you would save to your backend
  };

  const openEditStaff = (staff: any) => {
    setEditingStaff(staff);
    setStaffFormOpen(true);
  };

  const openEditService = (service: any) => {
    setEditingService(service);
    setServiceFormOpen(true);
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold text-foreground">
                  Painel Administrativo
                </h1>
                <p className="text-sm text-muted-foreground">Barbearia Elite</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="transition-spring hover:scale-105"
              onClick={() => setStaffFormOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Funcionário
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="staff">Funcionários</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Grid with Enhanced Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="gradient-card shadow-card animate-scale-in relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <TrendingUp className="w-3 h-3 text-success" />
                            <p className="text-sm text-success">{stat.change}</p>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-glow opacity-60"></div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Today's Schedule */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="gradient-card shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Próximos Agendamentos</CardTitle>
                      <CardDescription>Hoje, 18 de Agosto de 2025</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("appointments")}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Ver Calendário
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg transition-smooth hover:border-primary/50 hover:shadow-glow"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-16 text-center">
                              <div className="text-lg font-semibold text-primary">{appointment.time}</div>
                              <div className="text-xs text-muted-foreground">{appointment.duration}min</div>
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{appointment.customer}</h4>
                              <p className="text-sm text-muted-foreground">{appointment.service}</p>
                              <p className="text-xs text-muted-foreground">com {appointment.barber}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-primary">R$ {appointment.price}</span>
                            {getStatusBadge(appointment.status)}
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm" className="transition-spring hover:scale-105">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="transition-spring hover:scale-105">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats Sidebar */}
              <div className="space-y-6">
                <Card className="gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Status da Equipe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {staff.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{member.avatar}</span>
                          <div>
                            <p className="font-medium text-foreground text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.appointmentsToday} agendamentos</p>
                          </div>
                        </div>
                        {getStatusBadge(member.status)}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Hoje:</span>
                        <span className="font-semibold text-primary">R$ 465</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Semana:</span>
                        <span className="font-semibold text-foreground">R$ 2.340</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Mês:</span>
                        <span className="font-semibold text-foreground">R$ 8.450</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "68%" }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">68% da meta mensal</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Staff Management */}
          <TabsContent value="staff" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-semibold text-foreground">Funcionários</h2>
                <p className="text-muted-foreground">Gerencie sua equipe</p>
              </div>
              <Button 
                className="gradient-primary shadow-elegant"
                onClick={() => {
                  setEditingStaff(null);
                  setStaffFormOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Funcionário
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => (
                <Card key={member.id} className="gradient-card shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-3xl">{member.avatar}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-sm font-medium">{member.rating}</span>
                          <div className="flex">
                            {[1,2,3,4,5].map((star) => (
                              <div key={star} className="w-3 h-3 fill-primary text-primary">★</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Agendamentos hoje:</span>
                        <span className="text-sm font-medium">{member.appointmentsToday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        {getStatusBadge(member.status)}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => openEditStaff(member)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Clock className="w-4 h-4 mr-2" />
                        Horários
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Services Management */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-semibold text-foreground">Serviços</h2>
                <p className="text-muted-foreground">Gerencie os serviços oferecidos</p>
              </div>
              <Button 
                className="gradient-primary shadow-elegant"
                onClick={() => {
                  setEditingService(null);
                  setServiceFormOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Serviço
              </Button>
            </div>

            <Card className="gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg transition-smooth hover:border-primary/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                          <Scissors className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.category}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-lg font-semibold text-primary">R$ {service.price}</span>
                        </div>
                        {getStatusBadge(service.status)}
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditService(service)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Management */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-semibold text-foreground">Agenda</h2>
                <p className="text-muted-foreground">Visualize e gerencie todos os agendamentos</p>
              </div>
              <Button className="gradient-primary shadow-elegant">
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>

            <AppointmentCalendar />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <StaffForm
          isOpen={staffFormOpen}
          onClose={() => {
            setStaffFormOpen(false);
            setEditingStaff(null);
          }}
          staff={editingStaff}
          onSave={handleStaffSave}
        />

        <ServiceForm
          isOpen={serviceFormOpen}
          onClose={() => {
            setServiceFormOpen(false);
            setEditingService(null);
          }}
          service={editingService}
          onSave={handleServiceSave}
        />
      </main>
    </div>
  );
};

export default Admin;