import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import contactRoutes from "./routes/contact.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// Error Middleware
app.use(errorMiddleware);

export default app;
