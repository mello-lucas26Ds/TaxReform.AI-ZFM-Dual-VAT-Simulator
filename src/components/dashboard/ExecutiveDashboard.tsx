import React from "react";
import {
  Network,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Minus,
  Award,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SimulacaoResponse, SimulacaoInput } from "../../types/tax";
import { formatCurrencyBRL } from "../../utils/formatters";

interface ExecutiveDashboardProps {
  apiResponse: SimulacaoResponse | null;
  form: SimulacaoInput;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  apiResponse,
  form,
}) => {
  const isZfmLocation =
    form.regime_zfm === "ZFM_POLO_INDUSTRIAL" ||
    form.regime_zfm === "ZFM_ALC_TABATINGA" ||
    form.uf_destino === "AM" ||
    form.uf_origem === "AM";

  const isReducao30Servicos = form.beneficio_fiscal === "REDUCAO_30_SERVICOS";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 relative overflow-hidden">
      <div className="pointer-events-none absolute top-[-100px] right-[-100px] w-64 h-64 bg-emerald-600/15 rounded-full blur-[80px]"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-display flex items-center gap-2">
          <Network className="h-4 w-4 text-emerald-400" />
          <span>Análise Executiva da Operação Fiscal (AM &amp; ZFM)</span>
        </h3>

        {isZfmLocation && (
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Award className="h-3.5 w-3.5" />
            Diferencial Constitucional ZFM
          </span>
        )}
      </div>

      <div className="space-y-6">
        {apiResponse?.status === "sucesso" ? (
          <>
            {/* Total Card */}
            <div className="text-center py-5 bg-slate-950/60 rounded-xl border border-slate-800 relative">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Novos Tributos Apurados (CBS + IBS + IS)
              </span>
              <span className="text-4xl font-black font-mono text-emerald-400">
                {formatCurrencyBRL(apiResponse.tributos?.total_tributo)}
              </span>
              <div className="mt-2 text-[10px] font-mono text-slate-400">
                Alíquota efetiva apurada:{" "}
                {(
                  ((apiResponse.tributos?.total_tributo || 0) / (form.valor_operacao || 1)) *
                  100
                ).toFixed(2)}
                % sobre o valor da operação
              </div>
            </div>

            {/* Redução 30% Serviços Card (Se Ativo) */}
            {isReducao30Servicos && (
              <div className="bg-amber-950/40 border border-amber-800/60 p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Award className="h-5 w-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-amber-300 block">
                      Redução de 30% em Serviços (Art. 129 do PLP 68/2024)
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Benefício aplicado para profissionais liberais e serviços regulamentados
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs font-black text-amber-300 bg-amber-900/60 px-2.5 py-1 rounded-lg border border-amber-700/60">
                  -30% Alíquota
                </span>
              </div>
            )}

            {/* Split Payment Retention Widget */}
            {apiResponse.split_payment && (
              <div className="bg-slate-950/90 border border-amber-500/30 p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Zap className="h-5 w-5 text-amber-400 shrink-0 fill-amber-400" />
                  <div>
                    <span className="text-xs font-bold text-amber-200 block">
                      Split Payment Retido na Fonte (Liquidação)
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Vendedor recebe R$ {apiResponse.split_payment.valor_liquido_vendedor.toLocaleString('pt-BR', {minimumFractionDigits: 2})} no PIX/Cartão
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs font-black text-amber-400 bg-amber-950 border border-amber-800 px-2.5 py-1 rounded-lg">
                  -{formatCurrencyBRL(apiResponse.split_payment.total_retencao_split)}
                </span>
              </div>
            )}

            {/* Crédito Presumido ZFM Card (If applicable) */}
            {(apiResponse.tributos?.credito_presumido_zfm || 0) > 0 && (
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">
                      Crédito Presumido da Zona Franca de Manaus (PIM)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Garantido pelo Art. 92-B do ADCT para produtos com PPB no Amazonas
                    </span>
                  </div>
                </div>
                <span className="font-mono text-sm font-black text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-700/60">
                  +{formatCurrencyBRL(apiResponse.tributos?.credito_presumido_zfm)}
                </span>
              </div>
            )}

            {/* Breakdown Cards */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">
                  CBS (Federal)
                </span>
                <span className="text-[15px] font-bold text-teal-400 mt-1 block">
                  {formatCurrencyBRL(apiResponse.tributos?.cbs)}
                </span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">
                  IBS (Est/Mun)
                </span>
                <span className="text-[15px] font-bold text-indigo-400 mt-1 block">
                  {formatCurrencyBRL(apiResponse.tributos?.ibs)}
                </span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">
                  IS (Seletivo)
                </span>
                <span
                  className={`text-[15px] font-bold mt-1 block ${
                    (apiResponse.tributos?.is || 0) > 0 ? "text-amber-400 font-extrabold" : "text-slate-500"
                  }`}
                >
                  {formatCurrencyBRL(apiResponse.tributos?.is)}
                </span>
              </div>
            </div>

            {/* COMPARATIVO HOJE VS REFORMA */}
            <div className="border-t border-slate-800/80 pt-5 space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ⚖️ Comparativo de Carga Tributária Nominal (Hoje vs. Reforma)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                {/* Hoje */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">
                      Tributação Atual ({form.regime_tributario.replace('_', ' ')})
                    </span>

                    <div className="space-y-1 font-mono text-[11px] text-slate-300 mt-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">PIS:</span>
                        <span>{formatCurrencyBRL(apiResponse.tributos_hoje?.pis)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">COFINS:</span>
                        <span>{formatCurrencyBRL(apiResponse.tributos_hoje?.cofins)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          {apiResponse.tributos_hoje?.icms_or_iss_tipo}:
                        </span>
                        <span>{formatCurrencyBRL(apiResponse.tributos_hoje?.icms_or_iss)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Total Atual:
                    </span>
                    <span className="font-mono text-sm font-extrabold text-slate-200">
                      {formatCurrencyBRL(apiResponse.tributos_hoje?.total_hoje)}
                    </span>
                  </div>
                </div>

                {/* Reforma */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">
                      Reforma Tributária (CBS + IBS + IS)
                    </span>
                    <div className="space-y-1 font-mono text-[11px] text-slate-300 mt-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">CBS:</span>
                        <span>{formatCurrencyBRL(apiResponse.tributos?.cbs)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">IBS:</span>
                        <span>{formatCurrencyBRL(apiResponse.tributos?.ibs)}</span>
                      </div>
                      {apiResponse.tributos?.is && apiResponse.tributos.is > 0 ? (
                        <div className="flex justify-between text-amber-400">
                          <span className="text-amber-500">IS:</span>
                          <span>{formatCurrencyBRL(apiResponse.tributos.is)}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Total Reforma:
                    </span>
                    <span className="font-mono text-sm font-extrabold text-emerald-400">
                      {formatCurrencyBRL(apiResponse.tributos?.total_tributo)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Banner de Diferença */}
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 transition duration-200 ${
                  apiResponse.diferenca_tributos?.tipo === "AUMENTO"
                    ? "bg-amber-950/30 border-amber-800/40 text-amber-200"
                    : apiResponse.diferenca_tributos?.tipo === "REDUCAO"
                    ? "bg-emerald-950/20 border-emerald-800/30 text-emerald-200"
                    : "bg-slate-950/50 border-slate-800 text-slate-300"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    apiResponse.diferenca_tributos?.tipo === "AUMENTO"
                      ? "bg-amber-500/10 text-amber-400"
                      : apiResponse.diferenca_tributos?.tipo === "REDUCAO"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {apiResponse.diferenca_tributos?.tipo === "AUMENTO" ? (
                    <TrendingUp className="h-4.5 w-4.5 text-amber-400" />
                  ) : apiResponse.diferenca_tributos?.tipo === "REDUCAO" ? (
                    <TrendingDown className="h-4.5 w-4.5 text-emerald-400" />
                  ) : (
                    <Minus className="h-4.5 w-4.5 text-slate-400" />
                  )}
                </div>
                <div className="text-xs leading-relaxed font-sans flex-1">
                  {apiResponse.diferenca_tributos?.tipo === "AUMENTO" ? (
                    <>
                      <span className="font-bold text-amber-400 block mb-0.5">
                        Acréscimo na Carga Bruta Nominal
                      </span>
                      Variação tributária de{" "}
                      <b className="font-mono text-amber-300">
                        {formatCurrencyBRL(apiResponse.diferenca_tributos.valor)}
                      </b>{" "}
                      (+{apiResponse.diferenca_tributos.porcentagem}%) em relação ao sistema atual.
                    </>
                  ) : apiResponse.diferenca_tributos?.tipo === "REDUCAO" ? (
                    <>
                      <span className="font-bold text-emerald-400 block mb-0.5">
                        Redução na Carga Tributária!
                      </span>
                      Economia nominal de{" "}
                      <b className="font-mono text-emerald-300">
                        {formatCurrencyBRL(Math.abs(apiResponse.diferenca_tributos.valor))}
                      </b>{" "}
                      ({apiResponse.diferenca_tributos.porcentagem}%) garantida pelo regime de incentivos da ZFM/Reforma.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-300 block mb-0.5">
                        Carga Equivalente
                      </span>
                      Valor total nominal idêntico nos dois sistemas.
                    </>
                  )}
                </div>
              </div>

              {/* Nota Esclarecedora */}
              <div className="bg-emerald-950/20 border border-emerald-900/40 p-3.5 rounded-xl text-[11px] text-emerald-300 leading-relaxed font-sans">
                <p className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>
                    <strong className="text-emerald-200 block mb-0.5">
                      Proteção Constitucional da Zona Franca de Manaus (Art. 92-B ADCT)
                    </strong>
                    A EC 132/2023 garante a preservação das vantagens competitivas do Polo Industrial de Manaus até 2073 através da manutenção de crédito acumulado, alíquota zero nas entradas e isenção do Imposto Seletivo para indústrias habilitadas pela Suframa com PPB.
                  </span>
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-amber-950/35 border border-amber-800 rounded-xl p-4 text-amber-300 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Dados Incompletos para Simulação</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Verifique os campos obrigatórios no formulário de entrada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
