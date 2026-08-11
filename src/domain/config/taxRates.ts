/**
 * Parâmetros, Alíquotas e Embasamento Legal da Reforma Tributária (PEC 45/2019 / EC 132/2023 / PLP 68/2024)
 * e do Regime Tributário do Estado do Amazonas (ZFM / ALC Tabatinga)
 */

export const TAX_RATES_CONFIG = {
  // 🏛️ ALÍQUOTAS PADRÃO DA REFORMA (IVA DUAL)
  // Fonte: Ministério da Fazenda / PLP 68/2024 / Emenda Constitucional 132/2023
  CBS_STANDARD_RATE: 0.088, // 8,80% (CBS - Federal)
  IBS_STANDARD_RATE: 0.177, // 17,70% (IBS - Estadual/Municipal)

  // 📉 REDUÇÃO DE 30% NAS ALÍQUOTAS DE CBS/IBS PARA PROFISSÕES REGULAMENTADAS (Art. 129 do PLP 68/2024)
  REDUCAO_30_SERVICOS: {
    DISCOUNT_FACTOR: 0.30, // 30% de Desconto na Alíquota Nominal
    CBS_RATE_30: 0.088 * 0.70, // 6,16%
    IBS_RATE_30: 0.177 * 0.70, // 12,39%
    COMBINED_RATE_30: (0.088 + 0.177) * 0.70, // 18,55%
    LEGAL_BASE: "Art. 129 do PLP 68/2024 (Redução de 30% nas alíquotas do IBS e CBS para prestação de serviços por profissionais liberais de profissões regulamentadas vinculadas a conselhos de classe)",
  },

  // 🌴 REGRAS ESPECÍFICAS DA ZONA FRANCA DE MANAUS (ZFM) E AMAZONAS (AM)
  // Embasamento: Art. 92-B do ADCT (EC 132/2023) & PLP 68/2024
  ZFM_RULES: {
    CBS_RATE_DESTINATION_ZFM: 0.0,
    IBS_RATE_DESTINATION_ZFM: 0.0,
    LEGAL_BASE_DESTINATION_ZFM: "Art. 92-B do ADCT (EC 132/2023) c/c PLP 68/2024 (Isenção/Alíquota Zero de CBS e IBS para remessas à ZFM/ALC)",

    CREDITO_PRESUMIDO_CBS_PIM: 0.02,  // 2,00% de Crédito Presumido de CBS
    CREDITO_PRESUMIDO_IBS_PIM_SUL_SE: 0.075, // 7,50% para bens com origem/destino no Sul/Sudeste
    CREDITO_PRESUMIDO_IBS_PIM_OUTROS: 0.135, // 13,50% para Norte/Nordeste/CO/ES
    LEGAL_BASE_PIM_CREDITO_PRESUMIDO: "Art. 92-B, §2º do ADCT e PLP 68/2024 (Crédito Presumido de CBS/IBS para produtos com PPB no PIM)",

    LEGAL_BASE_IS_ZFM_EXEMPTION: "Art. 92-B, §4º do ADCT (Não incidência de Imposto Seletivo para bens produzidos na ZFM que atendam ao PPB)",
  },

  // 🍺 IMPOSTO SELETIVO ("IMPOSTO DO PECADO") - NCMs GERAIS (FORA DA ZFM)
  SELECTIVE_TAX_RULES: [
    { prefix: "2202", rate: 0.03, description: "Bebidas Açucaradas e Refrescos" },
    { prefix: "2203", rate: 0.03, description: "Cervejas de Cevada e Bebidas Alcoólicas" },
    { prefix: "2402", rate: 0.10, description: "Cigarros e Derivados do Tabaco" },
  ],

  // 📜 LEGACY RATES PARA O SISTEMA ATUAL ("HOJE")
  LEGACY_RATES: {
    ZFM_PIS_COFINS_RATE: 0.0,
    LEGAL_BASE_ZFM_PIS_COFINS: "Lei nº 10.996/2004 (Alíquota zero de PIS e COFINS nas vendas de mercadorias nacionais destinadas à ZFM)",
    PRESTACAO_SERVICOS_ISS: 0.05, // 5,00% ISS
    SIMPLES_NACIONAL: {
      COMERCIO_DAS_ESTIMATED: 0.06, // 6,00% DAS
      SERVICO_DAS_ESTIMATED: 0.10,  // 10,00% DAS
    },
  },

  // 📉 REGIMES TRIBUTÁRIOS DETALHADOS (REGRAS E CÁLCULOS ATUAIS E DA REFORMA)
  REGIMES_INFO: {
    SIMPLES_NACIONAL: {
      NAME: "Simples Nacional",
      LEGAL_BASE_LEGACY: "Lei Complementar nº 123/2006 (Estatuto da Micro e Pequena Empresa - Anexos I a V)",
      LEGAL_BASE_REFORMA: "Art. 146, III, 'd' da CF/88 c/c PLP 68/2024 (Mantém apuração unificada em DAS com alíquota reduzida, ou opção por recolher IBS/CBS por fora gerando créditos integrais ao comprador)",
      ESTIMATED_RATES: {
        COMERCIO_DAS: 0.06,  // 6,00% DAS Anexo I
        SERVICO_DAS: 0.10,   // 10,00% DAS Anexo III
        SIMPLES_ZFM_REDUCTION: 0.60, // Redução constitucional de 60% na parcela IBS/CBS no DAS
      },
    },
    LUCRO_PRESUMIDO: {
      NAME: "Lucro Presumido",
      LEGAL_BASE_LEGACY: "Lei nº 9.718/1998 (Regime Cumulativo de PIS a 0,65% e COFINS a 3,00%) + ICMS/ISS",
      LEGAL_BASE_REFORMA: "Art. 195, V e Art. 156-A da CF/88 (Extinção do PIS/COFINS cumulativo e transição mandatória para IBS/CBS não-cumulativo com alíquota cheia de 26,5% e direito a créditos)",
      LEGACY_RATES: {
        PIS: 0.0065,   // 0,65%
        COFINS: 0.03,   // 3,00%
      },
    },
    LUCRO_REAL: {
      NAME: "Lucro Real",
      LEGAL_BASE_LEGACY: "Lei nº 10.637/2002 (PIS 1,65%) e Lei nº 10.833/2003 (COFINS 7,60%) sob Regime Não-Cumulativo c/ Exclusão do ICMS da base (STF RE 574.706 / Tema 69)",
      LEGAL_BASE_REFORMA: "Art. 195, V e Art. 156-A da CF/88 (Unificação no IBS/CBS não-cumulativo pleno com creditamento imediato de todas as aquisições de bens e serviços)",
      LEGACY_RATES: {
        PIS: 0.0165,  // 1,65%
        COFINS: 0.076, // 7,60%
      },
    },
  },

  // 💳 SPLIT PAYMENT (PAGAMENTO DIVIDIDO NA LIQUIDAÇÃO FINANCEIRA)
  // Embasamento: Art. 49 a 55 do PLP 68/2024 / EC 132/2023
  SPLIT_PAYMENT: {
    LEGAL_BASE: "Art. 49 e seguintes do PLP 68/2024 c/c EC 132/2023 (Segregação automática e retenção na fonte do IBS e CBS pelas instituições financeiras e credenciadoras na liquidação de PIX, Cartões e Boleto)",
    MODALIDADES: {
      AUTOMATICO: {
        nome: "Split Payment Automático Inteligente",
        descricao: "A instituição financeira/adquirente consulta a plataforma do Comitê Gestor do IBS e Receita Federal em tempo real, abatendo créditos prévios do vendedor e retendo somente o saldo devedor líquido de CBS/IBS no ato do pagamento.",
      },
      SIMPLIFICADO: {
        nome: "Split Payment Simplificado",
        descricao: "Aplicável a adquirentes não-contribuintes ou empresas do Simples Nacional. Segregação direta via percentual padrão no arranjo de pagamento no momento do recebimento.",
      },
      ANALOGICO: {
        nome: "Split Payment Analógico (Manual)",
        descricao: "Recolhimento via guia tradicional para transações em dinheiro ou sem intermediação de arranjo de pagamento eletrônico.",
      },
    },
  },

  // 🗺️ ICMS ESTADUAL DO AMAZONAS E REGRAS INTERESTADUAIS
  ICMS_RATES: {
    AMAZONAS_INTERNAL_RATE: 0.20, // 20,00% (Lei Estadual do Amazonas nº 6.108/2022)
    INTERNAL_DEFAULT_OTHER: 0.18, // 18,00% demais estados
    SOUTH_SOUTHEAST_TO_NORTH: 0.07, // 7,00% (Convênio ICMS 22/89 - Sul/SE para AM/Norte)
    OTHER_INTERSTATE: 0.12,       // 12,00% (Demais operações interestaduais)
    ZFM_CONVENIO_65_88: 0.0,      // Isenção do ICMS para remessas destinadas à ZFM (Convênio ICMS 65/88)
    LEGAL_BASE_AM_ICMS: "Lei Estadual do AM nº 6.108/2022 (Alíquota interna do ICMS no Amazonas de 20%)",
    LEGAL_BASE_ZFM_ICMS_CONVENIO: "Convênio ICMS nº 65/88 (Isenção do ICMS na remessa de produtos nacionais para a ZFM)",
  },

  // 📜 EMBASAMENTOS JURÍDICOS PARA REFERÊNCIA RÁPIDA
  LEGAL_CITATIONS: {
    STF_TESE_DO_SECULO: "STF RE 574.706 / Tema 69 (Exclusão do ICMS da base de cálculo do PIS/COFINS)",
    CBS_POR_FORA: "Art. 12 do PLP 68/2024 (Exclusão do ICMS/ISS destacados da base do CBS/IBS - Cálculo Por Fora)",
    PEC_45: "Emenda Constitucional nº 132/2023 (Reforma Tributária do Consumo)",
    PLP_68: "Projeto de Lei Complementar nº 68/2024 / LC 214/2025 (Regulamentação do IBS/CBS e ZFM)",
    ART_129_PLP68: "Art. 129 do PLP 68/2024 (Redução de 30% nas alíquotas de IBS/CBS para Serviços Regulamentados)",
  },
};
