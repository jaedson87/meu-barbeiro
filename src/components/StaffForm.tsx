import { useState } from "react";
import { X, Plus, Clock, User, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface StaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: any;
  onSave: (data: any) => void;
}

const StaffForm = ({ isOpen, onClose, staff, onSave }: StaffFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: staff?.name || "",
    email: staff?.email || "",
    phone: staff?.phone || "",
    role: staff?.role || "Barbeiro",
    workingHours: staff?.workingHours || {
      monday: { enabled: true, start: "09:00", end: "18:00" },
      tuesday: { enabled: true, start: "09:00", end: "18:00" },
      wednesday: { enabled: true, start: "09:00", end: "18:00" },
      thursday: { enabled: true, start: "09:00", end: "18:00" },
      friday: { enabled: true, start: "09:00", end: "18:00" },
      saturday: { enabled: true, start: "09:00", end: "18:00" },
      sunday: { enabled: false, start: "09:00", end: "18:00" }
    },
    services: staff?.services || []
  });

  const weekDays = [
    { key: "monday", label: "Segunda" },
    { key: "tuesday", label: "Terça" },
    { key: "wednesday", label: "Quarta" },
    { key: "thursday", label: "Quinta" },
    { key: "friday", label: "Sexta" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" }
  ];

  const availableServices = [
    { id: "1", name: "Corte de Cabelo", duration: 30, price: 40 },
    { id: "2", name: "Barba Completa", duration: 30, price: 35 },
    { id: "3", name: "Corte + Barba", duration: 60, price: 70 },
    { id: "4", name: "Sobrancelha", duration: 15, price: 20 }
  ];

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Funcionário salvo!",
      description: `${formData.name} foi ${staff ? 'atualizado' : 'adicionado'} com sucesso.`,
    });
    onClose();
  };

  const updateWorkingHours = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value
        }
      }
    }));
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id: string) => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="gradient-card shadow-card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{staff ? 'Editar' : 'Novo'} Funcionário</CardTitle>
            <CardDescription>
              Configure dados pessoais, horários e serviços
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Dados Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do funcionário"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Função</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Barbeiro">Barbeiro</SelectItem>
                    <SelectItem value="Barbeiro Sênior">Barbeiro Sênior</SelectItem>
                    <SelectItem value="Cabeleireira">Cabeleireira</SelectItem>
                    <SelectItem value="Esteticista">Esteticista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Horários de Trabalho */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Horários de Trabalho
            </h3>
            
            <div className="space-y-3">
              {weekDays.map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
                  <div className="w-20">
                    <Checkbox
                      checked={formData.workingHours[key as keyof typeof formData.workingHours].enabled}
                      onCheckedChange={(checked) => updateWorkingHours(key, 'enabled', checked)}
                    />
                    <span className="ml-2 text-sm font-medium">{label}</span>
                  </div>
                  
                  {formData.workingHours[key as keyof typeof formData.workingHours].enabled && (
                    <div className="flex items-center space-x-2 flex-1">
                      <Input
                        type="time"
                        value={formData.workingHours[key as keyof typeof formData.workingHours].start}
                        onChange={(e) => updateWorkingHours(key, 'start', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">até</span>
                      <Input
                        type="time"
                        value={formData.workingHours[key as keyof typeof formData.workingHours].end}
                        onChange={(e) => updateWorkingHours(key, 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Serviços */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Serviços Oferecidos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg"
                >
                  <Checkbox
                    checked={formData.services.includes(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.duration} min • R$ {service.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="flex space-x-4 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1 gradient-primary">
              {staff ? 'Atualizar' : 'Adicionar'} Funcionário
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffForm;