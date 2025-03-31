import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET, MATCH_API_URL } from "../config";
import bcrypt from "bcrypt";
import authMiddleware from "../middleware";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const router = express.Router();
const prisma = new PrismaClient();

const sqsClient = new SQSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET!,
  },
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, companyname } = req.body;

    const existingUser = await prisma.employer.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.employer.create({
      data: {
        email: email,
        password: hashedPassword,
        companyName: companyname,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        email: newUser.email,
        name: newUser.companyName,
      },
    });
  } catch (error) {
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error,
      });
    }
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/signin", authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.employer.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Signin successful",
      token,
      user: {
        email: user.email,
        name: user.companyName,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/candidates", authMiddleware, async (req, res) => {
  try {
    const candidates = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        age: true,
        resumeUrl: true,
      },
    });

    return res.status(200).json({
      candidates,
    });
  } catch (error) {
    console.error("Candidates error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/require", authMiddleware, async (req, res) => {
  try {
    const { requirement } = req.body;
    const userId = (req as any).userId;

    if (!requirement) {
      return res.status(400).json({
        message: "Requirement is required",
      });
    }
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const updatedUser = await prisma.employer.update({
      where: { id: userId },
      data: { requirement },
    });

    const messageBody = JSON.stringify({
      userId,
      requirement,
    });

    const sendMessageCommand = new SendMessageCommand({
      QueueUrl: process.env.AWS_SQS_URL!,
      MessageBody: messageBody,
      MessageGroupId: "requirementUpdates",
      MessageDeduplicationId: `${userId}-${Date.now()}`,
    });

    try {
      await sqsClient.send(sendMessageCommand);
      console.log(`Message sent to SQS for emplyerId: ${userId}`);
    } catch (sqsError) {
      console.error("Error sending message to SQS:", sqsError);
    }

    console.log(MATCH_API_URL);

    void fetch(MATCH_API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requirement: requirement,
        employerId: userId,
      }),
    }).catch(() => {});

    return res.status(200).json({
      message: "Requirement updated successfully",
      user: {
        email: updatedUser.email,
        name: updatedUser.companyName,
        requirement: updatedUser.requirement,
      },
    });
  } catch (error) {
    console.error("Requirement update error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/matches", authMiddleware, async (req, res) => {
  try {
    const matches = await prisma.matches.findMany({
      where: {
        // @ts-ignore
        userId: req.userId,
      },
      select: {
        id: true,
        score: true,
        match: true,
        requirement: true,
        user: {
          select: {
            email: true,
            name: true,
            age: true,
            resumeUrl: true,
          },
        },
      },
    });

    const formattedMatches = matches.map((match: any) => ({
      id: match.id,
      score: match.score,
      match: match.match,
      requirement: match.requirement,
      user: {
        email: match.user.email,
        name: match.user.name,
        age: match.user.age,
        resumeUrl: match.user.resumeUrl,
      },
    }));

    return res.status(200).json({
      matches: formattedMatches,
    });
  } catch (error) {
    console.error("Matches error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
