import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
//@ts-ignore
import pdfParse from "pdf-parse/lib/pdf-parse.js";

//@ts-ignore

const config = {
  AWS: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET!,
    bucket: process.env.AWS_S3_BUCKET!,
    region: process.env.AWS_REGION!,
    sqsUrl: process.env.AWS_SQS_URL!,
  },
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
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

async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Invalid or empty PDF buffer provided");
    }

    const data = await pdfParse(pdfBuffer);
    return data.text.trim();
  } catch (error) {
    console.error("PDF Text Extraction Error:", error);
    return "";
  }
}

function extractUserId(key: string): number | null {
  const match = key.match(/userId-(\d+)\.pdf/);
  return match ? parseInt(match[1], 10) : null;
}

async function scoreResumeMatch(
  resumeText: string,
  jobRequirement: string
): Promise<number> {
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
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const scoreMatch = text.match(/score:(\d+)/i);

    return scoreMatch
      ? Math.min(10, Math.max(0, parseInt(scoreMatch[1], 10)))
      : 0;
  } catch (error) {
    console.error("Resume Scoring Error:", error);
    return 0;
  }
}

async function processResume(
  object: { Key?: string },
  employerId: number,
  requirement: string
) {
  try {
    const userId = extractUserId(object.Key || "");
    if (!userId) return null;

    const { Body } = await s3Client.send(
      new GetObjectCommand({
        Bucket: config.AWS.bucket,
        Key: object.Key!,
      })
    );

    if (!Body) return null;

    const pdfBuffer = await streamToBuffer(Body);
    const resumeText = await extractTextFromPDF(pdfBuffer);
    if (!resumeText) return null;

    const score = await scoreResumeMatch(resumeText, requirement);
    const isMatch = score >= 5;

    const matchRecord = await createMatchRecord(
      userId,
      employerId,
      requirement,
      score,
      isMatch
    );

    await sendMatchMessage(
      matchRecord,
      userId,
      employerId,
      isMatch,
      score,
      requirement
    );

    return {
      userId,
      employerId,
      requirement,
      score,
      matchId: matchRecord.id,
    };
  } catch (error) {
    console.error(`Error processing ${object.Key}:`, error);
    return null;
  }
}

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function createMatchRecord(
  userId: number,
  employerId: number,
  requirement: string,
  score: number,
  isMatch: boolean
) {
  return prisma.matches.create({
    data: {
      userId,
      employerId,
      requirement,
      score,
      match: isMatch,
    },
  });
}

async function sendMatchMessage(
  matchRecord: { id: number },
  userId: number,
  employerId: number,
  isMatch: boolean,
  score: number,
  requirement: String
) {
  try {
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: config.AWS.sqsUrl,
        MessageBody: JSON.stringify({
          userId,
          employerId,
          requirement,
          score,
          match: isMatch,
        }),
      })
    );
    console.log(`Message sent to SQS for matchId: ${matchRecord.id}`);
  } catch (sqsError) {
    console.error("Error sending message to SQS:", sqsError);
  }
}

// @ts-ignore
app.post("/trymatch", async (req: Request, res: Response) => {
  console.log("trymatch called");
  try {
    const { employerId, requirement } = req.body;

    if (!employerId || !requirement) {
      return res
        .status(400)
        .json({ error: "employerId and requirement required" });
    }
    const parsedEmployerId = parseInt(employerId);

    const employer = await prisma.employer.findUnique({
      where: { id: parsedEmployerId },
    });

    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    const listResponse = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: config.AWS.bucket,
        Prefix: "userId-",
      })
    );

    const objects = listResponse.Contents?.filter((object) => object.Key) || [];

    const matchResults = objects.map((object) =>
      processResume(object, parsedEmployerId, requirement)
    );
    const results = await Promise.all(matchResults);

    res.status(200).json({ msg: "Done", matches: results });
  } catch (error) {
    console.error("Match Processing Error:", error);
    res.status(500).json({
      error: "Failed to process match",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Resume Matching Service");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
