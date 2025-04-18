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
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const middleware_1 = __importDefault(require("../middleware"));
const client_sqs_1 = require("@aws-sdk/client-sqs");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const sqsClient = new client_sqs_1.SQSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    },
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, companyname } = req.body;
        const existingUser = yield prisma.employer.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma.employer.create({
            data: {
                email: email,
                password: hashedPassword,
                companyName: companyname,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, config_1.JWT_SECRET, {
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
    }
    catch (error) {
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
}));
router.post("/signin", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.employer.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.JWT_SECRET, {
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
    }
    catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}));
router.get("/candidates", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidates = yield prisma.user.findMany({
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
    }
    catch (error) {
        console.error("Candidates error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}));
router.post("/require", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requirement } = req.body;
        const userId = req.userId;
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
        const updatedUser = yield prisma.employer.update({
            where: { id: userId },
            data: { requirement },
        });
        const messageBody = JSON.stringify({
            userId,
            requirement,
        });
        const sendMessageCommand = new client_sqs_1.SendMessageCommand({
            QueueUrl: process.env.AWS_SQS_URL,
            MessageBody: messageBody,
            MessageGroupId: "requirementUpdates",
            MessageDeduplicationId: `${userId}-${Date.now()}`,
        });
        try {
            yield sqsClient.send(sendMessageCommand);
            console.log(`Message sent to SQS for emplyerId: ${userId}`);
        }
        catch (sqsError) {
            console.error("Error sending message to SQS:", sqsError);
        }
        console.log(config_1.MATCH_API_URL);
        void fetch(config_1.MATCH_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                requirement: requirement,
                employerId: userId,
            }),
        }).catch(() => { });
        return res.status(200).json({
            message: "Requirement updated successfully",
            user: {
                email: updatedUser.email,
                name: updatedUser.companyName,
                requirement: updatedUser.requirement,
            },
        });
    }
    catch (error) {
        console.error("Requirement update error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}));
router.get("/matches", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matches = yield prisma.matches.findMany({
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
        const formattedMatches = matches.map((match) => ({
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
    }
    catch (error) {
        console.error("Matches error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}));
exports.default = router;
