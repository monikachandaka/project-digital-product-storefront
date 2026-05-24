const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// Stamps the buyer's email on every page of a PDF (footer)
async function stampPdf(buffer, email) {
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  pages.forEach(page => {
    const { width, height } = page.getSize();
    page.drawText(`Purchased by: ${email}`, {
      x: 40,
      y: 20,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.7,
    });
  });
  return await pdfDoc.save();
}

module.exports = stampPdf;
