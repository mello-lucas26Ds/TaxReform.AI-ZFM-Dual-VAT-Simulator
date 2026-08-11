/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RegimeTributario = "LUCRO_PRESUMIDO" | "LUCRO_REAL" | "SIMPLES_NACIONAL";

export type TipoOperacao = 
  | "VENDA_ESTABELECIMENTO"
  | "DEVOLUCOES"
  | "PRESTACAO_SERVICOS"
  | "TRANSFERENCIAS";

export type BeneficioFiscal = 
  | "ISENCAO"
  | "REDUCAO_BASE"
  | "ALIQUOTA_REDUZIDA"
  | "REDUCAO_30_SERVICOS" // Redução de 30% para Profissões Regulamentadas (Art. 129 PLP 68/2024)
  | null;

export type RegimeZFM =
  | "ZFM_POLO_INDUSTRIAL" // Polo Industrial de Manaus (PIM)
  | "ZFM_ALC_TABATINGA"    // Área de Livre Comércio de Tabatinga (AM)
  | "AM_FORA_ZFM"          // Estado do Amazonas (Fora de ZFM/ALC)
  | "OUTROS_ESTADOS";      // Demais Estados do Brasil

export type SplitPaymentModalidade = "AUTOMATICO" | "SIMPLIFICADO" | "ANALOGICO";

export type TipoIcmsMode = "AUTOMATICO" | "ISENCAO" | "MANUAL_VALOR" | "MANUAL_ALIQUOTA";

export interface SimulacaoInput {
  cnpj: string;
  uf_origem: string;
  uf_destino: string;
  regime_zfm: RegimeZFM;
  cumpre_ppb: boolean;              // Processo Produtivo Básico (PPB - Suframa)
  ncm: string;
  cfop: string;
  tipo_operacao: TipoOperacao | string;
  valor_operacao: number;
  tipo_icms_mode?: TipoIcmsMode;
  valor_icms: number | string;      // Suporta número ou string vazia para digitação fluida sem bug de trava no 0
  aliquota_icms_manual?: number | string; // Suporta digitação de alíquota em % (ex: 18 para 18%)
  beneficio_fiscal: BeneficioFiscal | string | null;
  regime_tributario: RegimeTributario | string;
  split_modalidade?: SplitPaymentModalidade;
}

export interface EtapaMemoria {
  descricao: string;
  valor: number | string;
  embasamento_legal?: string; // Citação da norma fiscal/constitucional
}

export interface TributosResultado {
  cbs: number;
  ibs: number;
  is: number;
  credito_presumido_zfm?: number;
  total_tributo: number;
}

export interface TributosHojeResultado {
  pis: number;
  cofins: number;
  icms_or_iss: number;
  icms_or_iss_tipo: "ICMS" | "ISS" | "DAS (Simples)" | "DAS";
  total_hoje: number;
  embasamento_regime?: string;
}

export interface DiferencaTributos {
  valor: number;
  porcentagem: number;
  tipo: "AUMENTO" | "REDUCAO" | "NEUTRO";
}

export interface SplitPaymentResult {
  modalidade: SplitPaymentModalidade;
  valor_total_nota: number;
  retencao_cbs: number;
  retencao_ibs: number;
  retencao_is: number;
  total_retencao_split: number;
  valor_liquido_vendedor: number;
  percentual_retencao_efetiva: number;
  mecanismo_operacional: string;
  embasamento_legal: string;
  impacto_fluxo_caixa: string;
  condicionamento_credito: string;
}

export interface SimulacaoResponse {
  status: "sucesso" | "erro_validacao";
  mensagem?: string;
  campo_faltando?: string;
  tributos?: TributosResultado;
  tributos_hoje?: TributosHojeResultado;
  diferenca_tributos?: DiferencaTributos;
  split_payment?: SplitPaymentResult;
  memoria_calculo?: {
    etapas: EtapaMemoria[];
  };
}

export interface UFInfo {
  value: string;
  label: string;
}
