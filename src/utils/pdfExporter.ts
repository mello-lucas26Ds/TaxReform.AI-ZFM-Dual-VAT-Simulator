import html2pdf from "html2pdf.js";

/**
 * Utilitário de exportação para Relatório Executivo e Impressão em PDF
 */

export function printExecutiveReport() {
  window.print();
}

export async function downloadReportAsPDF(elementId: string = "executive-report-content") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemento com ID ${elementId} não foi encontrado.`);
    window.print();
    return;
  }

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: `Parecer_Tecnico_Tributario_ZFM_${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("Erro ao gerar PDF via html2pdf:", error);
    // Fallback para impressão nativa do navegador
    window.print();
  }
}
