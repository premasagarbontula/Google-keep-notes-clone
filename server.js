import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import mongoDb from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import notesRoute from "./routes/notesRoute.js";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/note", notesRoute);
app.use(morgan("dev"));
dotenv.config();

mongoDb();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Connected on Port ${PORT}`.bgMagenta.white);
});
