import React from "react";
import { ShieldCheck, Database, MapPin } from "lucide-react";
import { AccessCounter } from "./AccessCounter";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500 font-sans print:hidden">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-medium text-[11px]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Em conformidade com a EC 132/2023 &amp; PLP 68/2024 (Art. 92-B ADCT - ZFM)
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Regras estaduais do Amazonas (Lei AM nº 6.108/22 e Convênio ICMS 65/88)
          </span>
          <span className="flex items-center gap-1.5">
            <Database className="h-4 w-4 text-blue-600" />
            Processamento 100% local em memória volátil
          </span>
        </div>

        {/* Counter Badge */}
        <div className="pt-1">
          <AccessCounter variant="footer" />
        </div>

        <p className="text-slate-500 text-xs font-semibold pt-1">
          Engine de Simulação Tributária • Especial Amazonas &amp; Zona Franca de Manaus
        </p>
        <p className="text-[10px] text-slate-400 max-w-2xl mx-auto">
          Ferramenta para fins de simulação, auditoria, análise comparativa e planejamento tributário.
          Os cálculos consideram as normas constitucionais da Reforma Tributária (IBS/CBS) e as garantias da ZFM até 2073.
        </p>
      </div>
    </footer>
  );
};
