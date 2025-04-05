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


export default async (req: any, res: any) => {

  await connectDB().catch(console.error);
 
  app(req, res);
};