import express from "express";

// Routes
import { admin } from "./routes/admin";
import { analytics } from "./routes/analytics";
import { auth } from "./routes/auth";
import { form } from "./routes/forms";
import { reports } from "./routes/reports";
import { responses } from "./routes/responses";
import { users } from "./routes/users";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/v1/auth", auth);
app.use("/v1/users", users);
app.use("/v1/forms", form);
app.use("/v1/responses", responses);
app.use("/v1/reports", reports);
app.use("/v1/admin", admin);
app.use("/v1/analytics", analytics);



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
