"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigninBody = exports.SignupBody = void 0;
const zod_1 = require("zod");
exports.SignupBody = zod_1.z.object({
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
    dob: zod_1.z.coerce.date().refine((dateString) => {
        const date = new Date(dateString);
        const age = new Date().getFullYear() - date.getFullYear();
        return !isNaN(date.getTime()) && age >= 18;
    }, { message: "Invalid date or you must be at least 18 years old" }),
});
exports.SigninBody = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z.string().min(1, { message: "Password is required" }),
});
