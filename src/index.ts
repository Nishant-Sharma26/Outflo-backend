import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import router from "./routes/messages";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all origins for testing
app.use(router);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;

