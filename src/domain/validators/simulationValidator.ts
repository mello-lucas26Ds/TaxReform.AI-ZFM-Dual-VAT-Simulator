import { SimulacaoInput, SimulacaoResponse } from "../../types/tax";

/**
 * Validador de Entrada de Dados Fiscais
 */
export function validateSimulationInput(input: SimulacaoInput): SimulacaoResponse | null {
  if (!input.cnpj) {
    return {
      status: "erro_validacao",
      mensagem: "O CNPJ do emitente é obrigatório para realizar a simulação fiscal.",
      campo_faltando: "cnpj",
    };
  }

  if (!input.valor_operacao || input.valor_operacao <= 0) {
    return {
      status: "erro_validacao",
      mensagem: "O valor da operação deve ser maior que zero.",
      campo_faltando: "valor_operacao",
    };
  }

  return null; // NENHUM erro
}
