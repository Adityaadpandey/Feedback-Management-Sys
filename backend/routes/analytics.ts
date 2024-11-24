import { Router } from "express";

const router = Router();

// GET all forms
router.get("/", (req, res) => {
  res.send("analytics");
});

export const analytics = router;