var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pdf from "pdf-parse";
function extractTextFromPDF(pdfBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Add validation to ensure pdfBuffer is valid
            if (!pdfBuffer || pdfBuffer.length === 0) {
                throw new Error("Invalid or empty PDF buffer provided");
            }
            const data = yield pdf(pdfBuffer);
            return data.text.trim();
        }
        catch (error) {
            console.error("PDF Text Extraction Error:", error);
            return "";
        }
    });
}
export default extractTextFromPDF;
