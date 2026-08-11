import {
  SimulacaoInput,
  SimulacaoResponse,
  DiferencaTributos,
  EtapaMemoria,
} from "../../types/tax";
import { validateSimulationInput } from "../validators/simulationValidator";
import { calcularIcmsOuIss } from "../calculators/icmsCalculator";
import { calcularTributosReforma } from "../calculators/reformaCalculator";
import { calcularTributosAtuais } from "../calculators/legacyTaxCalculator";
import { calcularSplitPayment } from "../calculators/splitPaymentCalculator";
import { formatCurrencyBRL } from "../../utils/formatters";

/**
 * Serviço Orquestrador de Simulação Tributária (Foco Especial: Amazonas e Zona Franca de Manaus)
 * Gera a memória de cálculo completa e auditável para TODAS as variáveis da simulação.
 */
export function executarSimulacaoTributaria(input: SimulacaoInput): SimulacaoResponse {
  // 1. Validação de dados de entrada
  const validationError = validateSimulationInput(input);
  if (validationError) {
    return validationError;
  }

  // 2. Apuração do tributo estadual/municipal (Com regra do AM 20% e Convênio 65/88 ZFM)
  const icmsOrIss = calcularIcmsOuIss(input);

  // 3. Apuração da Reforma Tributária (CBS + IBS + IS + Crédito Presumido ZFM PIM)
  const reformaResult = calcularTributosReforma(input, icmsOrIss);

  // 4. Apuração da Tributação Atual (PIS + COFINS com Alíquota Zero ZFM + Tese do Século STF)
  const legacyResult = calcularTributosAtuais(input, icmsOrIss);

  // 5. Apuração do Split Payment na Liquidação Financeira
  const splitPaymentResult = calcularSplitPayment(
    input.valor_operacao,
    reformaResult.tributos,
    input.split_modalidade || "AUTOMATICO"
  );

  // 6. Apuração de Variação Nominal e Percentual
  const diffVal = parseFloat(
    (reformaResult.tributos.total_tributo - legacyResult.total_hoje).toFixed(2)
  );

  const diffPercent = legacyResult.total_hoje > 0
    ? parseFloat(((diffVal / legacyResult.total_hoje) * 100).toFixed(2))
    : 0;

  let diffTipo: "AUMENTO" | "REDUCAO" | "NEUTRO" = "NEUTRO";
  if (diffVal > 0.01) {
    diffTipo = "AUMENTO";
  } else if (diffVal < -0.01) {
    diffTipo = "REDUCAO";
  }

  const diferencaTributos: DiferencaTributos = {
    valor: diffVal,
    porcentagem: diffPercent,
    tipo: diffTipo,
  };

  // 7. Construção da Memória de Cálculo Auditável Unificada (Audit Trace)
  const etapasCompletas: EtapaMemoria[] = [];

  // PASSO A: Operação Base
  etapasCompletas.push({
    descricao: `VALOR COMERCIAL DA OPERAÇÃO (${input.uf_origem} ➔ ${input.uf_destino})`,
    valor: input.valor_operacao,
    embasamento_legal: `NCM: ${input.ncm} | CFOP: ${input.cfop} | Regime Emitente: ${input.regime_tributario.replace("_", " ")}`,
  });

  // PASSO B: Apuração do Modelo Atual ("Hoje")
  etapasCompletas.push({
    descricao: `[MODELO ATUAL] Imposto Estadual/Municipal (${icmsOrIss.tipo}): Alíquota ${(icmsOrIss.aliquota_aplicada * 100).toFixed(2)}%`,
    valor: parseFloat(icmsOrIss.valor.toFixed(2)),
    embasamento_legal: icmsOrIss.embasamento_legal,
  });

  if (icmsOrIss.tipo === "ICMS" && icmsOrIss.valor > 0 && input.regime_tributario !== "SIMPLES_NACIONAL") {
    const baseLiquidaPisCofins = Math.max(0, input.valor_operacao - icmsOrIss.valor);
    etapasCompletas.push({
      descricao: `[MODELO ATUAL] Exclusão do ICMS da base do PIS/COFINS (Tese do Século STF): Base líquida R$ ${baseLiquidaPisCofins.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      valor: -parseFloat(icmsOrIss.valor.toFixed(2)),
      embasamento_legal: "STF - RE 574.706 / Tema 69 (O ICMS não compõe a base de cálculo do PIS e da COFINS)",
    });
  }

  if (input.regime_tributario === "SIMPLES_NACIONAL") {
    etapasCompletas.push({
      descricao: `[MODELO ATUAL] Apuração do DAS Unificado do Simples Nacional`,
      valor: parseFloat(legacyResult.total_hoje.toFixed(2)),
      embasamento_legal: "Lei Complementar nº 123/2006 (DAS abrange IRPJ, CSLL, PIS, COFINS, CPP e ICMS/ISS)",
    });
  } else {
    etapasCompletas.push({
      descricao: `[MODELO ATUAL] PIS Apurado (Alíquota ${input.uf_destino === "AM" && input.uf_origem !== "AM" ? "0,00% ZFM" : input.regime_tributario === "LUCRO_REAL" ? "1,65%" : "0,65%"})`,
      valor: parseFloat(legacyResult.pis.toFixed(2)),
      embasamento_legal: legacyResult.embasamento_regime,
    });

    etapasCompletas.push({
      descricao: `[MODELO ATUAL] COFINS Apurada (Alíquota ${input.uf_destino === "AM" && input.uf_origem !== "AM" ? "0,00% ZFM" : input.regime_tributario === "LUCRO_REAL" ? "7,60%" : "3,00%"})`,
      valor: parseFloat(legacyResult.cofins.toFixed(2)),
      embasamento_legal: legacyResult.embasamento_regime,
    });

    etapasCompletas.push({
      descricao: `[MODELO ATUAL] TOTAL TRIBUTOS MODELO VIGENTE ("HOJE")`,
      valor: parseFloat(legacyResult.total_hoje.toFixed(2)),
      embasamento_legal: "Soma de PIS + COFINS + ICMS/ISS",
    });
  }

  // PASSO C: Apuração da Reforma Tributária (CBS + IBS + IS)
  reformaResult.etapas.forEach((et) => {
    if (et.descricao !== "Valor nominal da operação comercial") {
      etapasCompletas.push(et);
    }
  });

  etapasCompletas.push({
    descricao: `[REFORMA] TOTAL TRIBUTOS NOVO MODELO (CBS + IBS + IS)`,
    valor: parseFloat(reformaResult.tributos.total_tributo.toFixed(2)),
    embasamento_legal: "Art. 156-A e Art. 195, V da CF/88 (EC 132/2023 / PLP 68/2024)",
  });

  // PASSO D: Split Payment
  const modalidadeNome =
    splitPaymentResult.modalidade === "SIMPLIFICADO"
      ? "Simplificado (Alíquota Referência)"
      : splitPaymentResult.modalidade === "ANALOGICO"
      ? "Analógico / Manual (Espécie)"
      : "Automático (Inteligente B2B)";

  etapasCompletas.push({
    descricao: `[SPLIT PAYMENT - ${modalidadeNome}] Retenção de CBS/IBS na Liquidação Financeira (${splitPaymentResult.percentual_retencao_efetiva}% retido)`,
    valor: -parseFloat(splitPaymentResult.total_retencao_split.toFixed(2)),
    embasamento_legal: splitPaymentResult.mecanismo_operacional,
  });

  etapasCompletas.push({
    descricao: `[SPLIT PAYMENT] VALOR LÍQUIDO CREDITADO NA CONTA DO VENDEDOR`,
    valor: parseFloat(splitPaymentResult.valor_liquido_vendedor.toFixed(2)),
    embasamento_legal: "Depósito imediato do saldo líquido no ato do pagamento após retenção bancária",
  });

  // PASSO E: Balanço Comparativo Final
  etapasCompletas.push({
    descricao: `BALANÇO FINAL: Variação da Carga Tributária (Reforma vs. Hoje)`,
    valor: `${diferencaTributos.tipo === "REDUCAO" ? "-" : "+"}${formatCurrencyBRL(Math.abs(diferencaTributos.valor))} (${diferencaTributos.porcentagem}%)`,
    embasamento_legal: diferencaTributos.tipo === "REDUCAO"
      ? "Economia tributária gerada por incentivos da ZFM / Benefícios de alíquota reduzida"
      : "Variação sob a nova alíquota unificada do IVA Dual",
  });

  return {
    status: "sucesso",
    tributos: reformaResult.tributos,
    tributos_hoje: legacyResult,
    diferenca_tributos: diferencaTributos,
    split_payment: splitPaymentResult,
    memoria_calculo: {
      etapas: etapasCompletas,
    },
  };
}
