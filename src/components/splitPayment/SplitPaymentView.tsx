import React from "react";
import { Zap, ShieldCheck, ArrowRight, Wallet, Landmark, Cpu, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SimulacaoResponse, SimulacaoInput, SplitPaymentModalidade } from "../../types/tax";
import { formatCurrencyBRL } from "../../utils/formatters";

interface SplitPaymentViewProps {
  apiResponse: SimulacaoResponse | null;
  form: SimulacaoInput;
  setSplitModalidade?: (modalidade: SplitPaymentModalidade) => void;
}

export const SplitPaymentView: React.FC<SplitPaymentViewProps> = ({
  apiResponse,
  form,
  setSplitModalidade,
}) => {
  const splitData = apiResponse?.split_payment;
  const currentModalidade = form.split_modalidade || "AUTOMATICO";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Mecanismo "Split Payment" (Pagamento Dividido)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mecanismo revolucionário da Reforma Tributária (Art. 49 a 55 do PLP 68/2024 / EC 132/2023) que segrega e retém o IBS e a CBS automaticamente no ato da liquidação financeira.
          </p>
        </div>
        <span className="bg-amber-50 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-xl border border-amber-200/80 flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="h-4 w-4 text-amber-600" />
          Regulamentação PLP 68/2024
        </span>
      </div>

      {/* Modalidade Selector Tabs */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          1. Selecione a Modalidade de Split Payment para a Simulação:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setSplitModalidade && setSplitModalidade("AUTOMATICO")}
            className={`p-4 rounded-xl border text-left transition cursor-pointer ${
              currentModalidade === "AUTOMATICO"
                ? "bg-amber-50/80 border-amber-400 text-slate-900 ring-2 ring-amber-400/30"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs uppercase flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-amber-600" />
                Automático
              </span>
              {currentModalidade === "AUTOMATICO" && (
                <CheckCircle2 className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <p className="text-[11px] leading-tight text-slate-500">
              Consulta em tempo real ao Comitê Gestor do IBS e RFB. Abate créditos e retém o saldo devedor líquido.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSplitModalidade && setSplitModalidade("SIMPLIFICADO")}
            className={`p-4 rounded-xl border text-left transition cursor-pointer ${
              currentModalidade === "SIMPLIFICADO"
                ? "bg-amber-50/80 border-amber-400 text-slate-900 ring-2 ring-amber-400/30"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs uppercase flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-amber-600" />
                Simplificado
              </span>
              {currentModalidade === "SIMPLIFICADO" && (
                <CheckCircle2 className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <p className="text-[11px] leading-tight text-slate-500">
              Para adquirentes não-contribuintes ou Simples Nacional. Retenção via alíquota padrão simplificada no arranjo.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSplitModalidade && setSplitModalidade("ANALOGICO")}
            className={`p-4 rounded-xl border text-left transition cursor-pointer ${
              currentModalidade === "ANALOGICO"
                ? "bg-amber-50/80 border-amber-400 text-slate-900 ring-2 ring-amber-400/30"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs uppercase flex items-center gap-1.5">
                <Landmark className="h-4 w-4 text-amber-600" />
                Analógico / Manual
              </span>
              {currentModalidade === "ANALOGICO" && (
                <CheckCircle2 className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <p className="text-[11px] leading-tight text-slate-500">
              Para operações em espécie ou sem arranjos eletrônicos de pagamento. Recolhimento por guia tradicional.
            </p>
          </button>
        </div>
      </div>

      {/* Financial Settlement Results Cards */}
      {splitData && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Resultado da Liquidação Financeira Instantânea (No Ato do Pagamento):
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Valor Bruto da Nota */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Valor Comercial da Nota Fiscal
              </span>
              <span className="text-xl font-black font-mono text-slate-900 block">
                {formatCurrencyBRL(splitData.valor_total_nota)}
              </span>
              <p className="text-[11px] text-slate-500 mt-2">
                Preço total contratado pago pelo adquirente via PIX / Cartão / Boleto.
              </p>
            </div>

            {/* Card 2: Imposto Dividido e Retido */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold uppercase text-amber-900 block">
                  Tributo Retido pelo Split (CBS + IBS + IS)
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-950 font-mono px-1.5 py-0.5 rounded font-bold">
                  -{splitData.percentual_retencao_efetiva}%
                </span>
              </div>
              <span className="text-xl font-black font-mono text-amber-700 block">
                {formatCurrencyBRL(splitData.total_retencao_split)}
              </span>
              <div className="text-[10px] font-mono text-amber-900 mt-2 space-y-0.5">
                <div className="flex justify-between">
                  <span>• CBS (Federal):</span>
                  <span>{formatCurrencyBRL(splitData.retencao_cbs)}</span>
                </div>
                <div className="flex justify-between">
                  <span>• IBS (Estadual/Mun):</span>
                  <span>{formatCurrencyBRL(splitData.retencao_ibs)}</span>
                </div>
                {splitData.retencao_is > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>• Imposto Seletivo:</span>
                    <span>{formatCurrencyBRL(splitData.retencao_is)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Valor Líquido Entrado na Conta da Empresa */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase text-emerald-900 block mb-1">
                Valor Líquido Creditado no Vendedor
              </span>
              <span className="text-xl font-black font-mono text-emerald-700 block">
                {formatCurrencyBRL(splitData.valor_liquido_vendedor)}
              </span>
              <p className="text-[11px] text-emerald-900 mt-2 font-medium">
                Depositado em tempo real na conta bancária/arranjos de pagamento da empresa.
              </p>
            </div>
          </div>

          {/* Operational Flow Diagram */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4">
            <span className="text-xs font-bold uppercase text-amber-400 tracking-wider block flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Fluxo Operacional Tecnológico do Split Payment (PIX / Cartões / Bancos)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col justify-between">
                <span className="text-amber-400 font-bold text-[10px] block uppercase">Passo 1</span>
                <p className="font-semibold text-slate-200 my-1">Comprador realiza o Pagamento</p>
                <span className="text-[10px] text-slate-400">Via PIX, Cartão, Boleto ou TED</span>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col justify-between">
                <span className="text-amber-400 font-bold text-[10px] block uppercase">Passo 2</span>
                <p className="font-semibold text-slate-200 my-1">Arranjo de Pagamento Intercepta</p>
                <span className="text-[10px] text-slate-400">Banco/Adquirente consulta API RFB/IBS</span>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col justify-between">
                <span className="text-amber-400 font-bold text-[10px] block uppercase">Passo 3</span>
                <p className="font-semibold text-slate-200 my-1">Divisão Instantânea de Fundos</p>
                <span className="text-[10px] text-slate-400">Segregação do IBS ({formatCurrencyBRL(splitData.retencao_ibs)}) e CBS ({formatCurrencyBRL(splitData.retencao_cbs)})</span>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col justify-between">
                <span className="text-emerald-400 font-bold text-[10px] block uppercase">Passo 4</span>
                <p className="font-semibold text-slate-200 my-1">Depósito do Saldo Líquido</p>
                <span className="text-[10px] text-emerald-300 font-mono font-bold">{formatCurrencyBRL(splitData.valor_liquido_vendedor)} na conta do Vendedor</span>
              </div>
            </div>
          </div>

          {/* Cash Flow Impact Alert */}
          <div className="p-4 rounded-xl border bg-amber-50/70 border-amber-200 flex items-start gap-3 text-xs text-amber-950">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Alerta de Gestão de Fluxo de Caixa (Capital de Giro):</strong>
              <p className="text-slate-700 leading-relaxed">
                {splitData.impacto_fluxo_caixa}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Technical Topics Section */}
      <div className="border-t border-slate-200 pt-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span>Detalhamento Técnico do Serviço de Split Payment (PLP 68/2024 / EC 132/2023)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Topico 1 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 text-xs block uppercase text-emerald-700">
              📌 1. O que é o Split Payment &amp; Base Legal
            </span>
            <p className="text-slate-600 leading-relaxed">
              Previsto no <b>Art. 49 a 55 do PLP 68/2024</b> e respaldado pela <b>EC 132/2023</b>, o Split Payment é a automação da arrecadação tributária no Brasil. As adquirentes e instituições financeiras atuam como agentes retentores no momento exato em que a liquidação financeira ocorre.
            </p>
          </div>

          {/* Topico 2 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 text-xs block uppercase text-emerald-700">
              💳 2. Condicionamento do Crédito Fiscal
            </span>
            <p className="text-slate-600 leading-relaxed">
              O comprador B2B <b>só tem direito de creditar-se do IBS e da CBS</b> se o valor do imposto for efetivamente retido e recolhido através do Split Payment (Art. 49, §1º do PLP 68/2024). Isso elimina empresas noteiras e sonegação na cadeia de suprimentos.
            </p>
          </div>

          {/* Topico 3 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 text-xs block uppercase text-emerald-700">
              ⚡ 3. Modalidades: Automático vs. Simplificado
            </span>
            <p className="text-slate-600 leading-relaxed">
              No <b>Split Automático</b>, os sistemas bancários conectam-se à base da Receita Federal e do Comitê Gestor do IBS para abater créditos acumulados do vendedor. No <b>Split Simplificado</b>, aplica-se retenção percentual direta sobre adquirentes do Simples ou não-contribuintes.
            </p>
          </div>

          {/* Topico 4 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 text-xs block uppercase text-emerald-700">
              📈 4. Parcelamento e Antecipação de Recebíveis
            </span>
            <p className="text-slate-600 leading-relaxed">
              Nas vendas parceladas no cartão ou boleto, a retenção do imposto é dividida proporcionalmente em cada parcela. Caso a empresa antecipe seus recebíveis no banco, a obrigação tributária de retenção permanece intacta no repasse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
