import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
import authMiddleware from "../middleware";
import e from "express";

const router = express.Router();
const prisma = new PrismaClient();

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

export default router;
