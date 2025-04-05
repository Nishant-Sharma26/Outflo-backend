import express, { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post("/personalized-message", async (req: Request, res: Response): Promise<void> => {
  let { name, job_title, company, location, summary } = req.body;

  try {
    const missingFields = Object.entries({ name, job_title, company, location, summary })
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      res.status(400).json({
        error: "Missing required fields",
        details: `Missing: ${missingFields.join(", ")}. Please provide all required fields.`,
      });
      return;
    }

   
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in .env file.");
    }

   
    const prompt = `Generate a personalized outreach message for ${name}, a ${job_title} at ${company} in ${location}. Summary: ${summary}. Keep it short and simple and i am Tushar Singhal founder of outflo.`;

    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);

    if (!result?.response?.text) {
      throw new Error("Gemini API returned no valid response.");
    }

    const message = result.response.text().trim();
   

    res.json({ name, job_title, company, location, summary, message });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    

    let errorType = "Failed to generate message";
    if (errorMessage.includes("Gemini")) {
      errorType = "Message generation failed";
    }

    res.status(500).json({
      error: errorType,
      details: errorMessage,
    });
  }
});

export default router;
