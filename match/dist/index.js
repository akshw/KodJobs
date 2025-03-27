// import express from "express";
// import cors from "cors";
// import { PrismaClient } from "@prisma/client";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import {
//   S3Client,
//   ListObjectsV2Command,
//   GetObjectCommand,
// } from "@aws-sdk/client-s3";
// import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
// import {
//   AWS_ACCESS_KEY_ID,
//   AWS_ACCESS_KEY_SECRET,
//   AWS_S3_BUCKET,
// } from "./config.js";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
// // @ts-ignore
// import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
// const prisma = new PrismaClient();
// const app = express();
// app.use(express.json());
// app.use(cors());
// const apiKey = process.env.GEMINI_API_KEY;
// //@ts-ignore
// const genAI = new GoogleGenerativeAI(apiKey);
// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-pro",
// });
// const s3Client = new S3Client({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_ACCESS_KEY_SECRET,
//   },
// });
// app.get("/", (req: express.Request, res: express.Response) => {
//   res.send("home");
// });
// function extractUserId(key: string): number | null {
//   const match = key.match(/userId-(\d+)\.pdf/);
//   console.log(key);
//   //@ts-ignore
//   console.log("match", match[1]);
//   //@ts-ignore
//   console.log(parseInt(match[1], 10));
//   if (match && match[1]) {
//     return parseInt(match[1], 10);
//   }
//   return null;
// }
// async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
//   try {
//     // Load the PDF document
//     const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
//     const pdf = await loadingTask.promise;
//     let fullText = "";
//     // Extract text from each page
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const content = await page.getTextContent();
//       const strings = content.items.map((item: any) => item.str);
//       fullText += strings.join(" ");
//     }
//     return fullText;
//   } catch (error) {
//     console.error("Error extracting text from PDF:", error);
//     return "";
//   }
// }
// // Function to analyze resume against job requirement using Gemini AI
// async function scoreResumeMatch(
//   resumeText: string,
//   jobRequirement: string
// ): Promise<number> {
//   try {
//     const prompt = `
//       Task: Evaluate the resume against the job requirements and provide a compatibility score from 0 to 10, with **higher weight given to relevant projects and experience**.
//   Scoring Criteria (with priority on projects & experience):
//   - 10: Perfect match (strong relevant experience and projects, meets/exceeds all job requirements).
//   - 7-9: Strong match (good experience and projects, meets most key requirements, minor gaps).
//   - 4-6: Moderate match (some relevant experience/projects but missing key qualifications).
//   - 1-3: Weak match (little relevant experience/projects, major gaps in qualifications).
//   - 0: No match (does not align with job requirements at all).
//   **Projects and Experience should be given the highest priority** in determining the score, followed by other things.
//       Resume:
//       ${resumeText}
//       Job Requirements:
//       ${jobRequirement}
//       Provide only a numeric score from 0 to 10 in this format: score:X
//       where X is the numeric score. Do not add any explanations or other text.
//     `;
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();
//     // Extract score from response (assuming format "score:X")
//     const scoreMatch = text.match(/score:(\d+)/i);
//     if (scoreMatch && scoreMatch[1]) {
//       const score = parseInt(scoreMatch[1], 10);
//       return Math.min(10, Math.max(0, score)); // Ensure score is between 0-10
//     }
//     // Default score if format is incorrect
//     return 0;
//   } catch (error) {
//     console.error("Error scoring resume:", error);
//     return 0;
//   }
// }
// //@ts-ignore
// app.post("/trymatch", async (req: express.Request, res: express.Response) => {
//   console.log("trymatch hitted");
//   try {
//     const { employerId, requirement } = req.body;
//     if (!employerId || !requirement) {
//       return res.status(400).json({
//         error: "employerId and requirement required",
//       });
//     }
//     console.log("Processing match request for employer:", employerId);
//     const listCommand = new ListObjectsV2Command({
//       Bucket: "kodjobs2",
//       Prefix: "userId-",
//     });
//     const listResponse = await s3Client.send(listCommand);
//     if (!listResponse.Contents || listResponse.Contents.length === 0) {
//       return res.status(200).json({
//         message: "No resumes found to match",
//         matches: [],
//       });
//     }
//     const matchResults = [];
//     for (const object of listResponse.Contents) {
//       console.log(object.Key);
//       if (!object.Key) continue;
//       const userId = extractUserId(object.Key);
//       if (!userId) continue;
//       const getCommand = new GetObjectCommand({
//         Bucket: "kodjobs2",
//         Key: object.Key,
//       });
//       const objectResponse = await s3Client.send(getCommand);
//       if (!objectResponse.Body) continue;
//       const chunks = [];
//       for await (const chunk of objectResponse.Body as any) {
//         chunks.push(chunk);
//       }
//       const pdfBuffer = Buffer.concat(chunks);
//       // Extract text from PDF
//       const resumeText = await extractTextFromPDF(pdfBuffer);
//       if (!resumeText) {
//         console.log(`Could not extract text from resume: ${object.Key}`);
//         continue;
//       }
//       // Score the match using Gemini
//       const score = await scoreResumeMatch(resumeText, requirement);
//       // Determine if it's a match (score >= 5)
//       const isMatch = score >= 5;
//       // Create a record in the database
//       const matchRecord = await prisma.matches.create({
//         data: {
//           userId: userId,
//           employerId: parseInt(employerId),
//           requirement: requirement,
//           score: score,
//           match: isMatch,
//         },
//       });
//       matchResults.push({
//         userId,
//         score,
//         isMatch,
//         matchId: matchRecord.id,
//       });
//       console.log(`Processed resume for userId:${userId}, score:${score}`);
//     }
//     res.json({
//       message: "Match processing completed",
//       totalProcessed: matchResults.length,
//       matches: matchResults,
//     });
//   } catch (error) {
//     console.error("Error processing matches:", error);
//     res.status(500).json({
//       error: "Failed to process match",
//       details: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// });
// app.listen(5000, () => {
//   console.log("Running on port 5000");
// });
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { S3Client, ListObjectsV2Command, GetObjectCommand, } from "@aws-sdk/client-s3";
//@ts-ignore
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
// Configuration
const config = {
    AWS: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
        bucket: "kodjobs2",
        region: "ap-south-1",
    },
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};
const app = express();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const s3Client = new S3Client({
    region: config.AWS.region,
    credentials: {
        accessKeyId: config.AWS.accessKeyId,
        secretAccessKey: config.AWS.secretAccessKey,
    },
});
// Middleware
app.use(express.json());
app.use(cors());
function extractTextFromPDF(pdfBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!pdfBuffer || pdfBuffer.length === 0) {
                throw new Error("Invalid or empty PDF buffer provided");
            }
            const loadingTask = pdfjsLib.getDocument({
                data: new Uint8Array(pdfBuffer),
            });
            const pdf = yield loadingTask.promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = yield pdf.getPage(i);
                const textContent = yield page.getTextContent();
                const textItems = textContent.items.map((item) => item.str);
                fullText += textItems.join(" ") + " ";
            }
            return fullText.trim();
        }
        catch (error) {
            console.error("PDF Text Extraction Error:", error);
            return "";
        }
    });
}
function extractUserId(key) {
    const match = key.match(/userId-(\d+)\.pdf/);
    console.log(key);
    console.log(match);
    return match ? parseInt(match[1], 10) : null;
}
function scoreResumeMatch(resumeText, jobRequirement) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `
    Evaluate the resume against job requirements. Provide a compatibility score from 0 to 10.
    
    Scoring Criteria (with priority on projects & experience):
    - 10: Perfect match (strong relevant projects and experience)
    - 7-9: Strong match (good projects and experience, meets most requirements)
    - 4-6: Moderate match (some relevant projects and experience)
    - 1-3: Weak match (little relevant projects and experience)
    - 0: No match

    Resume: ${resumeText}
    Job Requirements: ${jobRequirement}
    
    Output Format:  
    Provide only a numeric score in the following format: **score:X**  
    Replace **X** with the appropriate number. Do not include any explanations, comments, or additional text.
  `;
        try {
            const result = yield model.generateContent(prompt);
            const text = result.response.text();
            const scoreMatch = text.match(/score:(\d+)/i);
            return scoreMatch
                ? Math.min(10, Math.max(0, parseInt(scoreMatch[1], 10)))
                : 0;
        }
        catch (error) {
            console.error("Resume Scoring Error:", error);
            return 0;
        }
    });
}
// Routes
app.get("/", (req, res) => {
    res.send("Resume Matching Service");
});
//@ts-ignore
app.post("/trymatch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { employerId, requirement } = req.body;
        if (!employerId || !requirement) {
            return res
                .status(400)
                .json({ error: "employerId and requirement required" });
        }
        const listCommand = new ListObjectsV2Command({
            Bucket: config.AWS.bucket,
            Prefix: "userId-",
        });
        const listResponse = yield s3Client.send(listCommand);
        if (!((_a = listResponse.Contents) === null || _a === void 0 ? void 0 : _a.length)) {
            return res.status(200).json({
                message: "No resumes found",
                matches: [],
            });
        }
        const matchResults = yield Promise.all(listResponse.Contents.filter((object) => object.Key).map((object) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const userId = extractUserId(object.Key);
            if (!userId)
                return null;
            const getCommand = new GetObjectCommand({
                Bucket: config.AWS.bucket,
                Key: object.Key,
            });
            const objectResponse = yield s3Client.send(getCommand);
            if (!objectResponse.Body)
                return null;
            const chunks = [];
            try {
                for (var _d = true, _e = __asyncValues(objectResponse.Body), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const chunk = _c;
                    chunks.push(chunk);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const pdfBuffer = Buffer.concat(chunks);
            const resumeText = yield extractTextFromPDF(pdfBuffer);
            if (!resumeText)
                return null;
            const score = yield scoreResumeMatch(resumeText, requirement);
            const isMatch = score >= 5;
            const matchRecord = yield prisma.matches.create({
                data: {
                    userId,
                    employerId: parseInt(employerId),
                    requirement,
                    score,
                    match: isMatch,
                },
            });
            return {
                userId,
                score,
                isMatch,
                matchId: matchRecord.id,
            };
        })));
        const validMatches = matchResults.filter((match) => match !== null);
        res.json({
            message: "Match processing completed",
            totalProcessed: validMatches.length,
            matches: validMatches,
        });
    }
    catch (error) {
        console.error("Match Processing Error:", error);
        res.status(500).json({
            error: "Failed to process match",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;
