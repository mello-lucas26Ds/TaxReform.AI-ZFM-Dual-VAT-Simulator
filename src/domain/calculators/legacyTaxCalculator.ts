import { SimulacaoInput, TributosHojeResultado } from "../../types/tax";
import { TAX_RATES_CONFIG } from "../config/taxRates";
import { IcmsCalculationResult } from "./icmsCalculator";

/**
 * Calculador do sistema tributário atual ("Hoje") com regras específicas da ZFM, Tese do Século do STF e detalhamento por Regime Tributário.
 */
export function calcularTributosAtuais(
  input: SimulacaoInput,
  icmsOrIss: IcmsCalculationResult
): TributosHojeResultado {
  let pisRate = 0;
  let cofinsRate = 0;
  let embasamentoRegime = "";

  const isDestinoZFM =
    input.uf_destino === "AM" ||
    input.regime_zfm === "ZFM_POLO_INDUSTRIAL" ||
    input.regime_zfm === "ZFM_ALC_TABATINGA";

  // 1. Apuração de PIS/COFINS por Regime
  if (isDestinoZFM && input.uf_origem !== "AM") {
    pisRate = TAX_RATES_CONFIG.LEGACY_RATES.ZFM_PIS_COFINS_RATE; // 0%
    cofinsRate = TAX_RATES_CONFIG.LEGACY_RATES.ZFM_PIS_COFINS_RATE; // 0%
    embasamentoRegime = TAX_RATES_CONFIG.LEGACY_RATES.LEGAL_BASE_ZFM_PIS_COFINS;
  } else if (input.regime_tributario === "LUCRO_REAL") {
    pisRate = TAX_RATES_CONFIG.REGIMES_INFO.LUCRO_REAL.LEGACY_RATES.PIS; // 1,65%
    cofinsRate = TAX_RATES_CONFIG.REGIMES_INFO.LUCRO_REAL.LEGACY_RATES.COFINS; // 7,60%
    embasamentoRegime = TAX_RATES_CONFIG.REGIMES_INFO.LUCRO_REAL.LEGAL_BASE_LEGACY;
  } else if (input.regime_tributario === "LUCRO_PRESUMIDO") {
    pisRate = TAX_RATES_CONFIG.REGIMES_INFO.LUCRO_PRESUMIDO.LEGACY_RATES.PIS; // 0,65%
    cofinsRate = TAX_RATES_CONFIG.REGIMES_INFO.LUCRO_PRESUMIDO.LEGACY_RATES.COFINS; // 3,00%
    embasamentoRegime = TAX_RATES_CONFIG.REGIMES_INFO.LUCRO_PRESUMIDO.LEGAL_BASE_LEGACY;
  } else if (input.regime_tributario === "SIMPLES_NACIONAL") {
    embasamentoRegime = TAX_RATES_CONFIG.REGIMES_INFO.SIMPLES_NACIONAL.LEGAL_BASE_LEGACY;
  }

  // 2. Tese do Século (STF - RE 574.706): Exclusão do ICMS da base do PIS e da COFINS
  const basePisCofins = (icmsOrIss.tipo === "ICMS" && icmsOrIss.valor > 0)
    ? Math.max(0, input.valor_operacao - icmsOrIss.valor)
    : input.valor_operacao;

  let pisVal = parseFloat((basePisCofins * pisRate).toFixed(2));
  let cofinsVal = parseFloat((basePisCofins * cofinsRate).toFixed(2));
  let icmsOrIssFinalVal = parseFloat(icmsOrIss.valor.toFixed(2));

  // No Simples Nacional, o DAS unificado engloba PIS, COFINS e ICMS/ISS
  if (input.regime_tributario === "SIMPLES_NACIONAL") {
    pisVal = 0;
    cofinsVal = 0;
    const dasRate = input.tipo_operacao === "PRESTACAO_SERVICOS"
      ? TAX_RATES_CONFIG.REGIMES_INFO.SIMPLES_NACIONAL.ESTIMATED_RATES.SERVICO_DAS // 10%
      : TAX_RATES_CONFIG.REGIMES_INFO.SIMPLES_NACIONAL.ESTIMATED_RATES.COMERCIO_DAS; // 6%
    icmsOrIssFinalVal = parseFloat((input.valor_operacao * dasRate).toFixed(2));
  }

  const totalHoje = parseFloat((pisVal + cofinsVal + icmsOrIssFinalVal).toFixed(2));

  return {
    pis: pisVal,
    cofins: cofinsVal,
    icms_or_iss: icmsOrIssFinalVal,
    icms_or_iss_tipo: input.regime_tributario === "SIMPLES_NACIONAL" ? "DAS (Simples)" : icmsOrIss.tipo,
    total_hoje: totalHoje,
    embasamento_regime: embasamentoRegime,
  };
}
