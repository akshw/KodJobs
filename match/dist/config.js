import * as dotenv from "dotenv";
dotenv.config();
export const API_KEY = process.env.API_KEY;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_ACCESS_KEY_SECRET = process.env.AWS_ACCESS_KEY_SECRET || "";
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || "kodjobs2";
// API Keys
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
