import express from "express";
import { protect } from "../middleware/authentication";
import {
  createProduct,
  deleteProduct,
  getListOfProducts,
  getProduct,
  updateProduct,
} from "../controllers/productControllers";

const router = express.Router();

router.use(protect);

router.get("/", getListOfProducts);
router.post("/", createProduct);

router.get("/:id", getProduct);
router.patch("/:id", updateProduct);
router.delete('/:id', deleteProduct);

export default router;
