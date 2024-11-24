import express from "express";
import {auth} from "./routes/auth";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/v1/auth",auth)
app.use("/v1/users")
app.use("/v1/forms")
app.use("/v1/responses")
app.use("/v1/reports")
app.use("/v1/admin")
app.use("/v1/analytics")


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
