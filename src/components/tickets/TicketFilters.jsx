import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function TicketFilters({ search, onSearchChange, statusFilter, onStatusChange, airlineFilter, onAirlineChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar por passageiro, voo ou destino..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white border-slate-200 h-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 h-10">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="valido">Válido</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
          <SelectItem value="embarcado">Embarcado</SelectItem>
          <SelectItem value="expirado">Expirado</SelectItem>
        </SelectContent>
      </Select>
      <Select value={airlineFilter} onValueChange={onAirlineChange}>
        <SelectTrigger className="w-full sm:w-44 bg-white border-slate-200 h-10">
          <SelectValue placeholder="Companhia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="LATAM">LATAM</SelectItem>
          <SelectItem value="GOL">GOL</SelectItem>
          <SelectItem value="Azul">Azul</SelectItem>
          <SelectItem value="Avianca">Avianca</SelectItem>
          <SelectItem value="TAP">TAP</SelectItem>
          <SelectItem value="Emirates">Emirates</SelectItem>
          <SelectItem value="American Airlines">American Airlines</SelectItem>
          <SelectItem value="Delta">Delta</SelectItem>
          <SelectItem value="United">United</SelectItem>
          <SelectItem value="Air France">Air France</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}