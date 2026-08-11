import {
  SplitPaymentModalidade,
  SplitPaymentResult,
  TributosResultado,
} from "../../types/tax";
import { TAX_RATES_CONFIG } from "../config/taxRates";

/**
 * Calculador de Retenção do Split Payment (PLP 68/2024 Art. 49 a 55)
 * Ajusta dinamicamente a base de retenção e os valores retidos conforme a modalidade selecionada:
 * - AUTOMÁTICO: Consulta em tempo real ao Comitê Gestor do IBS e RFB. Retém o tributo líquido apurado.
 * - SIMPLIFICADO: Aplicável a vendas B2C / Simples / Não-contribuintes. Retenção via alíquota padrão de referência (26,50%) no meio de pagamento.
 * - ANALÓGICO: Transações em espécie/dinheiro ou sem meio eletrônico. Retenção bancária = R$ 0,00 (recolhimento via guia posterior).
 */
export function calcularSplitPayment(
  valorOperacao: number,
  tributosReforma: TributosResultado,
  modalidade: SplitPaymentModalidade = "AUTOMATICO"
): SplitPaymentResult {
  const { cbs, ibs, is, total_tributo } = tributosReforma;

  let retencaoCBS = 0;
  let retencaoIBS = 0;
  let retencaoIS = Math.max(0, is);
  let mecanismoOperacional = "";
  let impactoFluxoCaixa = "";

  if (modalidade === "ANALOGICO") {
    // Modalidade Analógica/Manual (Operações em espécie ou sem arranjos eletrônicos de pagamento - Art. 53 do PLP 68/2024)
    // Não há intermediação de banco/credenciadora no ato do pagamento -> Retenção no ato = R$ 0,00.
    retencaoCBS = 0;
    retencaoIBS = 0;
    retencaoIS = 0;
    mecanismoOperacional =
      "Split Payment Analógico (Manual): Isenção de retenção bancária instantânea no ato (R$ 0,00). O imposto será recolhido posteriormente pelo contribuinte via guia de arrecadação DARF/DARE.";
    impactoFluxoCaixa = `No Split Payment Analógico (Manual), NENHUM VALOR É RETIDO no ato do pagamento (R$ 0,00). O vendedor recebe 100% do valor comercial em espécie (R$ ${valorOperacao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}). O imposto devido de R$ ${total_tributo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} deverá ser recolhido posteriormente via guia. O comprador pessoa jurídica somente gera crédito fiscal após comprovar a quitação da guia.`;
  } else if (modalidade === "SIMPLIFICADO") {
    // Modalidade Simplificada (Art. 51 do PLP 68/2024 - Adquirente Não-Contribuinte ou Simples Nacional)
    // A instituição financeira aplica a alíquota padrão de referência (CBS 8,80% + IBS 17,70% = 26,50%) no meio de pagamento
    // sobre o valor bruto da operação, sem amortização antecipada de saldos credores do fornecedor.
    const isZfmExempt = tributosReforma.cbs === 0 && tributosReforma.ibs === 0;
    if (isZfmExempt) {
      retencaoCBS = 0;
      retencaoIBS = 0;
    } else {
      retencaoCBS = parseFloat((valorOperacao * TAX_RATES_CONFIG.CBS_STANDARD_RATE).toFixed(2));
      retencaoIBS = parseFloat((valorOperacao * TAX_RATES_CONFIG.IBS_STANDARD_RATE).toFixed(2));
    }
    mecanismoOperacional =
      "Split Payment Simplificado: Retenção via alíquota padrão de referência (CBS 8,80% + IBS 17,70% = 26,50%) aplicada diretamente pela adquirente no momento do recebimento, sem abates prévios de saldos credores.";
    const totalRetTemp = retencaoCBS + retencaoIBS + retencaoIS;
    const valLiqTemp = Math.max(0, valorOperacao - totalRetTemp);
    impactoFluxoCaixa = `No Split Payment Simplificado, a instituição financeira retém a alíquota padrão de referência de 26,50% (R$ ${totalRetTemp.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}) direto no recebimento do PIX/Cartão. O vendedor recebe o valor líquido imediato de R$ ${valLiqTemp.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}. Ajustes de saldo credor acumulado serão compensados na DFC mensal.`;
  } else {
    // Modalidade Automática Inteligente (Default B2B - Art. 49 e 50 do PLP 68/2024)
    // Consulta em tempo real à plataforma do Comitê Gestor do IBS e Receita Federal.
    // Retém exatamente o valor do tributo líquido apurado devido na operação.
    retencaoCBS = Math.max(0, cbs);
    retencaoIBS = Math.max(0, ibs);
    mecanismoOperacional =
      "Split Payment Automático Inteligente: Consulta em tempo real ao Comitê Gestor do IBS e RFB. Abate créditos previamente acumulados pelo vendedor e retém apenas o imposto líquido devido.";
    const totalRetTemp = retencaoCBS + retencaoIBS + retencaoIS;
    const valLiqTemp = Math.max(0, valorOperacao - totalRetTemp);
    const pctTemp = valorOperacao > 0 ? (totalRetTemp / valorOperacao) * 100 : 0;

    if (totalRetTemp > 0) {
      impactoFluxoCaixa = `No Split Payment Automático, o valor de R$ ${totalRetTemp.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (${pctTemp.toFixed(2)}% da nota) é desmembrado e retido no milissegundo da liquidação do PIX/Cartão/Boleto. O vendedor recebe o saldo líquido imediato de R$ ${valLiqTemp.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em sua conta.`;
    } else {
      impactoFluxoCaixa =
        "Operação isenta ou com alíquota zero no destino/origem (ex: Zona Franca de Manaus), resultando em R$ 0,00 de retenção de IBS/CBS na liquidação financeira.";
    }
  }

  const totalRetencao = Math.min(valorOperacao, retencaoCBS + retencaoIBS + retencaoIS);
  const valorLiquido = Math.max(0, valorOperacao - totalRetencao);
  const percentualEfetivo = valorOperacao > 0 ? (totalRetencao / valorOperacao) * 100 : 0;

  return {
    modalidade,
    valor_total_nota: valorOperacao,
    retencao_cbs: retencaoCBS,
    retencao_ibs: retencaoIBS,
    retencao_is: retencaoIS,
    total_retencao_split: totalRetencao,
    valor_liquido_vendedor: valorLiquido,
    percentual_retencao_efetiva: Number(percentualEfetivo.toFixed(2)),
    mecanismo_operacional: mecanismoOperacional,
    embasamento_legal: TAX_RATES_CONFIG.SPLIT_PAYMENT.LEGAL_BASE,
    impacto_fluxo_caixa: impactoFluxoCaixa,
    condicionamento_credito:
      modalidade === "ANALOGICO"
        ? "Art. 53 do PLP 68/2024: O comprador pessoa jurídica SOMENTE gera crédito acumulável de IBS/CBS após a comprovação da quitação efetiva da guia de arrecadação manual."
        : "Art. 49, §1º do PLP 68/2024: O comprador pessoa jurídica SOMENTE gera crédito acumulável de IBS/CBS após a confirmação do recolhimento efetivo da retenção pelo Split Payment na liquidação financeira da transação.",
  };
}
