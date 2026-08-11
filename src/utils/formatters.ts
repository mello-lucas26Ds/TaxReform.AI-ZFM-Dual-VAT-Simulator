/**
 * Formatadores e utilitários de exibição
 */

export function formatCurrencyBRL(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "R$ 0,00";
  }
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0,00%";
  }
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function getRegimeLabel(regime: string): string {
  switch (regime) {
    case "LUCRO_PRESUMIDO":
      return "Lucro Presumido";
    case "LUCRO_REAL":
      return "Lucro Real";
    case "SIMPLES_NACIONAL":
      return "Simples Nacional";
    default:
      return regime;
  }
}

export function getBeneficioLabel(beneficio: string | null): string {
  switch (beneficio) {
    case "ISENCAO":
      return "Isenção Plena (CBS/IBS Zeros)";
    case "REDUCAO_BASE":
      return "Redução de 60% na Base de Cálculo";
    case "ALIQUOTA_REDUZIDA":
      return "Alíquota Reduzida (-60% na Alíquota)";
    default:
      return "Não (Tributação Integral)";
  }
}
