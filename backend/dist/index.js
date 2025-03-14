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
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const port = config_1.PORT;
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const jobId = [];
app.get("/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("healthy-check");
}));
const SignupBody = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    })
        .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
    })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    name: zod_1.z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50),
    dob: zod_1.z.coerce.date().refine((date) => {
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 13;
    }, { message: "You must be at least 13 years old" }),
});
const SigninBody = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z.string().min(1, { message: "Password is required" }),
});
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = SignupBody.safeParse(req.body);
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
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = SigninBody.safeParse(req.body);
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
app.listen(config_1.PORT, () => {
    console.log(`Server is running on port ${config_1.PORT}`);
});
app.get("/jobs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobid_res = yield axios_1.default.get("https://hacker-news.firebaseio.com/v0/jobstories.json", { timeout: 5000 });
        const ids = jobid_res.data;
        jobId.push(...ids);
        console.log(jobId);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch ids" });
    }
    try {
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
        console.log(results);
        const jobDetails = results.filter((job) => {
            return job !== null;
        });
        res.json(jobDetails);
    }
    catch (error) {
        console.error("Failed to fetch jobs:", error.message);
        res.status(500).json({
            error: "Failed to fetch the job descprition",
        });
    }
}));
