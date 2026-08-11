import React from "react";
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { SimulationForm } from "./components/form/SimulationForm";
import { ExecutiveDashboard } from "./components/dashboard/ExecutiveDashboard";
import { CalculationMemoryTable } from "./components/memory/CalculationMemoryTable";
import { ExecutiveReportView } from "./components/report/ExecutiveReportView";
import { SplitPaymentView } from "./components/splitPayment/SplitPaymentView";
import { useTaxSimulation, MainTabType } from "./hooks/useTaxSimulation";
import { BarChart3, Zap, FileSpreadsheet, FileText, ArrowRight } from "lucide-react";

export default function App() {
  const {
    form,
    handleInputChange,
    setTipoIcmsMode,
    setBeneficioFiscal,
    setRegimeZFM,
    setSplitModalidade,
    apiResponse,
    isLoading,
    runSimulation,
    activeMainTab,
    setActiveMainTab,
  } = useTaxSimulation();

  const handleTabSwitch = (tab: MainTabType) => {
    setActiveMainTab(tab);
    setTimeout(() => {
      if (tab === "report") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById("results-workspace");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 50);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans antialiased flex flex-col justify-between">
      <div>
        {/* Header Navigation */}
        <Header activeTab={activeMainTab} setActiveTab={handleTabSwitch} />

        {/* Main Content Workspace */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {activeMainTab === "report" ? (
            /* Full width report view for presentation/printing */
            <div id="results-workspace">
              <ExecutiveReportView apiResponse={apiResponse} form={form} />
            </div>
          ) : (
            /* 2-Column Split View for Interactive Simulator */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Input Form (6 cols on XL) */}
              <div className="lg:col-span-12 xl:col-span-6">
                <SimulationForm
                  form={form}
                  handleInputChange={handleInputChange}
                  setTipoIcmsMode={setTipoIcmsMode}
                  setBeneficioFiscal={setBeneficioFiscal}
                  setRegimeZFM={setRegimeZFM}
                  isLoading={isLoading}
                  runSimulation={runSimulation}
                />
              </div>

              {/* Right Column: Active View (6 cols on XL) */}
              <div className="lg:col-span-12 xl:col-span-6 space-y-4" id="results-workspace">
                {/* Secondary In-Panel Navigation Bar */}
                <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-xs flex items-center justify-between gap-1 overflow-x-auto">
                  <span className="text-[11px] font-bold uppercase text-slate-400 px-2 hidden sm:inline">
                    Visão Ativa:
                  </span>

                  <div className="flex items-center gap-1 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("dashboard")}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        activeMainTab === "dashboard"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabSwitch("split")}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        activeMainTab === "split"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Zap className="h-3.5 w-3.5 fill-current" />
                      <span>Split Payment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabSwitch("memory")}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        activeMainTab === "memory"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      <span>Memória &amp; Regimes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTabSwitch("report")}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer text-slate-600 hover:bg-slate-100`}
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      <span className="hidden md:inline">Parecer</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Active View Container */}
                <div>
                  {activeMainTab === "dashboard" && (
                    <ExecutiveDashboard
                      apiResponse={apiResponse}
                      form={form}
                    />
                  )}

                  {activeMainTab === "split" && (
                    <SplitPaymentView
                      apiResponse={apiResponse}
                      form={form}
                      setSplitModalidade={setSplitModalidade}
                    />
                  )}

                  {activeMainTab === "memory" && (
                    <CalculationMemoryTable
                      etapas={apiResponse?.memoria_calculo?.etapas}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
