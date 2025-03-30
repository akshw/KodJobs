import * as dotenv from "dotenv";
dotenv.config();
export const PORT = process.env.PORT || 5000;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_ACCESS_KEY_SECRET = process.env.AWS_ACCESS_KEY_SECRET || "";
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || "";
export const AWS_REGION = process.env.AWS_REGION || "";
export const AWS_SQS_URL = process.env.AWS_SQS_URL || "";
// API Keys
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
