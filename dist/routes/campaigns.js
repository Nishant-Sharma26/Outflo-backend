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
const Campaign_1 = __importDefault(require("../models/Campaign"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaigns = yield Campaign_1.default.find({ status: { $ne: "DELETED" } });
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield Campaign_1.default.findById(req.params.id);
        if (!campaign || campaign.status === "DELETED") {
            res.status(404).json({ error: "Campaign not found" });
            return;
        }
        res.json(campaign);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = new Campaign_1.default(req.body);
        yield campaign.save();
        res.status(201).json(campaign);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield Campaign_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!campaign) {
            res.status(404).json({ error: "Campaign not found" });
            return;
        }
        res.json(campaign);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield Campaign_1.default.findByIdAndUpdate(req.params.id, { status: "DELETED" }, { new: true });
        if (!campaign) {
            res.status(404).json({ error: "Campaign not found" });
            return;
        }
        res.json({ message: "Campaign deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
