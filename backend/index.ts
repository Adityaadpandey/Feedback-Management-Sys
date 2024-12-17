import express from "express";
import CORS from 'cors'
import compression from "compression";
import dotenv from "dotenv";
dotenv.config();

// Routes
import { admin } from "./routes/admin";
import { analytics } from "./routes/analytics";
import { auth } from "./routes/auth";
import { form } from "./routes/forms";
import { reports } from "./routes/reports";
import { responses } from "./routes/responses";

// util for mongo
import {connectDB} from "./utils/db";

const app = express();
app.use(CORS())
app.use(compression());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/v1/auth", auth);
app.use("/v1/forms", form);
app.use("/v1/responses", responses);
app.use("/v1/reports", reports);
app.use("/v1/admin", admin);
app.use("/v1/analytics", analytics);



app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
