import React from "react";
import { Calculator, ExternalLink, BarChart3, FileSpreadsheet, FileText, MapPin, Zap } from "lucide-react";
import { MainTabType } from "../../hooks/useTaxSimulation";
import { AccessCounter } from "./AccessCounter";

interface HeaderProps {
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const handleSelectTab = (tab: MainTabType) => {
    setActiveTab(tab);
    
    // Smooth scroll para a área de conteúdo selecionada
    setTimeout(() => {
      if (tab === "report") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById("results-workspace");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }, 50);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/15">
              <Calculator className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 font-display">
                  Tax Reform Hub • IBS / CBS
                </h1>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-emerald-600" />
                  Especial Amazonas &amp; ZFM
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Simulador Executivo com Regras do Amazonas, ZFM (EC 132/23 / PLP 68/24) e Split Payment
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 w-full md:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => handleSelectTab("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Dashboard Executivo</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab("split")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === "split"
                  ? "bg-amber-500 text-white shadow-xs ring-1 ring-amber-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Split Payment</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab("memory")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === "memory"
                  ? "bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Memória &amp; Regimes</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab("report")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === "report"
                  ? "bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Parecer Técnico</span>
            </button>
          </div>

          {/* Access Counter Badge & External Gov Link */}
          <div className="hidden lg:flex items-center gap-3">
            <AccessCounter variant="header" />
            <a
              href="https://consumo.tributos.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 transition px-3 py-1.5 rounded-xl border border-slate-200"
            >
              <span>Calculadora GOV</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
