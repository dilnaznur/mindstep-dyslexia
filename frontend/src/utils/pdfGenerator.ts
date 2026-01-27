/**
 * PDF Report Generator for MindStep Assessment Results
 * Uses jsPDF for client-side PDF generation (no server required)
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportData {
  date: Date;
  riskScore: number;
  classification: string;
  confidence: number;
  metrics: {
    reading: number;
    eye_tracking: number;
    handwriting: number;
    memory: number;
    attention: number;
  };
  primaryIndicators: string[];
  detailedBreakdown: {
    reading: string[];
    writing: string[];
    behavioral: string[];
  };
  recommendation: string;
}

/**
 * Generate and download a PDF report of the assessment results
 */
export function generatePDFReport(data: ReportData): void {
  const doc = new jsPDF();

  // === HEADER ===
  // Mint gradient header
  doc.setFillColor(168, 230, 207); // Mint color
  doc.rect(0, 0, 210, 40, 'F');

  // Logo text
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80);
  doc.text('MindStep', 105, 18, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Dyslexia Assessment Report', 105, 28, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Generated: ${data.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}`, 105, 36, { align: 'center' });

  // === RISK SCORE SECTION ===
  let yPos = 55;

  doc.setFontSize(16);
  doc.setTextColor(44, 62, 80);
  doc.text('Overall Risk Assessment', 20, yPos);

  yPos += 10;

  // Risk score box
  const riskColor = data.riskScore > 60 ? [244, 67, 54] : // Red
                    data.riskScore > 40 ? [255, 152, 0] : // Orange
                    [76, 175, 80]; // Green

  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(20, yPos, 60, 25, 3, 3, 'F');

  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.riskScore.toFixed(1)}%`, 50, yPos + 16, { align: 'center' });

  // Classification
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text(data.classification, 90, yPos + 10);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Confidence: ${(data.confidence * 100).toFixed(1)}%`, 90, yPos + 20);

  // === COGNITIVE PROFILE TABLE ===
  yPos += 40;

  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text('Cognitive Profile Scores', 20, yPos);

  yPos += 5;

  const metricsData = [
    ['Reading Performance', `${data.metrics.reading.toFixed(1)}/100`],
    ['Eye Tracking', `${data.metrics.eye_tracking.toFixed(1)}/100`],
    ['Handwriting Quality', `${data.metrics.handwriting.toFixed(1)}/100`],
    ['Memory', `${data.metrics.memory.toFixed(1)}/100`],
    ['Attention', `${data.metrics.attention.toFixed(1)}/100`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Assessment Area', 'Score']],
    body: metricsData,
    theme: 'striped',
    headStyles: {
      fillColor: [137, 207, 240], // Soft blue
      textColor: [44, 62, 80],
      fontSize: 11,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [60, 60, 60],
    },
    alternateRowStyles: {
      fillColor: [250, 251, 252],
    },
    margin: { left: 20, right: 20 },
  });

  // === PRIMARY INDICATORS ===
  yPos = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text('Key Indicators Identified', 20, yPos);

  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  data.primaryIndicators.forEach((indicator) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    // Yellow warning icon simulation
    doc.setFillColor(255, 193, 7);
    doc.circle(24, yPos - 2, 2, 'F');
    doc.text(indicator, 30, yPos);
    yPos += 7;
  });

  // === DETAILED BREAKDOWN ===
  yPos += 10;

  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text('Detailed Assessment Breakdown', 20, yPos);

  yPos += 10;

  // Reading
  if (data.detailedBreakdown.reading.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(137, 207, 240); // Soft blue
    doc.text('Reading:', 20, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    data.detailedBreakdown.reading.forEach((item) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`• ${item}`, 25, yPos);
      yPos += 6;
    });
    yPos += 4;
  }

  // Writing
  if (data.detailedBreakdown.writing.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(224, 187, 228); // Lavender
    doc.text('Writing:', 20, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    data.detailedBreakdown.writing.forEach((item) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`• ${item}`, 25, yPos);
      yPos += 6;
    });
    yPos += 4;
  }

  // Behavioral
  if (data.detailedBreakdown.behavioral.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(255, 249, 196); // Pale yellow (darker for visibility)
    doc.text('Behavioral:', 20, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    data.detailedBreakdown.behavioral.forEach((item) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`• ${item}`, 25, yPos);
      yPos += 6;
    });
  }

  // === RECOMMENDATION ===
  yPos += 10;

  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text('Recommendation', 20, yPos);

  yPos += 8;

  // Green recommendation box
  doc.setFillColor(168, 230, 207, 0.3);
  doc.setDrawColor(168, 230, 207);
  doc.setLineWidth(0.5);

  // Split recommendation text into lines
  const recommendationLines = doc.splitTextToSize(data.recommendation, 165);
  const boxHeight = Math.max(recommendationLines.length * 6 + 10, 25);

  doc.roundedRect(20, yPos, 170, boxHeight, 3, 3, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(44, 62, 80);
  doc.text(recommendationLines, 25, yPos + 8);

  // === FOOTER ===
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 280, 190, 280);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'This is a screening tool, not a clinical diagnosis. Please consult a healthcare professional for formal evaluation.',
      105, 285,
      { align: 'center' }
    );
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
  }

  // === SAVE ===
  const fileName = `MindStep_Assessment_${data.date.toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
