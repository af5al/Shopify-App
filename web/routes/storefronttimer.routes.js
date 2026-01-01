// web/routes/storefronttimer.routes.js
import express from "express";
import { getStorefrontTimer } from "../controllers/storefront.controller.js";

const router = express.Router();

router.get("/", getStorefrontTimer)

export default router;