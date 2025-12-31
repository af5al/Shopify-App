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
router.get("/", list);
router.get(":id", getOne);
router.put("/:id", update);
router.delete("/:id", destroy);

export default router;