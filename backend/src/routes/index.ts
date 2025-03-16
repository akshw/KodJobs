import express from "express";
import user from "./user";
import jobs from "./jobs";
const router = express.Router();

router.use("/user", user);
router.use("/dashboard", jobs);

export default router;
