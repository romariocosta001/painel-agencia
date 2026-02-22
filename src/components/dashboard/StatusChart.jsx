import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  valido: "#10b981",
  pendente: "#f59e0b",
  cancelado: "#ef4444",
  embarcado: "#3b82f6",
  expirado: "#94a3b8",
};

const LABELS = {
  valido: "Válido",
  pendente: "Pendente",
  cancelado: "Cancelado",
  embarcado: "Embarcado",
  expirado: "Expirado",
};

export default function StatusChart({ tickets = [] }) {
  const statusCounts = tickets.reduce((acc, t) => {
    const s = t.status || "pendente";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name: LABELS[name] || name,
    value,
    key: name,
  }));

  if (data.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Status dos Bilhetes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 text-center py-8">Sem dados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Status dos Bilhetes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.key} fill={COLORS[entry.key] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {data.map((item) => (
              <div key={item.key} className="flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[item.key] }}
                />
                <span className="text-xs text-slate-600 flex-1">{item.name}</span>
                <span className="text-xs font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}