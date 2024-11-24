import { Router } from "express";

const router = Router();

// GET all forms
router.get("/", (req, res) => {
  res.send("form");
});

export const form = router;