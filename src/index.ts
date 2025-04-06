import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import messagesRouter from "./routes/messages";
import campaignsRouter from "./routes/campaigns";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/messages", messagesRouter);
app.use("/campaigns", campaignsRouter);


const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
    
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1); 
  }
};

startServer();