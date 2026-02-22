import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import StatusBadge from "../tickets/StatusBadge";
import AirlineLogo from "../tickets/AirlineLogo";

export default function RecentTickets({ tickets = [] }) {
  const recent = tickets.slice(0, 5);

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Bilhetes Recentes
          </CardTitle>
          <Link to={createPageUrl("Tickets")}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1.5">
              Ver todos
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {recent.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Plane className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">Nenhum bilhete cadastrado</p>
          </div>
        ) : (
          <div className="space-y-1">
            {recent.map((ticket) => (
              <Link
                key={ticket.id}
                to={createPageUrl("TicketDetails") + `?id=${ticket.id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <AirlineLogo airline={ticket.airline} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {ticket.passenger_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {ticket.origin} → {ticket.destination} · {ticket.flight_code}
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-slate-500">
                    {ticket.departure_date
                      ? format(new Date(ticket.departure_date + "T00:00:00"), "dd MMM", { locale: ptBR })
                      : "—"}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}