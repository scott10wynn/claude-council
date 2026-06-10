'use client';

export async function exportToPDF(element: HTMLElement, filename: string): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');
  const { jsPDF } = await import('jspdf');

  const scale = 2;
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const canvasAspect = canvas.height / canvas.width;
  const imgHeight = pageWidth * canvasAspect;

  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
  } else {
    let position = 0;
    let remaining = imgHeight;
    let page = 0;
    while (remaining > 0) {
      if (page > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -position, pageWidth, imgHeight);
      position += pageHeight;
      remaining -= pageHeight;
      page++;
    }
  }

  pdf.save(`${filename.replace(/\s+/g, '-')}.pdf`);
}
