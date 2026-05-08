import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Reusing module meta for friendly names if possible
const MODULE_META = {
  'mindcheck-full': { label: 'General Cognitive' },
  'executive-us-standard': { label: 'Executive Function' },
  'spatial-dynamics': { label: 'Spatial & Reaction' },
  'ai-semantic': { label: 'AI Clinical Interview' },
};

export const generatePDFReport = (user, results) => {
  const doc = new jsPDF();
  
  // 1. Title
  doc.setFontSize(22);
  doc.setTextColor(14, 165, 233); // jb-accent blue
  doc.text('Cognitive Platform', 14, 22);

  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Comprehensive Test Report', 14, 32);

  // 2. User Info & Summary
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  
  const totalTests = results.length;
  const validResults = results.filter(r => r.maxScore > 0);
  const avgPct = validResults.length 
    ? Math.round(validResults.reduce((acc, r) => acc + (r.finalScore / r.maxScore) * 100, 0) / validResults.length) 
    : 0;

  doc.text(`User Name: ${user?.name || 'Unknown User'}`, 14, 45);
  doc.text(`Email: ${user?.email || 'N/A'}`, 14, 52);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 59);
  
  doc.text(`Total Tests Taken: ${totalTests}`, 120, 45);
  doc.text(`Average Score: ${avgPct}%`, 120, 52);

  // 3. Draw a line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 65, 196, 65);

  // 4. Data Table
  if (results.length === 0) {
    doc.setFontSize(12);
    doc.text("No test results found.", 14, 80);
  } else {
    const tableColumn = ["#", "Test Name", "Date", "Score", "Percentage"];
    const tableRows = [];

    // Sort oldest to newest, or newest to oldest. Let's do newest first
    const sortedResults = [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedResults.forEach((result, index) => {
      const label = MODULE_META[result.testId]?.label || result.testId.replace('-', ' ');
      const date = `${new Date(result.createdAt).toLocaleDateString()} ${new Date(result.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      const scoreStr = `${result.finalScore} / ${result.maxScore}`;
      const pct = result.maxScore > 0 ? Math.round((result.finalScore / result.maxScore) * 100) : 0;
      
      tableRows.push([
        (index + 1).toString(),
        label,
        date,
        scoreStr,
        `${pct}%`
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [14, 165, 233], // jb-accent
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 248, 250]
      }
    });
  }

  // 5. Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Download the PDF
  doc.save(`${user?.name?.replace(/\s+/g, '_') || 'User'}_Cognitive_Report.pdf`);
};
