import express from "express";

import {
  create,
  list,
  getOne,
  update,
  destroy,
} from "../controllers/timer.controller.js";

const router = express.Router();

router.post("/", create);
router.get("/", getOne);
router.get("/", list);
router.put("/", update);
router.delete("/", destroy);

export default router;