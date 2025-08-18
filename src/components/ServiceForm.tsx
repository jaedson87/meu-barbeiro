import { useState } from "react";
import { X, Scissors, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
  onSave: (data: any) => void;
}

const ServiceForm = ({ isOpen, onClose, service, onSave }: ServiceFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    category: service?.category || "Cabelo",
    duration: service?.duration || 30,
    price: service?.price || 40,
    active: service?.active ?? true
  });

  const categories = [
    "Cabelo",
    "Barba",
    "Combo",
    "Estética",
    "Tratamentos",
    "Especiais"
  ];

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do serviço.",
        variant: "destructive"
      });
      return;
    }

    if (formData.duration <= 0 || formData.price <= 0) {
      toast({
        title: "Valores inválidos",
        description: "Duração e preço devem ser maiores que zero.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Serviço salvo!",
      description: `${formData.name} foi ${service ? 'atualizado' : 'adicionado'} com sucesso.`,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="gradient-card shadow-card w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Scissors className="w-5 h-5 text-primary" />
              <span>{service ? 'Editar' : 'Novo'} Serviço</span>
            </CardTitle>
            <CardDescription>
              Configure nome, duração, preço e categoria
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Nome do Serviço *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Corte de Cabelo Masculino"
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o serviço oferecido..."
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration" className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Duração (minutos) *</span>
              </Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                placeholder="30"
                min="1"
                max="300"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="price" className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>Preço (R$) *</span>
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="40.00"
                step="0.01"
                min="0"
                className="mt-2"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label>Serviço ativo</Label>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
              <h4 className="font-medium text-foreground mb-2">Resumo do Serviço</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-medium">{formData.name || "Nome do serviço"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categoria:</span>
                  <span className="font-medium">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duração:</span>
                  <span className="font-medium">{formData.duration} minutos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preço:</span>
                  <span className="font-medium text-primary">R$ {formData.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-medium ${formData.active ? 'text-success' : 'text-muted-foreground'}`}>
                    {formData.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1 gradient-primary">
                {service ? 'Atualizar' : 'Adicionar'} Serviço
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceForm;