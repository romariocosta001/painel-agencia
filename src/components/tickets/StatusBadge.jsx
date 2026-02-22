import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Plane, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  valido: {
    label: "Válido",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  },
  pendente: {
    label: "Pendente",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  },
  embarcado: {
    label: "Embarcado",
    icon: Plane,
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  },
  expirado: {
    label: "Expirado",
    icon: AlertTriangle,
    className: "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-50",
  },
};

export default function StatusBadge({ status, size = "default" }) {
  const config = statusConfig[status] || statusConfig.pendente;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium gap-1.5 border",
        config.className,
        size === "lg" && "text-sm px-3 py-1"
      )}
    >
      <Icon className={cn("w-3 h-3", size === "lg" && "w-4 h-4")} />
      {config.label}
    </Badge>
  );
}