import React from "react";
import { FileSpreadsheet, CheckCircle2, BookOpen } from "lucide-react";
import { EtapaMemoria } from "../../types/tax";
import { formatCurrencyBRL } from "../../utils/formatters";

interface CalculationMemoryTableProps {
  etapas: EtapaMemoria[] | undefined;
}

export const CalculationMemoryTable: React.FC<CalculationMemoryTableProps> = ({
  etapas,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            <span>Memória de Cálculo Detalhada e Embasamento Legal</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rastreabilidade completa de cada etapa com citação direta de leis, artigos da Constituição e decretos estaduais (AM/ZFM)
          </p>
        </div>
        <span className="bg-emerald-50 text-emerald-800 font-bold text-xs px-3 py-1 rounded-lg border border-emerald-200/80 flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
          Auditoria Fiscal &amp; Jurídica
        </span>
      </div>

      {!etapas || etapas.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-sm font-mono">
          Nenhuma memória de cálculo disponível para a simulação atual.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3 font-mono w-12">Passo</th>
                <th className="py-3 px-4">Descrição da Regra Aplicada</th>
                <th className="py-3 px-4">Embasamento Legal / Norma</th>
                <th className="py-3 px-4 text-right font-mono">Impacto / Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs text-slate-700">
              {etapas.map((etapa, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-3 text-slate-400 font-bold">
                    #{String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-800 font-medium">
                    {etapa.descricao}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-500 text-[11px]">
                    {etapa.embasamento_legal ? (
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 block text-[10px] leading-tight font-medium">
                        📜 {etapa.embasamento_legal}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {typeof etapa.valor === "number" ? (
                      <span
                        className={
                          etapa.valor < 0
                            ? "text-emerald-600 font-extrabold"
                            : "text-slate-900"
                        }
                      >
                        {formatCurrencyBRL(etapa.valor)}
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                        {etapa.valor}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Cálculos fundamentados no Art. 92-B do ADCT (EC 132/2023), PLP 68/2024 e Legislação do Amazonas
        </span>
      </div>
    </div>
  );
};
