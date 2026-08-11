import React, { useState, useEffect, useCallback, useRef } from "react";
import { SimulacaoInput, SimulacaoResponse, RegimeZFM, SplitPaymentModalidade, TipoIcmsMode } from "../types/tax";
import { executarSimulacaoTributaria } from "../domain/taxEngine";
import { registerUsage } from "../utils/counterService";

export type MainTabType = "dashboard" | "split" | "memory" | "report";

export function useTaxSimulation() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  const [form, setForm] = useState<SimulacaoInput>({
    cnpj: "04.253.123/0001-88",
    uf_origem: "SP",
    uf_destino: "AM",
    regime_zfm: "ZFM_POLO_INDUSTRIAL",
    cumpre_ppb: true,
    ncm: "2202.10.00",
    cfop: "6102",
    tipo_operacao: "VENDA_ESTABELECIMENTO",
    valor_operacao: 5000.0,
    tipo_icms_mode: "AUTOMATICO",
    valor_icms: "",
    aliquota_icms_manual: "18.00",
    beneficio_fiscal: null,
    regime_tributario: "LUCRO_PRESUMIDO",
    split_modalidade: "AUTOMATICO",
  });

  const [apiResponse, setApiResponse] = useState<SimulacaoResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>("dashboard");

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target as HTMLInputElement;

      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setForm((prev) => ({
          ...prev,
          [name]: checked,
        }));
        return;
      }

      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const setTipoIcmsMode = useCallback((mode: TipoIcmsMode) => {
    setForm((prev) => ({
      ...prev,
      tipo_icms_mode: mode,
    }));
  }, []);

  const setBeneficioFiscal = useCallback((val: string | null) => {
    setForm((prev) => ({
      ...prev,
      beneficio_fiscal: val,
    }));
  }, []);

  const setRegimeZFM = useCallback((val: RegimeZFM) => {
    setForm((prev) => ({
      ...prev,
      regime_zfm: val,
    }));
  }, []);

  const setSplitModalidade = useCallback((val: SplitPaymentModalidade) => {
    setForm((prev) => ({
      ...prev,
      split_modalidade: val,
    }));
  }, []);

  const runSimulation = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setIsLoading(true);
      registerUsage();

      setTimeout(() => {
        const numericForm: SimulacaoInput = {
          ...form,
          valor_operacao: typeof form.valor_operacao === "number"
            ? form.valor_operacao
            : parseFloat(String(form.valor_operacao)) || 0,
          valor_icms: typeof form.valor_icms === "number"
            ? form.valor_icms
            : parseFloat(String(form.valor_icms)) || 0,
          aliquota_icms_manual: typeof form.aliquota_icms_manual === "number"
            ? form.aliquota_icms_manual
            : parseFloat(String(form.aliquota_icms_manual)) || 0,
        };

        const result = executarSimulacaoTributaria(numericForm);
        setApiResponse(result);
        setIsLoading(false);
      }, 150);
    },
    [form]
  );

  // Recalcula automaticamente sempre que qualquer campo relevante do formulário for modificado
  useEffect(() => {
    const numericForm: SimulacaoInput = {
      ...form,
      valor_operacao: typeof form.valor_operacao === "number"
        ? form.valor_operacao
        : parseFloat(String(form.valor_operacao)) || 0,
      valor_icms: typeof form.valor_icms === "number"
        ? form.valor_icms
        : parseFloat(String(form.valor_icms)) || 0,
      aliquota_icms_manual: typeof form.aliquota_icms_manual === "number"
        ? form.aliquota_icms_manual
        : parseFloat(String(form.aliquota_icms_manual)) || 0,
    };

    const result = executarSimulacaoTributaria(numericForm);
    setApiResponse(result);

    // Incrementa o contador de uso se não for o carregamento inicial
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      registerUsage();
    }
  }, [form]);

  return {
    form,
    setForm,
    handleInputChange,
    setTipoIcmsMode,
    setBeneficioFiscal,
    setRegimeZFM,
    setSplitModalidade,
    apiResponse,
    isLoading,
    runSimulation,
    copiedText,
    copyToClipboard,
    activeMainTab,
    setActiveMainTab,
  };
}
