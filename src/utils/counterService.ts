/**
 * Serviço de Contador de Acessos e Usos do Simulador (Access & Usage Counter)
 * Armazena com persistência local e gerencia contadores em tempo real.
 */

const STORAGE_KEYS = {
  VISITS: "tax_reform_hub_visits_count",
  USAGE: "tax_reform_hub_usage_count",
  SESSION_VISITED: "tax_reform_hub_session_active",
};

// Bases iniciais zeradas (persistência via localStorage)
const BASE_VISITS = 0;
const BASE_USAGE = 0;

export interface CounterStats {
  visitsCount: number;
  usageCount: number;
}

export function getCounterStats(): CounterStats {
  try {
    const rawVisits = localStorage.getItem(STORAGE_KEYS.VISITS);
    const rawUsage = localStorage.getItem(STORAGE_KEYS.USAGE);

    const visits = rawVisits ? parseInt(rawVisits, 10) : BASE_VISITS;
    const usage = rawUsage ? parseInt(rawUsage, 10) : BASE_USAGE;

    return {
      visitsCount: isNaN(visits) ? BASE_VISITS : visits,
      usageCount: isNaN(usage) ? BASE_USAGE : usage,
    };
  } catch (e) {
    return { visitsCount: BASE_VISITS, usageCount: BASE_USAGE };
  }
}

export function registerVisit(): CounterStats {
  try {
    const stats = getCounterStats();
    
    // Incrementa visitas se for uma nova sessão no navegador
    if (!sessionStorage.getItem(STORAGE_KEYS.SESSION_VISITED)) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION_VISITED, "true");
      const newVisits = stats.visitsCount + 1;
      localStorage.setItem(STORAGE_KEYS.VISITS, newVisits.toString());
      return { ...stats, visitsCount: newVisits };
    }
    return stats;
  } catch (e) {
    return getCounterStats();
  }
}

export function registerUsage(): CounterStats {
  try {
    const stats = getCounterStats();
    const newUsage = stats.usageCount + 1;
    localStorage.setItem(STORAGE_KEYS.USAGE, newUsage.toString());
    
    // Dispara evento customizado para atualizar os componentes em tempo real sem reload
    window.dispatchEvent(new CustomEvent("tax_counter_updated"));
    
    return { ...stats, usageCount: newUsage };
  } catch (e) {
    return getCounterStats();
  }
}
