import express from "express";
import user from "./user";
import jobs from "./jobs";
import hire from "./hire";
const router = express.Router();

router.use("/user", user);
router.use("/dashboard", jobs);
router.use("/hire", hire);

export default router;
