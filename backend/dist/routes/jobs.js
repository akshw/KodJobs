"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const middleware_1 = __importDefault(require("../middleware"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const jobId = [];
router.get("/jobs", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobid_res = yield axios_1.default.get("https://hacker-news.firebaseio.com/v0/jobstories.json", { timeout: 5000 });
        const ids = jobid_res.data;
        jobId.push(...ids);
        const jobPromises = jobId.map((job) => {
            return axios_1.default
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
        const results = yield Promise.all(jobPromises);
        const jobDetails = results.filter((job) => {
            return job !== null;
        });
        const dbJobs = yield Promise.all(jobDetails.map((job) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const existingJob = yield prisma.jobs.findUnique({
                    //@ts-ignore
                    where: { jobid: job.id },
                });
                if (existingJob) {
                    return existingJob;
                }
                return yield prisma.jobs.create({
                    data: {
                        jobid: job.id,
                        jobPoster: job.by || "Unknown",
                        title: job.title || "No Title",
                        date_time: new Date(job.time * 1000),
                        ApplyUrl: job.url || "",
                    },
                });
            }
            catch (error) {
                console.error(`Failed to store job ${job.id}:`, error);
                return null;
            }
        })));
        const savedJobs = dbJobs.filter((job) => job !== null);
        res.json({
            jobs: savedJobs,
        });
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch the job descprition",
        });
    }
}));
exports.default = router;
