import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.error(err));
