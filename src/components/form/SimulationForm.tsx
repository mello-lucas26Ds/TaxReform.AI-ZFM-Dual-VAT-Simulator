import React from "react";
import { RefreshCw, Sliders, MapPin, Building2, HelpCircle, BookOpen, CheckCircle2, DollarSign, Percent, Zap, ShieldAlert } from "lucide-react";
import { SimulacaoInput, RegimeZFM, TipoIcmsMode } from "../../types/tax";
import { UFS_BRASIL } from "../../domain/icmsRules";

interface SimulationFormProps {
  form: SimulacaoInput;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setTipoIcmsMode: (mode: TipoIcmsMode) => void;
  setBeneficioFiscal: (val: string | null) => void;
  setRegimeZFM: (val: RegimeZFM) => void;
  isLoading: boolean;
  runSimulation: (e?: React.FormEvent) => void;
}

export const SimulationForm: React.FC<SimulationFormProps> = ({
  form,
  handleInputChange,
  setTipoIcmsMode,
  setBeneficioFiscal,
  setRegimeZFM,
  isLoading,
  runSimulation,
}) => {
  const currentIcmsMode = form.tipo_icms_mode || "AUTOMATICO";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-6 gap-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display flex items-center gap-2">
          <Sliders className="h-4 w-4 text-emerald-600" />
          <span>Parâmetros de Entrada da Operação Fiscal</span>
        </h2>
        <div className="flex w-fit items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/80 rounded-full px-3 py-1">
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          Regime Amazonas &amp; ZFM Ativo
        </div>
      </div>

      <form onSubmit={runSimulation} className="space-y-5">
        {/* CNPJ & Regime Tributario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              CNPJ do Emitente *
            </label>
            <input
              type="text"
              name="cnpj"
              value={form.cnpj}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              placeholder="00.000.000/0000-00"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Regime Tributário do Emitente *
            </label>
            <select
              name="regime_tributario"
              value={form.regime_tributario}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition font-medium"
            >
              <option value="LUCRO_PRESUMIDO">Lucro Presumido (Cumulativo PIS 0,65% / COFINS 3%)</option>
              <option value="LUCRO_REAL">Lucro Real (Não-Cumulativo PIS 1,65% / COFINS 7,6%)</option>
              <option value="SIMPLES_NACIONAL">Simples Nacional (LC 123/2006 / DAS Unificado)</option>
            </select>
          </div>
        </div>

        {/* Informações detalhadas do Regime selecionado */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
            Embasamento do Regime ({form.regime_tributario.replace("_", " ")}):
          </span>
          {form.regime_tributario === "SIMPLES_NACIONAL" && (
            <p className="text-[11px] leading-tight text-slate-500">
              <b>Hoje:</b> DAS Unificado (Anexo I Comércio 6% / Anexo III Serviços 10%). <b>Reforma (PLP 68/2024):</b> Opção por manter recolhimento unificado no DAS (com 60% de redução na parcela IBS/CBS) ou optar por recolher IBS/CBS por fora e transferir créditos integrais aos compradores B2B.
            </p>
          )}
          {form.regime_tributario === "LUCRO_PRESUMIDO" && (
            <p className="text-[11px] leading-tight text-slate-500">
              <b>Hoje (Lei 9.718/1998):</b> PIS Cumulativo (0,65%) + COFINS Cumulativa (3,00%) = 3,65% + ICMS/ISS. <b>Reforma (PLP 68/2024):</b> Fim do PIS/COFINS cumulativo e migração obrigatória para CBS (8,8%) + IBS (17,7%) com direito a tomada de créditos sobre insumos.
            </p>
          )}
          {form.regime_tributario === "LUCRO_REAL" && (
            <p className="text-[11px] leading-tight text-slate-500">
              <b>Hoje (Leis 10.637/02 e 10.833/03):</b> PIS Não-Cumulativo (1,65%) + COFINS (7,60%) = 9,25% com exclusão do ICMS destacado (STF RE 574.706). <b>Reforma:</b> Unificação no IVA Dual (IBS/CBS 26,5%) com creditamento pleno e instantâneo.
            </p>
          )}
        </div>

        {/* REGIME ZFM / AMAZONAS */}
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-emerald-600" />
              Enquadramento na Zona Franca de Manaus / Amazonas
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold font-mono">
              Art. 92-B ADCT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Localização / Regime ZFM da Operação:
              </label>
              <select
                name="regime_zfm"
                value={form.regime_zfm}
                onChange={(e) => setRegimeZFM(e.target.value as RegimeZFM)}
                className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-600"
              >
                <option value="ZFM_POLO_INDUSTRIAL">
                  Polo Industrial de Manaus (PIM - ZFM)
                </option>
                <option value="ZFM_ALC_TABATINGA">
                  Área de Livre Comércio (ALC Tabatinga - AM)
                </option>
                <option value="AM_FORA_ZFM">
                  Estado do Amazonas (Fora de ZFM / ALC)
                </option>
                <option value="OUTROS_ESTADOS">
                  Outros Estados (Operação sem incentivo ZFM)
                </option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-start gap-2.5 cursor-pointer bg-white p-2.5 rounded-xl border border-emerald-200 w-full hover:bg-emerald-50/30 transition">
                <input
                  type="checkbox"
                  name="cumpre_ppb"
                  checked={form.cumpre_ppb}
                  onChange={handleInputChange}
                  className="mt-0.5 h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Cumpre Processo Produtivo Básico (PPB - Suframa)
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    Garante Isenção do Imposto Seletivo e Crédito Presumido de CBS/IBS (Art. 92-B, §2º)
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Origem e Destino */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              UF Origem *
            </label>
            <select
              name="uf_origem"
              value={form.uf_origem}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition font-medium"
            >
              {UFS_BRASIL.map((uf) => (
                <option key={uf.value} value={uf.value}>
                  {uf.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              UF Destino (Destino da Operação) *
            </label>
            <select
              name="uf_destino"
              value={form.uf_destino}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition font-medium"
            >
              {UFS_BRASIL.map((uf) => (
                <option key={uf.value} value={uf.value}>
                  {uf.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* NCM & CFOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              NCM (Nomenclatura Comum Mercosul) *
            </label>
            <input
              type="text"
              name="ncm"
              value={form.ncm}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 focus:outline-none focus:border-emerald-500 transition"
              placeholder="Ex: 2202.10.00"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Dica ZFM: <b className="text-slate-700 font-mono">2202.10.00</b> (Bebidas) ou{" "}
              <b className="text-slate-700 font-mono">8504.50.00</b> (Indústria Eletroeletrônica PIM)
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              CFOP (Código Fiscal de Operação) *
            </label>
            <input
              type="text"
              name="cfop"
              value={form.cfop}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 focus:outline-none focus:border-emerald-500 transition"
              placeholder="Ex: 6102 ou 6109"
            />
          </div>
        </div>

        {/* Tipo de Operação */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Tipo de Operação Comercial *
          </label>
          <select
            name="tipo_operacao"
            value={form.tipo_operacao}
            onChange={handleInputChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition font-medium"
          >
            <option value="VENDA_ESTABELECIMENTO">
              Venda de Produção do Estabelecimento / Indústria
            </option>
            <option value="DEVOLUCOES">Devolução de Mercadorias para Terceiros</option>
            <option value="PRESTACAO_SERVICOS">Prestação de Serviços Profissionais (Profissões Regulamentadas / TI)</option>
            <option value="TRANSFERENCIAS">Transferência de Filial Interestadual</option>
          </select>
        </div>

        {/* Valor da Operação */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 font-sans">
            Valor Total Comercial da Operação (R$) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm font-mono font-bold text-slate-400">R$</span>
            <input
              type="number"
              name="valor_operacao"
              value={form.valor_operacao}
              onChange={handleInputChange}
              step="0.01"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-emerald-700 font-mono font-bold focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* SEÇÃO ESPECIAL DE ICMS DESTACADO (AUTO / ISENÇÃO / VALOR R$ / ALÍQUOTA %) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span>Modo de Apuração do ICMS Destacado:</span>
            </label>
            <span className="text-[10px] text-slate-500 font-mono">
              Convênio ICMS 65/88 / Lei AM 6.108/2022
            </span>
          </div>

          {/* Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setTipoIcmsMode("AUTOMATICO")}
              className={`px-3 py-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentIcmsMode === "AUTOMATICO"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Automático UF</span>
            </button>

            <button
              type="button"
              onClick={() => setTipoIcmsMode("ISENCAO")}
              className={`px-3 py-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentIcmsMode === "ISENCAO"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Isenção (R$ 0)</span>
            </button>

            <button
              type="button"
              onClick={() => setTipoIcmsMode("MANUAL_VALOR")}
              className={`px-3 py-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentIcmsMode === "MANUAL_VALOR"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" />
              <span>Valor R$</span>
            </button>

            <button
              type="button"
              onClick={() => setTipoIcmsMode("MANUAL_ALIQUOTA")}
              className={`px-3 py-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentIcmsMode === "MANUAL_ALIQUOTA"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Percent className="h-3.5 w-3.5" />
              <span>Alíquota %</span>
            </button>
          </div>

          {/* Conditional Inputs for ICMS */}
          {currentIcmsMode === "AUTOMATICO" && (
            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
              <span className="font-bold text-slate-800 block mb-0.5">⚡ Cálculo Automático por Legislação</span>
              <p className="text-[11px] leading-relaxed">
                {form.uf_destino === "AM" && form.uf_origem !== "AM"
                  ? "Isenção do ICMS ativada automaticamente (Convênio ICMS 65/88 para vendas destinadas à Zona Franca de Manaus)."
                  : form.uf_origem === "AM" && form.uf_destino === "AM"
                  ? "Alíquota interna do Estado do Amazonas: 20,00% (Lei Estadual AM nº 6.108/2022)."
                  : "Alíquota aplicada conforme regras interestaduais da CF/88 (ex: 7% Sul/SE para Norte/AM, 12% demais interestaduais)."}
              </p>
            </div>
          )}

          {currentIcmsMode === "ISENCAO" && (
            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-emerald-800">
              <span className="font-bold block mb-0.5">🚫 Isenção Plena do ICMS (R$ 0,00)</span>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Garante o diferimento / isenção do ICMS na nota fiscal conforme Convênio ICMS 65/88 para operações destinadas à ZFM e ALCs.
              </p>
            </div>
          )}

          {currentIcmsMode === "MANUAL_VALOR" && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Informa o Valor Total em Reais (R$) do ICMS Destacado:
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-mono font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  name="valor_icms"
                  value={form.valor_icms}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="Ex: 500.00"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Digite livremente o valor em R$ (ex: 500). Você pode apagar tudo sem travar no 0.
              </p>
            </div>
          )}

          {currentIcmsMode === "MANUAL_ALIQUOTA" && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Informe a Alíquota em Porcentagem (%) do ICMS:
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="aliquota_icms_manual"
                  value={form.aliquota_icms_manual || ""}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="Ex: 18.00"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-4 pr-10 py-2.5 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                />
                <span className="absolute right-3.5 top-2.5 text-sm font-mono font-bold text-slate-400">%</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Digite a alíquota em % (ex: 18 ou 20). O sistema calcula o valor proporcional sobre a operação.
              </p>
            </div>
          )}
        </div>

        {/* Benefício Fiscal */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Benefício Fiscal de Alíquota / Base na Reforma
          </label>
          <select
            name="beneficio_fiscal"
            value={form.beneficio_fiscal || ""}
            onChange={(e) => setBeneficioFiscal(e.target.value ? e.target.value : null)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition font-medium"
          >
            <option value="">Não (Tributação Integral com Alíquota Padrão)</option>
            <option value="REDUCAO_30_SERVICOS">
              Redução de 30% para Serviços / Profissões Regulamentadas (Art. 129 PLP 68/2024)
            </option>
            <option value="ALIQUOTA_REDUZIDA">
              Alíquota Reduzida (-60% para Saúde, Educação, Agropecuária - Art. 9º PLP 68/2024)
            </option>
            <option value="REDUCAO_BASE">Redução de 60% na Base de Cálculo Geral</option>
            <option value="ISENCAO">Isenção Plena (Zera CBS/IBS)</option>
          </select>
        </div>

        {/* Nota informativa de Leis */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
          <p className="font-bold text-slate-800 flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
            <span>Fundamentos Legais e Tratamentos Diferenciados na Simulação:</span>
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500">
            <li>
              <strong>Redução de 30% em Serviços (Art. 129 PLP 68/2024):</strong> Alíquota reduzida de IBS/CBS para advogados, médicos, contadores, engenheiros, arquitetos e administradores vinculados a conselho de classe.
            </li>
            <li>
              <strong>ICMS Interno AM:</strong> 20% (Lei Estadual nº 6.108/2022).
            </li>
            <li>
              <strong>Remessas para ZFM:</strong> Isenção ICMS (Conv. 65/88) e PIS/COFINS Zero (Lei 10.996/04).
            </li>
            <li>
              <strong>Reforma Tributária ZFM:</strong> Alíquota Zero de CBS/IBS nas compras e Crédito Presumido de CBS (2%) + IBS (7,5%/13,5%) nas saídas do PIM (Art. 92-B ADCT / PLP 68/2024).
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/10 cursor-pointer transition flex items-center justify-center gap-2 text-base"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Processando Regras Fiscais &amp; Split Payment...</span>
              </>
            ) : (
              <>
                <span>⚡ Simular Carga Tributária (Reforma vs. Hoje)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
