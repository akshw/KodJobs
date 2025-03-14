import express, { response } from "express";
import cors from "cors";
import { z } from "zod";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET, PORT } from "./config";
import bcrypt from "bcrypt";

const port = PORT;
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

const jobId: number[] = [];

app.get("/health", async (req, res) => {
  res.send("healthy-check");
});

const SignupBody = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50),
  dob: z.coerce.date().refine(
    (date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 13;
    },
    { message: "You must be at least 13 years old" }
  ),
});

const SigninBody = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

app.post("/signup", async (req, res) => {
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

app.post("/signin", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/jobs", async (req, res) => {
  try {
    const jobid_res = await axios.get(
      "https://hacker-news.firebaseio.com/v0/jobstories.json",
      { timeout: 5000 }
    );
    const ids = jobid_res.data;
    jobId.push(...ids);
    console.log(jobId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch ids" });
  }

  try {
    const jobPromises = jobId.map((job) => {
      return axios
        .get(`https://hacker-news.firebaseio.com/v0/item/${job}.json`, {
          timeout: 3000,
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(`Failed to fetch job ${job}:${error.message}`);
          return null;
        });
    });

    const results = await Promise.all(jobPromises);
    console.log(results);
    const jobDetails = results.filter((job) => {
      return job !== null;
    });
    res.json(jobDetails);
  } catch (error) {
    console.error("Failed to fetch jobs:", (error as Error).message);
    res.status(500).json({
      error: "Failed to fetch the job descprition",
    });
  }
});
