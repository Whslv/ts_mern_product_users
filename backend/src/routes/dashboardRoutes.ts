import express from "express";
import { protect, AuthRequest } from "../middleware/authentication";
import Product from "../models/Product";

const router = express.Router();

router.get("/", protect, async (req: AuthRequest, res) => {
  const userId = req.user!.id;

  const product = await Product.find({ product: userId });

  res.json({
    message: `Welcome to dashboard of user ${userId}`,
    product,
  });
});

export default router;
