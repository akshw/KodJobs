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
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { S3Client, ListObjectsV2Command, GetObjectCommand, } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
//@ts-ignore
import pdfParse from "pdf-parse/lib/pdf-parse.js";
//@ts-ignore
const config = {
    AWS: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
        bucket: process.env.AWS_S3_BUCKET,
        region: process.env.AWS_REGION,
        sqsUrl: process.env.AWS_SQS_URL,
    },
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const s3Client = new S3Client({
    region: config.AWS.region,
    credentials: {
        accessKeyId: config.AWS.accessKeyId,
        secretAccessKey: config.AWS.secretAccessKey,
    },
});
const sqsClient = new SQSClient({
    region: config.AWS.region,
    credentials: {
        accessKeyId: config.AWS.accessKeyId,
        secretAccessKey: config.AWS.secretAccessKey,
    },
});
function extractTextFromPDF(pdfBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!pdfBuffer || pdfBuffer.length === 0) {
                throw new Error("Invalid or empty PDF buffer provided");
            }
            const data = yield pdfParse(pdfBuffer);
            return data.text.trim();
        }
        catch (error) {
            console.error("PDF Text Extraction Error:", error);
            return "";
        }
    });
}
function extractUserId(key) {
    const match = key.match(/userId-(\d+)\.pdf/);
    return match ? parseInt(match[1], 10) : null;
}
function scoreResumeMatch(resumeText, jobRequirement) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `
    System prompt:You are an expert HR and your job is to find the best match for the job requirement.

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
function processResume(object, employerId, requirement) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = extractUserId(object.Key || "");
            if (!userId)
                return null;
            const { Body } = yield s3Client.send(new GetObjectCommand({
                Bucket: config.AWS.bucket,
                Key: object.Key,
            }));
            if (!Body)
                return null;
            const pdfBuffer = yield streamToBuffer(Body);
            const resumeText = yield extractTextFromPDF(pdfBuffer);
            if (!resumeText)
                return null;
            const score = yield scoreResumeMatch(resumeText, requirement);
            const isMatch = score >= 5;
            const matchRecord = yield createMatchRecord(userId, employerId, requirement, score, isMatch);
            yield sendMatchMessage(matchRecord, userId, employerId, isMatch, score, requirement);
            return {
                userId,
                employerId,
                requirement,
                score,
                matchId: matchRecord.id,
            };
        }
        catch (error) {
            console.error(`Error processing ${object.Key}:`, error);
            return null;
        }
    });
}
function streamToBuffer(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, stream_1, stream_1_1;
        var _b, e_1, _c, _d;
        const chunks = [];
        try {
            for (_a = true, stream_1 = __asyncValues(stream); stream_1_1 = yield stream_1.next(), _b = stream_1_1.done, !_b; _a = true) {
                _d = stream_1_1.value;
                _a = false;
                const chunk = _d;
                chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = stream_1.return)) yield _c.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return Buffer.concat(chunks);
    });
}
function createMatchRecord(userId, employerId, requirement, score, isMatch) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.matches.create({
            data: {
                userId,
                employerId,
                requirement,
                score,
                match: isMatch,
            },
        });
    });
}
function sendMatchMessage(matchRecord, userId, employerId, isMatch, score, requirement) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sqsClient.send(new SendMessageCommand({
                QueueUrl: config.AWS.sqsUrl,
                MessageBody: JSON.stringify({
                    userId,
                    employerId,
                    requirement,
                    score,
                    match: isMatch,
                }),
            }));
            console.log(`Message sent to SQS for matchId: ${matchRecord.id}`);
        }
        catch (sqsError) {
            console.error("Error sending message to SQS:", sqsError);
        }
    });
}
// @ts-ignore
app.post("/trymatch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { employerId, requirement } = req.body;
        if (!employerId || !requirement) {
            return res
                .status(400)
                .json({ error: "employerId and requirement required" });
        }
        const parsedEmployerId = parseInt(employerId);
        const employer = yield prisma.employer.findUnique({
            where: { id: parsedEmployerId },
        });
        if (!employer) {
            return res.status(404).json({ error: "Employer not found" });
        }
        const listResponse = yield s3Client.send(new ListObjectsV2Command({
            Bucket: config.AWS.bucket,
            Prefix: "userId-",
        }));
        const objects = ((_a = listResponse.Contents) === null || _a === void 0 ? void 0 : _a.filter((object) => object.Key)) || [];
        const matchResults = objects.map((object) => processResume(object, parsedEmployerId, requirement));
        const results = yield Promise.all(matchResults);
        res.status(200).json({ msg: "Done", matches: results });
    }
    catch (error) {
        console.error("Match Processing Error:", error);
        res.status(500).json({
            error: "Failed to process match",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
app.get("/", (req, res) => {
    res.send("Resume Matching Service");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;
