import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import cors from "cors";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import chatRoutes from "./routes/chat.route.js"
import path from "path";

const app = express();
const port = process.env.PORT;

const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true //frontend will be able to send cookies--
})
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // Serve static files
  app.use(express.static(frontendPath));

  // Fallback to index.html for SPA routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
});
