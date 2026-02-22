import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-2.5 rounded-xl", colorMap[color])}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Card>
  );
}