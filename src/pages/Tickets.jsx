import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import TicketRow from "../components/tickets/TicketRow";

export default function Tickets() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [airlineFilter, setAirlineFilter] = useState("todas");
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => base44.entities.Ticket.list("-created_date", 200),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Ticket.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tickets"] }),
  });

  const filtered = tickets.filter((t) => {
    const matchSearch =
      !search ||
      t.passenger_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.flight_code?.toLowerCase().includes(search.toLowerCase()) ||
      t.origin?.toLowerCase().includes(search.toLowerCase()) ||
      t.destination?.toLowerCase().includes(search.toLowerCase()) ||
      t.emission_id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || t.status === statusFilter;
    const matchAirline = airlineFilter === "todas" || t.airline === airlineFilter;
    return matchSearch && matchStatus && matchAirline;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Bilhetes</h1>
        <Link to={createPageUrl("FareRules")}>
          <Button variant="outline" size="sm" className="h-9 text-xs">
            Regras tarifárias
          </Button>
        </Link>
      </div>

      {/* New Ticket Button */}
      <Link to={createPageUrl("NewTicket")}>
        <Button className="w-full h-12 bg-indigo-950 hover:bg-indigo-900 text-white gap-2 rounded-xl shadow-sm">
          <Plus className="w-5 h-5" />
          Novo bilhete
        </Button>
      </Link>

      {/* Stats */}
      <div className="text-center py-4">
        <p className="text-sm text-slate-500">
          Mostrando: <span className="font-semibold text-slate-900">{filtered.length} bilhete(s)</span>
        </p>
        <p className="text-xs text-slate-400">Sem filtro ativo</p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Digite o Localizador/Número da Compra"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-11 rounded-xl border-slate-200"
        />
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Button>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">Nenhum bilhete encontrado</p>
            <p className="text-xs text-slate-400 mt-1">Tente ajustar os filtros</p>
          </div>
        ) : (
          filtered.map((ticket) => (
            <TicketRow key={ticket.id} ticket={ticket} onDelete={deleteMutation.mutate} />
          ))
        )}
      </div>
    </div>
  );
}