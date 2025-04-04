import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SignupBody, SigninBody } from "../types";
import authMiddleware from "../middleware";
import {
  JWT_SECRET,
  AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET,
} from "../config";

const router = express.Router();

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID as string,
    secretAccessKey: AWS_ACCESS_KEY_SECRET as string,
  },
});

router.post("/signup", async (req, res) => {
  try {
    const validatedData = SignupBody.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validatedData.error.errors,
      });
    }
    const { email, password, name, dob } = validatedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        dob,
        age,
        resumeUrl: "",
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
        name: newUser.name,
        age: newUser.age,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const validatedData = SigninBody.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: validatedData.error.errors,
      });
    }

    const { email, password } = validatedData.data;

    const user = await prisma.user.findUnique({
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
        name: user.name,
        age: user.age,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/upload", authMiddleware, async (req, res) => {
  try {
    // I should Generate unique file key
    //@ts-ignore
    const fileKey = `userId-${req.userId}.pdf`;

    const command = new PutObjectCommand({
      Bucket: "kodjobs2",
      Key: fileKey,
      ContentType: "application/pdf",
    });

    try {
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 120,
      });

      res.json({
        uploadUrl: signedUrl,
        key: fileKey,
      });
    } catch (error) {
      console.error("S3 signing error:", error);
      res.status(500).json({
        message: "Failed to generate upload URL",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: req.userId },
      select: { email: true, name: true },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: req.userId },
      select: {
        email: true,
        name: true,
        age: true,
        resumeUrl: true,
        matches: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
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
        employer: {
          select: {
            email: true,
            companyName: true,
          },
        },
      },
    });

    const formattedMatches = matches.map((match: any) => ({
      id: match.id,
      score: match.score,
      match: match.match,
      requirement: match.requirement,
      employer: {
        email: match.employer.email,
        companyName: match.employer.companyName,
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
