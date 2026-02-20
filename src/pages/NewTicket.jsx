import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plane, Save, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const AIRLINES = ["LATAM", "GOL", "Azul", "Avianca", "TAP", "Emirates", "American Airlines", "Delta", "United", "Air France", "Lufthansa", "British Airways", "Qatar Airways", "Turkish Airlines", "Iberia"];
const CLASSES = ["Econômica", "Econômica Premium", "Executiva", "Primeira Classe"];

export default function NewTicket() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    passenger_name: "",
    passenger_email: "",
    passenger_document: "",
    airline: "",
    flight_code: "",
    origin: "",
    origin_city: "",
    destination: "",
    destination_city: "",
    departure_date: "",
    departure_time: "",
    arrival_date: "",
    arrival_time: "",
    seat: "",
    cabin_class: "Econômica",
    fare_amount: "",
    status: "pendente",
    baggage_included: true,
    notes: "",
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Ticket.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      navigate(createPageUrl("Tickets"));
    },
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emissionId = "EMI-" + Date.now().toString(36).toUpperCase();
    createMutation.mutate({
      ...form,
      emission_id: emissionId,
      fare_amount: form.fare_amount ? parseFloat(form.fare_amount) : undefined,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={createPageUrl("Tickets")}>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Novo Bilhete</h1>
          <p className="text-sm text-slate-500">Preencha os dados do bilhete aéreo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Passenger Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-slate-800">Dados do Passageiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome completo *</Label>
                <Input
                  value={form.passenger_name}
                  onChange={(e) => handleChange("passenger_name", e.target.value)}
                  placeholder="João da Silva"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={form.passenger_email}
                  onChange={(e) => handleChange("passenger_email", e.target.value)}
                  placeholder="joao@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Documento (CPF/Passaporte)</Label>
              <Input
                value={form.passenger_document}
                onChange={(e) => handleChange("passenger_document", e.target.value)}
                placeholder="123.456.789-00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Flight Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Plane className="w-4 h-4" /> Dados do Voo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Companhia aérea *</Label>
                <Select value={form.airline} onValueChange={(v) => handleChange("airline", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {AIRLINES.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Código do voo *</Label>
                <Input
                  value={form.flight_code}
                  onChange={(e) => handleChange("flight_code", e.target.value.toUpperCase())}
                  placeholder="LA1234"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Classe</Label>
                <Select value={form.cabin_class} onValueChange={(v) => handleChange("cabin_class", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Origem (IATA) *</Label>
                <Input
                  value={form.origin}
                  onChange={(e) => handleChange("origin", e.target.value.toUpperCase())}
                  placeholder="GRU"
                  maxLength={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Cidade origem</Label>
                <Input
                  value={form.origin_city}
                  onChange={(e) => handleChange("origin_city", e.target.value)}
                  placeholder="São Paulo"
                />
              </div>
              <div className="space-y-2">
                <Label>Destino (IATA) *</Label>
                <Input
                  value={form.destination}
                  onChange={(e) => handleChange("destination", e.target.value.toUpperCase())}
                  placeholder="GIG"
                  maxLength={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Cidade destino</Label>
                <Input
                  value={form.destination_city}
                  onChange={(e) => handleChange("destination_city", e.target.value)}
                  placeholder="Rio de Janeiro"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Data partida *</Label>
                <Input
                  type="date"
                  value={form.departure_date}
                  onChange={(e) => handleChange("departure_date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Hora partida</Label>
                <Input
                  type="time"
                  value={form.departure_time}
                  onChange={(e) => handleChange("departure_time", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Data chegada</Label>
                <Input
                  type="date"
                  value={form.arrival_date}
                  onChange={(e) => handleChange("arrival_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora chegada</Label>
                <Input
                  type="time"
                  value={form.arrival_time}
                  onChange={(e) => handleChange("arrival_time", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-slate-800">Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Assento</Label>
                <Input
                  value={form.seat}
                  onChange={(e) => handleChange("seat", e.target.value.toUpperCase())}
                  placeholder="12A"
                />
              </div>
              <div className="space-y-2">
                <Label>Valor da tarifa (R$)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.fare_amount}
                  onChange={(e) => handleChange("fare_amount", e.target.value)}
                  placeholder="1.500,00"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="valido">Válido</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="embarcado">Embarcado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.baggage_included}
                onCheckedChange={(v) => handleChange("baggage_included", v)}
              />
              <Label className="cursor-pointer">Bagagem incluída</Label>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Notas adicionais sobre o bilhete..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pb-6">
          <Link to={createPageUrl("Tickets")}>
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Salvar Bilhete
          </Button>
        </div>
      </form>
    </div>
  );
}