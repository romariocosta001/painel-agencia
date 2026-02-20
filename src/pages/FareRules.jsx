import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, BookOpen, XCircle, RefreshCw, Luggage, ArrowLeftRight, ArrowUpCircle, Trash2 } from "lucide-react";
import AirlineLogo from "../components/tickets/AirlineLogo";

const AIRLINES = ["LATAM", "GOL", "Azul", "Avianca", "TAP", "Emirates", "American Airlines", "Delta", "United", "Air France", "Lufthansa", "British Airways", "Qatar Airways", "Turkish Airlines", "Iberia"];
const RULE_TYPES = [
  { value: "cancelamento", label: "Cancelamento", icon: XCircle, color: "text-red-500" },
  { value: "remarcacao", label: "Remarcação", icon: RefreshCw, color: "text-amber-500" },
  { value: "bagagem", label: "Bagagem", icon: Luggage, color: "text-blue-500" },
  { value: "reembolso", label: "Reembolso", icon: ArrowLeftRight, color: "text-emerald-500" },
  { value: "upgrade", label: "Upgrade", icon: ArrowUpCircle, color: "text-purple-500" },
];

export default function FareRules() {
  const [airlineFilter, setAirlineFilter] = useState("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["fareRules"],
    queryFn: () => base44.entities.FareRule.list("-created_date", 200),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FareRule.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fareRules"] }),
  });

  const filtered = airlineFilter === "todas"
    ? rules
    : rules.filter((r) => r.airline === airlineFilter);

  // Group by airline
  const grouped = filtered.reduce((acc, rule) => {
    if (!acc[rule.airline]) acc[rule.airline] = [];
    acc[rule.airline].push(rule);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Regras Tarifárias</h1>
          <p className="text-sm text-slate-500 mt-1">Políticas de cancelamento, remarcação e bagagem</p>
        </div>
        <div className="flex gap-3">
          <Select value={airlineFilter} onValueChange={setAirlineFilter}>
            <SelectTrigger className="w-44 bg-white border-slate-200 h-10">
              <SelectValue placeholder="Companhia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {AIRLINES.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2">
                <Plus className="w-4 h-4" />
                Nova Regra
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar Regra Tarifária</DialogTitle>
              </DialogHeader>
              <NewRuleForm
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["fareRules"] });
                  setDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">Nenhuma regra tarifária cadastrada</p>
          <p className="text-xs text-slate-400 mt-1">Adicione regras para as companhias aéreas</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([airline, airlineRules]) => (
            <Card key={airline} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <AirlineLogo airline={airline} size="sm" />
                  <CardTitle className="text-base font-semibold text-slate-800">{airline}</CardTitle>
                  <Badge variant="outline" className="text-xs">{airlineRules.length} regra{airlineRules.length !== 1 ? "s" : ""}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {airlineRules.map((rule) => {
                    const ruleType = RULE_TYPES.find((rt) => rt.value === rule.rule_type);
                    const Icon = ruleType?.icon || BookOpen;
                    return (
                      <div key={rule.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 group">
                        <div className={`mt-0.5 ${ruleType?.color || "text-slate-400"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-800 capitalize">
                              {ruleType?.label || rule.rule_type}
                            </span>
                            {rule.cabin_class && (
                              <Badge variant="outline" className="text-xs">{rule.cabin_class}</Badge>
                            )}
                            {!rule.is_allowed && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">Não permitido</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{rule.description}</p>
                          {rule.fee_amount > 0 && (
                            <p className="text-xs text-slate-500 mt-1">
                              Taxa: R$ {rule.fee_amount?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              {rule.deadline_hours ? ` · Até ${rule.deadline_hours}h antes` : ""}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteMutation.mutate(rule.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function NewRuleForm({ onSuccess }) {
  const [form, setForm] = useState({
    airline: "",
    rule_type: "",
    cabin_class: "Econômica",
    description: "",
    fee_amount: "",
    deadline_hours: "",
    is_allowed: true,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FareRule.create(data),
    onSuccess,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      fee_amount: form.fee_amount ? parseFloat(form.fee_amount) : undefined,
      deadline_hours: form.deadline_hours ? parseFloat(form.deadline_hours) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Companhia *</Label>
          <Select value={form.airline} onValueChange={(v) => setForm({ ...form, airline: v })}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {AIRLINES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tipo *</Label>
          <Select value={form.rule_type} onValueChange={(v) => setForm({ ...form, rule_type: v })}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {RULE_TYPES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Classe</Label>
        <Select value={form.cabin_class} onValueChange={(v) => setForm({ ...form, cabin_class: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Econômica">Econômica</SelectItem>
            <SelectItem value="Econômica Premium">Econômica Premium</SelectItem>
            <SelectItem value="Executiva">Executiva</SelectItem>
            <SelectItem value="Primeira Classe">Primeira Classe</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Descrição *</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descreva a regra tarifária..."
          rows={3}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Taxa (R$)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.fee_amount}
            onChange={(e) => setForm({ ...form, fee_amount: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Prazo (horas antes)</Label>
          <Input
            type="number"
            min="0"
            value={form.deadline_hours}
            onChange={(e) => setForm({ ...form, deadline_hours: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={form.is_allowed} onCheckedChange={(v) => setForm({ ...form, is_allowed: v })} />
        <Label>Permitido</Label>
      </div>
      <Button type="submit" disabled={createMutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700">
        {createMutation.isPending ? "Salvando..." : "Salvar Regra"}
      </Button>
    </form>
  );
}