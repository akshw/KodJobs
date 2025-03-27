import pdf from "pdf-parse";
import fs from "fs";

async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    // Add validation to ensure pdfBuffer is valid
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Invalid or empty PDF buffer provided");
    }

    const data = await pdf(pdfBuffer);
    return data.text.trim();
  } catch (error) {
    console.error("PDF Text Extraction Error:", error);
    return "";
  }
}

export default extractTextFromPDF;
