import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import morgan from "morgan";
// security

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// db
import connectDb from "./db/connectDb.js";

// routes import
import authRouter from "./routes/authRoute.js";
import jobsRouter from "./routes/jobsRoutes.js";

// middleware import
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(path.resolve(__dirname, "./client/build")));

// security

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());

app.use(morgan("tiny"));

// app.use("/api/v1", (req, res) => {
//   res.json({ msg: "hello" });
// });

// routes implementation
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// middleware implementation
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
