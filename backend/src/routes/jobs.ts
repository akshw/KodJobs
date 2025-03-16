import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const jobId: number[] = [];

router.get("/jobs", async (req, res) => {
  try {
    const jobid_res = await axios.get(
      "https://hacker-news.firebaseio.com/v0/jobstories.json",
      { timeout: 5000 }
    );
    const ids = jobid_res.data;
    jobId.push(...ids);
    console.log(jobId);

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

    const dbJobs = await Promise.all(
      jobDetails.map(async (job) => {
        try {
          const existingJob = await prisma.jobs.findUnique({
            //@ts-ignore
            where: { jobid: job.id },
          });

          if (existingJob) {
            return existingJob;
          }
          return await prisma.jobs.create({
            data: {
              jobid: job.id,
              jobPoster: job.by || "Unknown",
              title: job.title || "No Title",
              date_time: new Date(job.time * 1000),
              ApplyUrl: job.url || "",
            },
          });
        } catch (error) {
          console.error(`Failed to store job ${job.id}:`, error);

          return null;
        }
      })
    );

    const savedJobs = dbJobs.filter((job) => job !== null);

    res.json({
      total: savedJobs.length,
      jobs: savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch the job descprition",
    });
  }
});

export default router;
