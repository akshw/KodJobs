import express, { response } from "express";
import cors from "cors";
import { PORT } from "./config";
import rootrouter from "./routes/index";

const app = express();
app.use(express.json());
app.use(cors());

app.use("api", rootrouter);

app.get("/health", async (req, res) => {
  res.send("healthy-check");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
