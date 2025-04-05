
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





if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
}
export default app;

