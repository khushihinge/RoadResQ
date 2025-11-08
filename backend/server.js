import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import hazardRoutes from "./routes/hazardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import seedAdmin from "./config/seedAdmin.js"; // ✅ ADD THIS LINE

dotenv.config();

const startServer = async () => {
  await connectDB();          // ✅ First, connect to MongoDB
  await seedAdmin();          // ✅ Then, create the admin user if not exists

  const app = express();
  app.use(express.json());
  app.use(cors());

  // Routes
  app.use("/api/hazard", hazardRoutes);
  app.use("/api/admin", authRoutes);

  app.get("/", (req, res) => {
    res.send("Backend server is running properly 🚀");
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer(); // ✅ Run everything

