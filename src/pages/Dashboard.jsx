import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plane, Users, CheckCircle2, Clock, XCircle } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import RecentTickets from "../components/dashboard/RecentTickets";
import StatusChart from "../components/dashboard/StatusChart";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => base44.entities.Ticket.list("-created_date", 100),
    initialData: [],
  });

  const totalTickets = tickets.length;
  const validTickets = tickets.filter((t) => t.status === "valido").length;
  const pendingTickets = tickets.filter((t) => t.status === "pendente").length;
  const cancelledTickets = tickets.filter((t) => t.status === "cancelado").length;
  const uniquePassengers = new Set(tickets.map((t) => t.passenger_name)).size;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Visão geral dos seus bilhetes aéreos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total" value={totalTickets} icon={Plane} color="blue" subtitle="bilhetes" />
        <StatCard title="Válidos" value={validTickets} icon={CheckCircle2} color="emerald" />
        <StatCard title="Pendentes" value={pendingTickets} icon={Clock} color="amber" />
        <StatCard title="Cancelados" value={cancelledTickets} icon={XCircle} color="red" />
        <StatCard title="Passageiros" value={uniquePassengers} icon={Users} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTickets tickets={tickets} />
        </div>
        <StatusChart tickets={tickets} />
      </div>
    </div>
  );
}