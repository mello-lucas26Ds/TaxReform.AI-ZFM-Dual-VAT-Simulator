import React, { useEffect, useState } from "react";
import { Eye, Activity, Users } from "lucide-react";
import { getCounterStats, registerVisit, CounterStats } from "../../utils/counterService";

interface AccessCounterProps {
  variant?: "header" | "footer";
}

export const AccessCounter: React.FC<AccessCounterProps> = ({ variant = "header" }) => {
  const [stats, setStats] = useState<CounterStats>({ visitsCount: 0, usageCount: 0 });

  useEffect(() => {
    // Registra a visita no carregamento inicial
    const initialStats = registerVisit();
    setStats(initialStats);

    // Escuta atualizações do evento de simulação/uso
    const handleUpdate = () => {
      setStats(getCounterStats());
    };

    window.addEventListener("tax_counter_updated", handleUpdate);
    return () => {
      window.removeEventListener("tax_counter_updated", handleUpdate);
    };
  }, []);

  if (variant === "footer") {
    return (
      <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-slate-100/80 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-slate-600">
        <span className="flex items-center gap-1.5 text-slate-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Users className="h-3.5 w-3.5 text-slate-500" />
          <span>Acessos ao Projeto:</span>
          <strong className="text-slate-900 font-bold">{stats.visitsCount.toLocaleString("pt-BR")}</strong>
        </span>

        <span className="text-slate-300">•</span>

        <span className="flex items-center gap-1.5 text-slate-700">
          <Activity className="h-3.5 w-3.5 text-emerald-600" />
          <span>Simulações Executadas:</span>
          <strong className="text-emerald-800 font-bold">{stats.usageCount.toLocaleString("pt-BR")}</strong>
        </span>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1 text-xs">
      <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Eye className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-500">Acessos:</span>
        <span className="font-bold text-slate-800">{stats.visitsCount.toLocaleString("pt-BR")}</span>
      </div>

      <span className="text-slate-300 font-light">|</span>

      <div className="flex items-center gap-1 text-slate-600 font-medium text-[11px]">
        <Activity className="h-3.5 w-3.5 text-emerald-600" />
        <span className="text-slate-500">Usos:</span>
        <span className="font-bold text-emerald-700">{stats.usageCount.toLocaleString("pt-BR")}</span>
      </div>
    </div>
  );
};
