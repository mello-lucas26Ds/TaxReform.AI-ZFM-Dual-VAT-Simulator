import { TAX_RATES_CONFIG } from "../config/taxRates";

export interface SelectiveTaxResult {
  rate: number;
  description: string | null;
  embasamento_legal: string | null;
}

/**
 * Calculador de Imposto Seletivo (IS - "Imposto do Pecado") com tratamento constitucional para a ZFM/PIM
 */
export function calcularImpostoSeletivo(
  ncm: string,
  regimeZfm: string,
  cumprePPB: boolean
): SelectiveTaxResult {
  // 1. ZONAS FRANCA DE MANAUS (ZFM / PIM): Isenção Constitucional de Imposto Seletivo para quem cumpre PPB
  if ((regimeZfm === "ZFM_POLO_INDUSTRIAL" || regimeZfm === "ZFM_ALC_TABATINGA") && cumprePPB) {
    return {
      rate: 0,
      description: "Isenção do Imposto Seletivo (Produtos do Polo Industrial de Manaus com PPB aprovado)",
      embasamento_legal: TAX_RATES_CONFIG.ZFM_RULES.LEGAL_BASE_IS_ZFM_EXEMPTION,
    };
  }

  // 2. Operações fora da ZFM ou sem cumprimento de PPB: Aplicação da Alíquota Nominal de IS por NCM
  const cleanNcm = ncm.replace(/\D/g, "");

  for (const rule of TAX_RATES_CONFIG.SELECTIVE_TAX_RULES) {
    if (cleanNcm.startsWith(rule.prefix)) {
      return {
        rate: rule.rate,
        description: `Incidência de Imposto Seletivo (${rule.description})`,
        embasamento_legal: "Art. 153, VIII da CF/88 (EC 132/2023) c/c PLP 68/2024 (Incidência sobre bens nocivos à saúde e meio ambiente)",
      };
    }
  }

  return {
    rate: 0,
    description: null,
    embasamento_legal: null,
  };
}
