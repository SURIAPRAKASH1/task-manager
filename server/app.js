import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import "express-async-errors";
import webpush from "web-push";

import connectdb from "./db/connectdb.js";
import authRouter from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/user.js";
import messageRoutes from "./routes/corn.js";

// Error handling Middlware

import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
import tokenVerify from "./middleware/auth.js";

dotenv.config();

webpush.setVapidDetails(
  "mailto:example@gamil.com",
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Routes
app.use("/auth", authRouter);
app.use("/user", tokenVerify, userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", messageRoutes);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectdb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
