import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/database.js";
import restaurantRoutes from "./src/routes/restaurantRoutes.js";
import reservationRoutes from "./src/routes/reservationRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
