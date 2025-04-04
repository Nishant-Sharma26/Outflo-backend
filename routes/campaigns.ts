import express, { Request, Response } from "express";
import Campaign from "../models/Campaign";

const router = express.Router();

// GET /campaigns
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const campaigns = await Campaign.find({ status: { $ne: "DELETED" } });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /campaigns/:id
router.get("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign || campaign.status === "DELETED") {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /campaigns
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /campaigns/:id
router.put("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /campaigns/:id
router.delete("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: "DELETED" },
      { new: true }
    );

    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
