"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
router.post("/personalized-message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const prompt = `Generate a personalized outreach message for ${name}, a ${job_title} at ${company} in ${location}. Summary: ${summary}. Keep it short and simple and i am hiring manager work at outflo.`;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = yield model.generateContent(prompt);
        if (!((_a = result === null || result === void 0 ? void 0 : result.response) === null || _a === void 0 ? void 0 : _a.text)) {
            throw new Error("Gemini API returned no valid response.");
        }
        const message = result.response.text().trim();
        res.json({ name, job_title, company, location, summary, message });
    }
    catch (error) {
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
}));
exports.default = router;
