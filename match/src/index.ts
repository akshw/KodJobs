import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("home");
});

app.post("/trymatch", (req: express.Request, res: express.Response) => {
  (async () => {
    console.log("hit trymatch");
    try {
      // Extract data from request body
      const { employerId, requirement } = req.body;

      // Validate the data
      if (!employerId || !requirement) {
        return res.status(400).json({
          error: "employerId and requirement required",
        });
      }
      console.log("trymatch hitted");
      const score: number = 8;
      // Create a new match record in the database
      const newMatch = await prisma.matches.create({
        data: {
          userId: 1,
          employerId: parseInt(employerId),
          requirement: requirement,
          score: score || 0,
          match: score >= 5 ? true : false,
        },
      });
      console.log("newMatch", newMatch);
      // Return the created match
      res.json(newMatch);
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(500).json({
        error: "Failed to create match",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  })();
});

app.listen(5000, () => {
  console.log("Running on port 5000");
});
