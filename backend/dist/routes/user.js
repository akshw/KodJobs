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
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const types_1 = require("../types");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const s3Client = new client_s3_1.S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: config_1.AWS_ACCESS_KEY_ID,
        secretAccessKey: config_1.AWS_ACCESS_KEY_SECRET,
    },
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = types_1.SignupBody.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: validatedData.error.errors,
            });
        }
        const { email, password, name, dob } = validatedData.data;
        const existingUser = yield prisma.user.findUnique({
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
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                dob,
                age,
                resumeUrl: "",
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
                name: newUser.name,
                age: newUser.age,
            },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = types_1.SigninBody.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: validatedData.error.errors,
            });
        }
        const { email, password } = validatedData.data;
        const user = yield prisma.user.findUnique({
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
                name: user.name,
                age: user.age,
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
router.get("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate unique file key
        //@ts-ignore
        const fileKey = `uploads/${Date.now()}-${req.userId}.pdf`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: "kodjobs2",
            Key: fileKey,
            ContentType: "application/pdf",
        });
        try {
            const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, {
                expiresIn: 120,
            });
            res.json({
                uploadUrl: signedUrl,
                key: fileKey,
            });
        }
        catch (error) {
            console.error("S3 signing error:", error);
            res.status(500).json({
                message: "Failed to generate upload URL",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
