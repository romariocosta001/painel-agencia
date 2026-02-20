import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, Plane, User, Mail, FileText, MapPin,
  Clock, Calendar, Armchair, Luggage, CreditCard,
  ShieldCheck, Download, CheckCircle2, Loader2, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import StatusBadge from "../components/tickets/StatusBadge";
import AirlineLogo from "../components/tickets/AirlineLogo";

export default function TicketDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get("id");
  const queryClient = useQueryClient();
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const { data: ticket, isLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => base44.entities.Ticket.filter({ id: ticketId }),
    select: (data) => data?.[0],
    enabled: !!ticketId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Ticket.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] }),
  });

  const handleVerify = async () => {
    setVerifying(true);
    setVerificationResult(null);
    // Simulate verification delay
    await new Promise((r) => setTimeout(r, 2000));
    const isValid = ticket.status === "valido" || ticket.status === "pendente";
    setVerificationResult(isValid ? "valid" : "invalid");
    if (ticket.status === "pendente" && isValid) {
      updateMutation.mutate({ id: ticket.id, data: { status: "valido" } });
    }
    setVerifying(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">Bilhete não encontrado</p>
        <Link to={createPageUrl("Tickets")}>
          <Button variant="outline" className="mt-4">Voltar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={createPageUrl("Tickets")}>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Detalhes do Bilhete</h1>
            <p className="text-xs text-slate-400 font-mono">{ticket.emission_id}</p>
          </div>
        </div>
        <StatusBadge status={ticket.status} size="lg" />
      </div>

      {/* Boarding Pass Style Card */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <AirlineLogo airline={ticket.airline} size="lg" />
            <div className="text-right">
              <p className="text-blue-200 text-xs uppercase tracking-wider">Voo</p>
              <p className="text-xl font-bold">{ticket.flight_code}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{ticket.origin}</p>
              <p className="text-blue-200 text-sm">{ticket.origin_city || "—"}</p>
            </div>
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="flex-1 border-t border-dashed border-white/30 mx-2" />
              <Plane className="w-5 h-5 text-white" />
              <div className="flex-1 border-t border-dashed border-white/30 mx-2" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{ticket.destination}</p>
              <p className="text-blue-200 text-sm">{ticket.destination_city || "—"}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <InfoItem icon={Calendar} label="Partida" value={
              ticket.departure_date
                ? format(new Date(ticket.departure_date + "T00:00:00"), "dd MMM yyyy", { locale: ptBR })
                : "—"
            } />
            <InfoItem icon={Clock} label="Horário" value={ticket.departure_time || "—"} />
            <InfoItem icon={Calendar} label="Chegada" value={
              ticket.arrival_date
                ? format(new Date(ticket.arrival_date + "T00:00:00"), "dd MMM yyyy", { locale: ptBR })
                : "—"
            } />
            <InfoItem icon={Clock} label="Horário" value={ticket.arrival_time || "—"} />
          </div>
        </CardContent>
      </Card>

      {/* Passenger & Ticket Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">Passageiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={User} label="Nome" value={ticket.passenger_name} />
            <InfoRow icon={Mail} label="E-mail" value={ticket.passenger_email || "—"} />
            <InfoRow icon={FileText} label="Documento" value={ticket.passenger_document || "—"} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">Detalhes do Voo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow icon={Plane} label="Companhia" value={ticket.airline} />
            <InfoRow icon={Armchair} label="Assento" value={ticket.seat || "—"} />
            <InfoRow icon={Luggage} label="Bagagem" value={ticket.baggage_included ? "Incluída" : "Não incluída"} />
            <InfoRow icon={CreditCard} label="Tarifa" value={
              ticket.fare_amount
                ? `R$ ${ticket.fare_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : "—"
            } />
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 w-20">Classe</span>
              <Badge variant="outline" className="text-xs">{ticket.cabin_class || "Econômica"}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {ticket.notes && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{ticket.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleVerify}
              disabled={verifying}
              variant="outline"
              className="gap-2"
            >
              {verifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              Verificar Bilhete
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Baixar Bilhete
            </Button>
          </div>
          {verificationResult && (
            <div className={`mt-4 flex items-center gap-2 text-sm rounded-xl p-3 ${
              verificationResult === "valid"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}>
              {verificationResult === "valid" ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Bilhete verificado com sucesso — status válido.
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Este bilhete não está ativo. Verifique com a companhia aérea.
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-xs text-slate-500 w-20">{label}</span>
      <span className="text-sm text-slate-800 font-medium">{value}</span>
    </div>
  );
}