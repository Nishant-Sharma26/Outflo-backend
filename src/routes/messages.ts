import express, { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const PROXYCURL_API_KEY = process.env.PROXYCURL_API_KEY || "";
const PROXYCURL_API_URL = "https://nubela.co/proxycurl/api/v2/linkedin";

async function fetchLinkedInProfile(linkedinUrl: string) {
  if (!PROXYCURL_API_KEY) {
    throw new Error("PROXYCURL_API_KEY is not set in .env file.");
  }

  try {
    const response = await axios.get(PROXYCURL_API_URL, {
      headers: { Authorization: `Bearer ${PROXYCURL_API_KEY}` },
      params: { url: linkedinUrl },
    });
    
    const data = response.data;
    return {
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      job_title: data.occupation || "",
      company: data.experiences?.[0]?.company || "",
      location: data.city || data.country || "",
      summary: data.summary || "",
    };
  } catch (error) {
    throw new Error("Failed to fetch profile data from Proxycurl: " + (error instanceof Error ? error.message : String(error)));
  }
}

router.post("/personalized-message", async (req: Request, res: Response): Promise<void> => {
  const { linkedin_url, name, job_title, company, location, summary } = req.body;

  let profileData: {
    name: string;
    job_title: string;
    company: string;
    location: string;
    summary: string;
  };

 
  if (name && job_title && company) {
    profileData = {
      name: name || "",
      job_title: job_title || "",
      company: company || "",
      location: location || "",
      summary: summary || "",
    };
  } 

  else if (linkedin_url) {
    if (!linkedin_url.includes("linkedin.com/in/")) {
      res.status(400).json({
        error: "Invalid LinkedIn URL",
        details: "Please provide a valid LinkedIn profile URL (e.g., https://linkedin.com/in/johndoe).",
      });
      return;
    }

    try {
      profileData = await fetchLinkedInProfile(linkedin_url);
    } catch (error) {
      res.status(400).json({
        error: "Profile fetch failed",
        details: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  } 
  else {
    res.status(400).json({
      error: "Insufficient data",
      details: "Please provide either a LinkedIn URL or manual profile data (name, job_title, company)",
    });
    return;
  }

  const missingFields = Object.entries({
    name: profileData.name,
    job_title: profileData.job_title,
    company: profileData.company
  })
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    res.status(400).json({
      error: "Missing required fields",
      details: `Missing: ${missingFields.join(", ")}. Please provide all required fields.`,
    });
    return;
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in .env file.");
    }

    const prompt = `Generate a personalized outreach message for ${profileData.name}, a ${profileData.job_title} at company name ${profileData.company} and his location is ${profileData.location} the summary is ${profileData.summary}. Keep it short and simple if any field is missed manage it and I am Nishant sharma and passout from iiit dharwad and a job seeker.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);

    if (!result?.response?.text) {
      throw new Error("Gemini API returned no valid response.");
    }

    const message = result.response.text().trim();

    res.json({
      name: profileData.name,
      job_title: profileData.job_title,
      company: profileData.company,
      location: profileData.location,
      summary: profileData.summary,
      message
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    let errorType = "Failed to generate message";
    if (errorMessage.includes("Proxycurl")) {
      errorType = "Profile data retrieval failed";
    } else if (errorMessage.includes("Gemini")) {
      errorType = "Message generation failed";
    }

    res.status(500).json({
      error: errorType,
      details: errorMessage,
    });
  }
});

export default router;