import { toSafeFilename } from "@/lib/format";
import { splitTranscriptParagraphs } from "@/lib/transcript";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function baseFilename(title: string | null | undefined): string {
  return toSafeFilename(title);
}

export function downloadTranscriptTxt(text: string, title: string) {
  downloadBlob(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
    `${baseFilename(title)}.txt`,
  );
}

export async function downloadTranscriptPdf(text: string, title: string) {
  const { jsPDF } = await import("jspdf");
  const document = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 52;
  const fontSize = 11;
  const lineHeight = 17;
  const pageHeight = document.internal.pageSize.getHeight();
  const pageWidth = document.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  document.setFont("helvetica", "normal");
  document.setFontSize(fontSize);

  for (const paragraph of splitTranscriptParagraphs(text)) {
    for (const paragraphLine of paragraph.split("\n")) {
      const lines = document.splitTextToSize(
        paragraphLine,
        contentWidth,
      ) as string[];

      for (const line of lines) {
        if (y + lineHeight > pageHeight - margin) {
          document.addPage();
          y = margin;
        }
        document.text(line, margin, y);
        y += lineHeight;
      }
    }
    y += lineHeight;
  }

  document.save(`${baseFilename(title)}.pdf`);
}

export async function downloadTranscriptDocx(text: string, title: string) {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");
  const paragraphs = splitTranscriptParagraphs(text).map(
    (paragraph) => {
      const lines = paragraph.split("\n");
      const runs = lines.map(
        (line, index) =>
          new TextRun({
            text: line,
            break: index > 0 ? 1 : undefined,
          }),
      );

      return (
      new Paragraph({
        children: runs,
        spacing: { after: 240, line: 360 },
      })
      );
    },
  );
  const document = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });
  const blob = await Packer.toBlob(document);

  downloadBlob(blob, `${baseFilename(title)}.docx`);
}
