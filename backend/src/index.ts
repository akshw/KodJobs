import express, { response } from "express";
import cors from "cors";
import { PORT } from "./config";
import rootrouter from "./routes/index";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", rootrouter);

app.get("/", (req, res) => {
  res.send("Home");
});
app.get("/health", async (req, res) => {
  console.log("healthy");
  res.send("healthy");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
