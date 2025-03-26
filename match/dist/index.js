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
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("home");
});
app.post("/trymatch", (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
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
            const score = 8;
            // Create a new match record in the database
            const newMatch = yield prisma.matches.create({
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
        }
        catch (error) {
            console.error("Error creating match:", error);
            res.status(500).json({
                error: "Failed to create match",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }))();
});
app.listen(5000, () => {
    console.log("Running on port 5000");
});
