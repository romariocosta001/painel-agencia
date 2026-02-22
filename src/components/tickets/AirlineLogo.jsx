import { cn } from "@/lib/utils";

const airlineColors = {
  "LATAM": "from-indigo-600 to-red-500",
  "GOL": "from-orange-500 to-orange-600",
  "Azul": "from-blue-600 to-blue-700",
  "Avianca": "from-red-600 to-red-700",
  "TAP": "from-green-600 to-green-700",
  "Emirates": "from-red-700 to-amber-600",
  "American Airlines": "from-blue-700 to-red-600",
  "Delta": "from-blue-800 to-red-500",
  "United": "from-blue-900 to-blue-600",
  "Air France": "from-blue-700 to-red-500",
  "Lufthansa": "from-yellow-500 to-blue-900",
  "British Airways": "from-blue-800 to-red-600",
  "Qatar Airways": "from-purple-900 to-purple-700",
  "Turkish Airlines": "from-red-600 to-red-700",
  "Iberia": "from-red-600 to-yellow-500",
};

export default function AirlineLogo({ airline, size = "md" }) {
  const gradient = airlineColors[airline] || "from-slate-500 to-slate-600";
  const initials = airline
    ? airline.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
  };

  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-br flex items-center justify-center font-bold text-white shadow-sm",
        gradient,
        sizeClasses[size]
      )}
    >
      {initials}
    </div>
  );
}