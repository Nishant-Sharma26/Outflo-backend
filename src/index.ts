import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import messagesRouter from "./routes/messages";
import campaignsRouter from "./routes/campaigns";


dotenv.config();


const app = express();


app.use(express.json());
app.use(cors({ 
  origin: process.env.ALLOWED_ORIGINS || "*" 
}));


app.use("/messages", messagesRouter);
app.use("/campaigns", campaignsRouter);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
     
      console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});


process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();