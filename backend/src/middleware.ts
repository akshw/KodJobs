import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.header.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      msg: "authorization failed",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "authorization failed",
    });
  }
}

export default authMiddleware;
