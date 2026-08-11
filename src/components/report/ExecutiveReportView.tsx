import React, { useState } from "react";
import { Printer, Download, Shield, FileText, ArrowDownRight, ArrowUpRight, Award, Building2, Zap, CheckCircle2 } from "lucide-react";
import { SimulacaoResponse, SimulacaoInput } from "../../types/tax";
import { formatCurrencyBRL, getBeneficioLabel } from "../../utils/formatters";
import { printExecutiveReport, downloadReportAsPDF } from "../../utils/pdfExporter";

interface ExecutiveReportViewProps {
  apiResponse: SimulacaoResponse | null;
  form: SimulacaoInput;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  apiResponse,
  form,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);
    try {
      await downloadReportAsPDF("executive-report-content");
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error("Erro ao baixar PDF:", e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div id="executive-report-content" className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-4xl mx-auto space-y-8 font-sans text-slate-900">
      {/* Top Actions (Hidden on Print / Canvas export) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <span>Relatório Executivo &amp; Parecer Fiscal (Amazonas &amp; ZFM)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Documento técnico estruturado para apresentação executiva, diretoria e planejamento fiscal
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão para Baixar PDF Diretamente */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <span>Gerando PDF...</span>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                <span>PDF Baixado!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 text-emerald-100" />
                <span>Baixar Documento PDF</span>
              </>
            )}
          </button>

          {/* Botão de Impressão Direta do Navegador */}
          <button
            onClick={printExecutiveReport}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="h-4 w-4 text-emerald-400" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Printable Header */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 block mb-1">
            ESTUDO TRIBUTÁRIO REGIONAL • ESTADO DO AMAZONAS &amp; SPLIT PAYMENT
          </span>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Parecer Técnico: Reforma Tributária vs. Modelo Atual
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Análise de impacto sob a EC 132/2023, PLP 68/2024 (Art. 92-B ADCT e Art. 129), Split Payment e Legislação do AM
          </p>
        </div>
        <div className="text-right">
          <span className="bg-slate-100 text-slate-700 font-mono text-[11px] px-3 py-1 rounded-md border border-slate-200 inline-block font-bold">
            CNPJ: {form.cnpj || "Não Informado"}
          </span>
          <p className="text-[10px] text-slate-400 mt-1">
            Data da Análise: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Operation Context Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
        <div>
          <span className="text-slate-400 uppercase font-bold text-[10px] block">Regime / Local ZFM</span>
          <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
            <Building2 className="h-3 w-3 text-emerald-600" />
            {form.regime_zfm === "ZFM_POLO_INDUSTRIAL"
              ? "Polo Ind. Manaus (PIM)"
              : form.regime_zfm === "ZFM_ALC_TABATINGA"
              ? "ALC Tabatinga"
              : form.regime_zfm === "AM_FORA_ZFM"
              ? "Amazonas (Geral)"
              : "Outros Estados"}
          </span>
        </div>
        <div>
          <span className="text-slate-400 uppercase font-bold text-[10px] block">Origem / Destino</span>
          <span className="font-mono font-bold text-slate-800 mt-0.5 block">{form.uf_origem} ➔ {form.uf_destino}</span>
        </div>
        <div>
          <span className="text-slate-400 uppercase font-bold text-[10px] block">Regime / NCM / PPB</span>
          <span className="font-mono font-bold text-slate-800 mt-0.5 block">
            {form.regime_tributario.replace("_", " ")} | {form.ncm}
          </span>
        </div>
        <div>
          <span className="text-slate-400 uppercase font-bold text-[10px] block">Valor da Operação</span>
          <span className="font-mono font-bold text-emerald-700 mt-0.5 block">{formatCurrencyBRL(form.valor_operacao)}</span>
        </div>
      </div>

      {/* Main KPI Comparisons */}
      {apiResponse?.status === "sucesso" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box Hoje */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                  Modelo Tributário Vigente (Hoje)
                </span>
                <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                  PIS + COFINS + {apiResponse.tributos_hoje?.icms_or_iss_tipo}
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>PIS:</span>
                  <span>{formatCurrencyBRL(apiResponse.tributos_hoje?.pis)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>COFINS:</span>
                  <span>{formatCurrencyBRL(apiResponse.tributos_hoje?.cofins)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{apiResponse.tributos_hoje?.icms_or_iss_tipo} (Lei AM 6.108/22 / Conv. 65/88):</span>
                  <span>{formatCurrencyBRL(apiResponse.tributos_hoje?.icms_or_iss)}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-700">Total Atual:</span>
                <span className="font-mono font-extrabold text-base text-slate-900">
                  {formatCurrencyBRL(apiResponse.tributos_hoje?.total_hoje)}
                </span>
              </div>
            </div>

            {/* Box Reforma */}
            <div className="border border-emerald-200 rounded-xl p-5 bg-emerald-50/30 space-y-4">
              <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
                <span className="text-xs font-bold uppercase text-emerald-900 tracking-wider">
                  Reforma Tributária (EC 132/23)
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  CBS + IBS + IS
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>CBS (Federal):</span>
                  <span>{formatCurrencyBRL(apiResponse.tributos?.cbs)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>IBS (Estadual/Municipal):</span>
                  <span>{formatCurrencyBRL(apiResponse.tributos?.ibs)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Imposto Seletivo (IS):</span>
                  <span>{formatCurrencyBRL(apiResponse.tributos?.is)}</span>
                </div>
              </div>

              <div className="border-t border-emerald-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-xs text-emerald-950">Total Reforma:</span>
                <span className="font-mono font-extrabold text-base text-emerald-700">
                  {formatCurrencyBRL(apiResponse.tributos?.total_tributo)}
                </span>
              </div>
            </div>
          </div>

          {/* Split Payment Section in Report */}
          {apiResponse.split_payment && (
            <div className="p-4 rounded-xl border bg-amber-50 border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-600 fill-amber-600" />
                  <span className="font-bold text-amber-950 text-sm">
                    Mecanismo Split Payment na Liquidação Financeira (Art. 49 PLP 68/2024)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  -{apiResponse.split_payment.percentual_retencao_efetiva}% Retido na Fonte
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs text-amber-950 pt-2 border-t border-amber-200">
                <div>
                  <span className="text-[10px] uppercase block text-amber-800">Nota Fiscal Bruta</span>
                  <strong className="text-slate-900">{formatCurrencyBRL(apiResponse.split_payment.valor_total_nota)}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase block text-amber-800">Split Retido (CBS+IBS)</span>
                  <strong className="text-amber-700">{formatCurrencyBRL(apiResponse.split_payment.total_retencao_split)}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase block text-amber-800">Líquido na Conta</span>
                  <strong className="text-emerald-700">{formatCurrencyBRL(apiResponse.split_payment.valor_liquido_vendedor)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Crédito Presumido ZFM Banner (se houver) */}
          {(apiResponse.tributos?.credito_presumido_zfm || 0) > 0 && (
            <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950 text-sm block">
                    Incentivo Constitucional da Zona Franca de Manaus Aplicado
                  </span>
                  <p className="text-xs text-emerald-800">
                    Crédito Presumido constitucional gerado de <b>{formatCurrencyBRL(apiResponse.tributos?.credito_presumido_zfm)}</b> para a operação do Polo Industrial de Manaus com PPB.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Impact Banner */}
          <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {apiResponse.diferenca_tributos?.tipo === "REDUCAO" ? (
                <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                  <ArrowDownRight className="h-6 w-6" />
                </div>
              ) : apiResponse.diferenca_tributos?.tipo === "AUMENTO" ? (
                <div className="h-10 w-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
              ) : (
                <div className="h-10 w-10 bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
              )}
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  Variação Financeira Calculada
                </span>
                <p className="text-xs text-slate-600">
                  {apiResponse.diferenca_tributos?.tipo === "REDUCAO"
                    ? "Economia de tributos garantida pelo diferencial de competitividade regional da ZFM."
                    : apiResponse.diferenca_tributos?.tipo === "AUMENTO"
                    ? "Aumento nominal sob a nova alíquota CBS/IBS unificada."
                    : "Carga fiscal equivalente em ambos os modelos."}
                </p>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className={`text-lg font-black block ${
                apiResponse.diferenca_tributos?.tipo === "REDUCAO" ? "text-emerald-700" :
                apiResponse.diferenca_tributos?.tipo === "AUMENTO" ? "text-amber-700" : "text-slate-800"
              }`}>
                {apiResponse.diferenca_tributos?.tipo === "REDUCAO" ? "-" : "+"}
                {formatCurrencyBRL(Math.abs(apiResponse.diferenca_tributos?.valor || 0))}
              </span>
              <span className="text-[11px] text-slate-500 font-bold">
                ({apiResponse.diferenca_tributos?.porcentagem}%)
              </span>
            </div>
          </div>

          {/* Technical Parecer */}
          <div className="border-t border-slate-200 pt-6 space-y-3 text-xs text-slate-700 leading-relaxed">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              📋 Parecer Técnico com Fundamentos Legais
            </h3>
            <ul className="space-y-2 list-disc list-inside text-slate-600">
              <li>
                <strong>Redução de 30% em Serviços Regulamentados (Art. 129 PLP 68/2024):</strong> Concede alíquota reduzida de IBS e CBS para prestadores de serviços intelectuais submetidos a conselho de classe (médicos, advogados, contadores, engenheiros, etc.).
              </li>
              <li>
                <strong>Mecanismo de Split Payment (Art. 49 a 55 PLP 68/2024):</strong> Retenção imediata do IBS/CBS na liquidação de transações eletrônicas, liberando para a empresa vendedora o valor líquido no ato do pagamento.
              </li>
              <li>
                <strong>Manutenção da ZFM (Art. 92-B ADCT / EC 132/2023):</strong> A Emenda Constitucional manteve integralmente os incentivos fiscais da ZFM até 2073, assegurando Crédito Presumido de CBS/IBS e alíquota zero nas remessas.
              </li>
              <li>
                <strong>Regime Tributário do Emitente ({form.regime_tributario.replace("_", " ")}):</strong> Apuração realizada comparando o regime cumulativo/não-cumulativo vigente e as regras da Reforma Tributária.
              </li>
              <li>
                <strong>ICMS do Amazonas (Lei Estadual nº 6.108/2022):</strong> Para operações internas no AM, aplica-se a alíquota de 20%. Para remessas destinadas à ZFM/ALC, aplica-se a isenção do Convênio ICMS nº 65/88.
              </li>
              <li>
                <strong>Benefício Fiscal Selecionado:</strong> {getBeneficioLabel(form.beneficio_fiscal)}.
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Signature block for PDF printing */}
      <div className="hidden print:block pt-12 border-t border-slate-300 text-center">
        <div className="w-64 border-b border-slate-400 mx-auto mb-2"></div>
        <p className="text-xs font-bold text-slate-800">Contabilidade &amp; Consultoria Tributária Especializada em ZFM</p>
        <p className="text-[10px] text-slate-500">Parecer Técnico emitido via Tax Reform Hub Engine (Amazonas Edition)</p>
      </div>
    </div>
  );
};
