import { SimulacaoInput, EtapaMemoria, TributosResultado } from "../../types/tax";
import { TAX_RATES_CONFIG } from "../config/taxRates";
import { IcmsCalculationResult } from "./icmsCalculator";
import { calcularImpostoSeletivo } from "./selectiveTaxCalculator";

export interface ReformaCalculationResult {
  tributos: TributosResultado;
  etapas: EtapaMemoria[];
}

/**
 * Calculador dos novos tributos da Reforma Tributária (CBS, IBS e IS), com tratamento diferencial constitucional para Amazonas e ZFM.
 */
export function calcularTributosReforma(
  input: SimulacaoInput,
  icmsOrIss: IcmsCalculationResult
): ReformaCalculationResult {
  const etapas: EtapaMemoria[] = [
    {
      descricao: "Valor nominal da operação comercial",
      valor: input.valor_operacao,
      embasamento_legal: "Valor comercial pactuado no documento fiscal",
    },
  ];

  let cbsRate = TAX_RATES_CONFIG.CBS_STANDARD_RATE;
  let ibsRate = TAX_RATES_CONFIG.IBS_STANDARD_RATE;
  let creditoPresumidoZfm = 0;

  const isDestinoZfmOuAlc =
    (input.uf_destino === "AM" || input.regime_zfm === "ZFM_POLO_INDUSTRIAL" || input.regime_zfm === "ZFM_ALC_TABATINGA") &&
    input.uf_origem !== input.uf_destino;

  const isOrigemPim = input.uf_origem === "AM" && input.regime_zfm === "ZFM_POLO_INDUSTRIAL";

  // 1. Abatimento "Por Fora" do ICMS/ISS
  if (icmsOrIss.valor > 0) {
    etapas.push({
      descricao: `Exclusão do ${icmsOrIss.tipo} da base de cálculo (CBS/IBS "Por Fora")`,
      valor: -parseFloat(icmsOrIss.valor.toFixed(2)),
      embasamento_legal: TAX_RATES_CONFIG.LEGAL_CITATIONS.CBS_POR_FORA,
    });
  }

  // 2. TRATAMENTO ESPECÍFICO DE DESTINO: Remessa de Bens para ZFM / ALC Tabatinga
  if (isDestinoZfmOuAlc) {
    cbsRate = TAX_RATES_CONFIG.ZFM_RULES.CBS_RATE_DESTINATION_ZFM; // 0%
    ibsRate = TAX_RATES_CONFIG.ZFM_RULES.IBS_RATE_DESTINATION_ZFM; // 0%

    etapas.push({
      descricao: "Remessa Destinada à ZFM/ALC: Alíquota ZERO de CBS aplicada com manutenção de créditos",
      valor: "0.00%",
      embasamento_legal: TAX_RATES_CONFIG.ZFM_RULES.LEGAL_BASE_DESTINATION_ZFM,
    });
    etapas.push({
      descricao: "Remessa Destinada à ZFM/ALC: Alíquota ZERO de IBS aplicada com manutenção de créditos",
      valor: "0.00%",
      embasamento_legal: TAX_RATES_CONFIG.ZFM_RULES.LEGAL_BASE_DESTINATION_ZFM,
    });
  } 
  // 3. TRATAMENTO ESPECÍFICO DE ORIGEM: Indústria do Polo Industrial de Manaus (PIM - ZFM) com PPB
  else if (isOrigemPim && input.cumpre_ppb) {
    // Aplica alíquotas normais porém calcula o Crédito Presumido Constitucional do PIM
    const rateCreditoIbs = ["SP", "RJ", "MG", "PR", "SC", "RS"].includes(input.uf_destino)
      ? TAX_RATES_CONFIG.ZFM_RULES.CREDITO_PRESUMIDO_IBS_PIM_SUL_SE // 7,5%
      : TAX_RATES_CONFIG.ZFM_RULES.CREDITO_PRESUMIDO_IBS_PIM_OUTROS; // 13,5%

    const creditoCbsRate = TAX_RATES_CONFIG.ZFM_RULES.CREDITO_PRESUMIDO_CBS_PIM; // 2%
    creditoPresumidoZfm = input.valor_operacao * (creditoCbsRate + rateCreditoIbs);

    etapas.push({
      descricao: "Geração de Crédito Presumido do PIM (ZFM) - CBS (2%) + IBS (" + (rateCreditoIbs * 100).toFixed(1) + "%)",
      valor: `-R$ ${creditoPresumidoZfm.toFixed(2)}`,
      embasamento_legal: TAX_RATES_CONFIG.ZFM_RULES.LEGAL_BASE_PIM_CREDITO_PRESUMIDO,
    });
  } 
  // 4. Regime Simples Nacional (Tratamento Geral fora da ZFM)
  else if (input.regime_tributario === "SIMPLES_NACIONAL") {
    const factor = 1 - TAX_RATES_CONFIG.REGIMES_INFO.SIMPLES_NACIONAL.ESTIMATED_RATES.SIMPLES_ZFM_REDUCTION; // 0.40
    cbsRate = cbsRate * factor;
    ibsRate = ibsRate * factor;

    etapas.push({
      descricao: "Regime Simples Nacional: Alíquota CBS reduzida em 60% no DAS unificado",
      valor: `${(cbsRate * 100).toFixed(2)}%`,
      embasamento_legal: TAX_RATES_CONFIG.REGIMES_INFO.SIMPLES_NACIONAL.LEGAL_BASE_REFORMA,
    });
    etapas.push({
      descricao: "Regime Simples Nacional: Alíquota IBS reduzida em 60% no DAS unificado",
      valor: `${(ibsRate * 100).toFixed(2)}%`,
      embasamento_legal: TAX_RATES_CONFIG.REGIMES_INFO.SIMPLES_NACIONAL.LEGAL_BASE_REFORMA,
    });
  } else {
    etapas.push({
      descricao: "Alíquota Nominal de CBS (União)",
      valor: `${(cbsRate * 100).toFixed(2)}%`,
      embasamento_legal: "Art. 195, V da CF/88 (EC 132/2023) c/c PLP 68/2024",
    });
    etapas.push({
      descricao: "Alíquota Nominal de IBS (Estados/Municípios)",
      valor: `${(ibsRate * 100).toFixed(2)}%`,
      embasamento_legal: "Art. 156-A da CF/88 (EC 132/2023) c/c PLP 68/2024",
    });
  }

  // 5. Benefícios Fiscais
  if (input.beneficio_fiscal === "ISENCAO") {
    cbsRate = 0;
    ibsRate = 0;
    etapas.push({
      descricao: "Isenção Fiscal aplicada: CBS e IBS zerados",
      valor: "0.00%",
      embasamento_legal: "Regime de Isenção Plena previsto em Lei Complementar",
    });
  } else if (input.beneficio_fiscal === "REDUCAO_BASE") {
    etapas.push({
      descricao: "Redução de 60% na base de cálculo de CBS/IBS",
      valor: "-60% Base",
      embasamento_legal: "Art. 9º do PLP 68/2024 (Regimes de redução de base para setores estratégicos)",
    });
  } else if (input.beneficio_fiscal === "ALIQUOTA_REDUZIDA") {
    cbsRate = cbsRate * 0.4;
    ibsRate = ibsRate * 0.4;
    etapas.push({
      descricao: "Alíquota Reduzida aplicada (-60% para Saúde, Educação, Agropecuária)",
      valor: `CBS: ${(cbsRate * 100).toFixed(2)}% | IBS: ${(ibsRate * 100).toFixed(2)}%`,
      embasamento_legal: "Art. 9º do PLP 68/2024 (Regimes diferenciados de alíquotas reduzidas)",
    });
  } else if (input.beneficio_fiscal === "REDUCAO_30_SERVICOS" || (input.tipo_operacao === "PRESTACAO_SERVICOS" && input.beneficio_fiscal === "REDUCAO_30_SERVICOS")) {
    cbsRate = cbsRate * 0.70; // 30% de Desconto na Alíquota
    ibsRate = ibsRate * 0.70; // 30% de Desconto na Alíquota
    etapas.push({
      descricao: "Redução de 30% nas alíquotas de CBS/IBS para Profissões Regulamentadas",
      valor: `CBS: ${(cbsRate * 100).toFixed(2)}% | IBS: ${(ibsRate * 100).toFixed(2)}% (Efetiva: ${((cbsRate + ibsRate) * 100).toFixed(2)}%)`,
      embasamento_legal: TAX_RATES_CONFIG.REDUCAO_30_SERVICOS.LEGAL_BASE,
    });
  }

  // 6. Imposto Seletivo (IS)
  const isResult = calcularImpostoSeletivo(input.ncm, input.regime_zfm, input.cumpre_ppb);
  if (isResult.description) {
    etapas.push({
      descricao: isResult.description,
      valor: `${(isResult.rate * 100).toFixed(2)}%`,
      embasamento_legal: isResult.embasamento_legal || "Art. 153, VIII da CF/88",
    });
  }

  // 7. Apuração da Base Líquida
  let baseCalculo = input.valor_operacao;
  if (icmsOrIss.valor > 0) {
    baseCalculo = Math.max(0, baseCalculo - icmsOrIss.valor);
  }

  if (input.beneficio_fiscal === "REDUCAO_BASE") {
    baseCalculo = baseCalculo * 0.4; // Desconto de 60% na base
  }

  etapas.push({
    descricao: "Base de cálculo líquida apurada",
    valor: baseCalculo,
    embasamento_legal: "Apuração após exclusão do imposto destacado e benefícios de base",
  });

  // 8. Cálculo dos Valores Finais
  const cbsVal = baseCalculo * cbsRate;
  const ibsVal = baseCalculo * ibsRate;
  const isVal = baseCalculo * isResult.rate;
  const totalTributos = cbsVal + ibsVal + isVal;

  etapas.push({
    descricao: "Valor CBS apurado",
    valor: parseFloat(cbsVal.toFixed(2)),
    embasamento_legal: "CBS líquida devida na operação",
  });
  etapas.push({
    descricao: "Valor IBS apurado",
    valor: parseFloat(ibsVal.toFixed(2)),
    embasamento_legal: "IBS líquido devido na operação",
  });

  if (isVal > 0) {
    etapas.push({
      descricao: "Valor Imposto Seletivo (IS) apurado",
      valor: parseFloat(isVal.toFixed(2)),
      embasamento_legal: "Imposto Seletivo devido na operação",
    });
  }

  etapas.push({
    descricao: "Alíquota Nominal Agregada (IBS + CBS + IS)",
    valor: `${((cbsRate + ibsRate + isResult.rate) * 100).toFixed(2)}%`,
    embasamento_legal: "Soma das alíquotas incidentes sobre a base líquida",
  });

  return {
    tributos: {
      cbs: parseFloat(cbsVal.toFixed(2)),
      ibs: parseFloat(ibsVal.toFixed(2)),
      is: parseFloat(isVal.toFixed(2)),
      credito_presumido_zfm: parseFloat(creditoPresumidoZfm.toFixed(2)),
      total_tributo: parseFloat(totalTributos.toFixed(2)),
    },
    etapas,
  };
}
