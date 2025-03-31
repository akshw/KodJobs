import * as dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_ACCESS_KEY_SECRET = process.env.AWS_ACCESS_KEY_SECRET;
export const AWS_SQS_URL = process.env.AWS_SQS_URL;
export const MATCH_API_URL = process.env.MATCH_API_URL;
