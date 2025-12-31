// web/routes/storefronttimer.routes.js
import express from "express";
import { findActiveTimerForProduct } from "../services/timer.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("storefrontTimerRoutes hit:", req.query);
    if (req.query.embedded === "1") {
      return res.status(204).end();
    }

    const { shop, product_id: productId } = req.query;

    if (!shop || !productId) {
      return res.status(400).json({ error: "Missing shop or product_id" });
    }

    const timer = await findActiveTimerForProduct({ shop, productId });
    console.log('timer found', timer);

    if (!timer) {
      return res.json({ active: false });
    }

    res.json({
      active: true,
      id: timer._id,
      type: timer.type,
      name: timer.name,
      startAt: timer.startAt,
      endAt: timer.endAt,
      durationSeconds: timer.durationSeconds,
      targeting: timer.targeting,
    });
  } catch (err) {
    console.error("Error in storefrontTimerRoutes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;