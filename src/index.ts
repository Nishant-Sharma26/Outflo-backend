import express from "express";
import connectDB from "./db";
import campaignRoutes from "./routes/campaigns";
import messageRoutes from "./routes/messages";
import cors from "cors"; // Import CORS

const app = express();
app.use(express.json());

// Enable CORS for frontend running on port 3001
app.use(cors({
  origin: "http://localhost:3001", // Allow requests from frontend
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
}));

connectDB();

app.use("/campaigns", campaignRoutes);
app.use("/", messageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

