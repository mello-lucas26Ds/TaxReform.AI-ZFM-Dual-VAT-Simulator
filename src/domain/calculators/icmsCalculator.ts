import { SimulacaoInput } from "../../types/tax";
import { TAX_RATES_CONFIG } from "../config/taxRates";

export interface IcmsCalculationResult {
  tipo: "ICMS" | "ISS" | "DAS (Simples)" | "DAS";
  valor: number;
  aliquota_aplicada: number;
  embasamento_legal: string;
}

/**
 * Calculador do tributo estadual/municipal do regime atual, com regras específicas para o Estado do Amazonas (AM) e ZFM.
 */
export function calcularIcmsOuIss(input: SimulacaoInput): IcmsCalculationResult {
  const valOperacao = input.valor_operacao || 0;

  // 1. Regime Simples Nacional
  if (input.regime_tributario === "SIMPLES_NACIONAL") {
    const isServico = input.tipo_operacao === "PRESTACAO_SERVICOS";
    const simplesRate = isServico
      ? TAX_RATES_CONFIG.LEGACY_RATES.SIMPLES_NACIONAL.SERVICO_DAS_ESTIMATED
      : TAX_RATES_CONFIG.LEGACY_RATES.SIMPLES_NACIONAL.COMERCIO_DAS_ESTIMATED;

    return {
      tipo: "DAS (Simples)",
      valor: valOperacao * simplesRate,
      aliquota_aplicada: simplesRate,
      embasamento_legal: "Lei Complementar nº 123/2006 (Estatuto da Micro e Pequena Empresa - Simples Nacional)",
    };
  }

  // 2. Prestação de Serviços (ISS)
  if (input.tipo_operacao === "PRESTACAO_SERVICOS") {
    const issRate = TAX_RATES_CONFIG.LEGACY_RATES.PRESTACAO_SERVICOS_ISS;
    return {
      tipo: "ISS",
      valor: valOperacao * issRate,
      aliquota_aplicada: issRate,
      embasamento_legal: "Lei Complementar nº 116/2003 (Imposto Sobre Serviços de Qualquer Natureza)",
    };
  }

  // 3. Modos Específicos de Entrada de ICMS selecionados pelo Usuário
  const mode = input.tipo_icms_mode || "AUTOMATICO";

  if (mode === "ISENCAO") {
    return {
      tipo: "ICMS",
      valor: 0,
      aliquota_aplicada: 0,
      embasamento_legal: "Isenção do ICMS ativada (Convênio ICMS 65/88 - Vendas destinadas à ZFM/ALC)",
    };
  }

  if (mode === "MANUAL_VALOR") {
    const valNum = typeof input.valor_icms === "number"
      ? input.valor_icms
      : parseFloat(String(input.valor_icms)) || 0;
    const effectiveRate = valOperacao > 0 ? valNum / valOperacao : 0;

    return {
      tipo: "ICMS",
      valor: valNum,
      aliquota_aplicada: effectiveRate,
      embasamento_legal: "Valor em Reais (R$) de ICMS informado manualmente no documento fiscal",
    };
  }

  if (mode === "MANUAL_ALIQUOTA") {
    const aliqNum = typeof input.aliquota_icms_manual === "number"
      ? input.aliquota_icms_manual
      : parseFloat(String(input.aliquota_icms_manual)) || 0;
    const rate = aliqNum / 100;
    const valorCalculado = valOperacao * rate;

    return {
      tipo: "ICMS",
      valor: valorCalculado,
      aliquota_aplicada: rate,
      embasamento_legal: `Alíquota manual de ICMS informada (${aliqNum.toFixed(2)}%)`,
    };
  }

  // 4. Modo AUTOMÁTICO: Remessa de mercadorias destinadas à ZFM / ALC Tabatinga (Convênio ICMS 65/88)
  if (
    (input.uf_destino === "AM" || input.regime_zfm === "ZFM_POLO_INDUSTRIAL" || input.regime_zfm === "ZFM_ALC_TABATINGA") &&
    input.uf_origem !== input.uf_destino
  ) {
    // Isenção do ICMS no Estado de Origem para vendas destinadas à ZFM (Convênio ICMS 65/88)
    return {
      tipo: "ICMS",
      valor: 0,
      aliquota_aplicada: 0,
      embasamento_legal: TAX_RATES_CONFIG.ICMS_RATES.LEGAL_BASE_ZFM_ICMS_CONVENIO,
    };
  }

  // 5. Apuração Automática do ICMS por UF (Operação Interna do AM vs Interestadual)
  const { aliquota, embasamento } = obterAliquotaEEmbasamentoICMS(input.uf_origem, input.uf_destino);

  return {
    tipo: "ICMS",
    valor: valOperacao * aliquota,
    aliquota_aplicada: aliquota,
    embasamento_legal: embasamento,
  };
}

/**
 * Retorna a alíquota de ICMS e o embasamento legal correspondente (incluindo Lei AM 6.108/2022)
 */
export function obterAliquotaEEmbasamentoICMS(ufOrigem: string, ufDestino: string) {
  // Operação Interna no Estado do Amazonas (AM)
  if (ufOrigem === "AM" && ufDestino === "AM") {
    return {
      aliquota: TAX_RATES_CONFIG.ICMS_RATES.AMAZONAS_INTERNAL_RATE, // 20%
      embasamento: TAX_RATES_CONFIG.ICMS_RATES.LEGAL_BASE_AM_ICMS,
    };
  }

  // Operação Interna em outros Estados
  if (ufOrigem === ufDestino) {
    return {
      aliquota: TAX_RATES_CONFIG.ICMS_RATES.INTERNAL_DEFAULT_OTHER, // 18%
      embasamento: "Alíquota modal interna padrão de ICMS da Unidade da Federação de origem (18%)",
    };
  }

  // Operações Interestaduais do Sul/Sudeste (exceto ES) para o Amazonas (AM) ou Norte/NE/CO
  const sulSudesteSemES = ["SP", "RJ", "MG", "PR", "SC", "RS"];
  if (sulSudesteSemES.includes(ufOrigem) && (ufDestino === "AM" || !sulSudesteSemES.includes(ufDestino))) {
    return {
      aliquota: TAX_RATES_CONFIG.ICMS_RATES.SOUTH_SOUTHEAST_TO_NORTH, // 7%
      embasamento: "Art. 155, § 2º, VII, 'a' da CF/88 c/c Resolução do Senado Federal nº 22/89 (Alíquota de 7% de Sul/SE para Norte/AM)",
    };
  }

  // Demais operações interestaduais
  return {
    aliquota: TAX_RATES_CONFIG.ICMS_RATES.OTHER_INTERSTATE, // 12%
    embasamento: "Art. 155, § 2º da CF/88 c/c Resolução do Senado Federal nº 22/89 (Alíquota interestadual padrão de 12%)",
  };
}
