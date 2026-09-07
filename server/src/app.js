import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import predictionRoutes from "./routes/prediction.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);

export { app };