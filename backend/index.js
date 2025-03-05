import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";
import authRouters from "./routes/auth.route.js";
import { connectDB } from "./db/connectDB.js";

import fs from "fs";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = JSON.parse(
  fs.readFileSync("./backend/doc/swagger-output.json", "utf8")
);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routers
app.use("/api/auth", authRouters);

// documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
