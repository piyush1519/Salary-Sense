// utils/generateReport.js
const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const generateReport = async (trendData, summaryText) => {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage(); // ✅ Use let
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 50;

  // Title
  page.drawText("Developer Salary Trends Report", {
    x: 50,
    y,
    size: 20,
    font: titleFont,
    color: rgb(0, 0.53, 0.71),
  });

  y -= 40;

  const timestamp = new Date().toLocaleString();
  page.drawText(`Generated on: ${timestamp}`, {
    x: 50,
    y,
    size: 10,
    font,
  });

  y -= 30;

  // Summary
  page.drawText("Summary Insights:", { x: 50, y, size: 14, font: titleFont });
  y -= 20;

  const lines = summaryText.split("\n");
  for (const line of lines) {
    if (y < 50) {
      page = pdfDoc.addPage(); // ✅ properly assign new page
      y = height - 50;
    }

    page.drawText(line, { x: 55, y, size: 10, font });
    y -= 15;
  }

  y -= 15;

  // Trend Tables
  for (const [title, items] of Object.entries(trendData)) {
    if (y < 100) {
      page = pdfDoc.addPage(); // ✅ assign new page again here
      y = height - 50;
    }

    page.drawText(title, { x: 50, y, size: 12, font: titleFont });
    y -= 18;

    for (const item of items) {
      if (y < 50) {
        page = pdfDoc.addPage();
        y = height - 50;
      }

      const line = `${item.label}: $${item.avgSalary}`;
      page.drawText(line, { x: 55, y, size: 10, font });
      y -= 14;
    }

    y -= 10;
  }

  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(__dirname, "../ml-etl/uploads/salary-report.pdf");
  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
};

module.exports = generateReport;
