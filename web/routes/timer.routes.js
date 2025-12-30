import express from "express";

import {
  create,
  list,
  getOne,
  update,
  destroy,
  getStorefrontTimer,
} from "../controllers/timer.controller.js";

const router = express.Router();

router.post("/", create);
router.get("/", list);
router.get(":id", getOne);
router.put("/:id", update);
router.delete("/:id", destroy);

// Storefront API (via App Proxy)
router.get("/storefront/active", getStorefrontTimer);

export default router;