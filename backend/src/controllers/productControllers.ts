import { FilterQuery } from "mongoose";
import { Response } from "express";
import { AuthRequest } from "../middleware/authentication";
import { IProduct } from "../types/product";
import Product from "../models/Product";
import { productDto } from "../validators/product.dto";

type ListQuery = {
  page? : string;
  limit?: string;
  query?: string;
}

// GET /api/products
export async function getListOfProducts(req: AuthRequest, res: Response) {
  const { page = "1", limit = "20", query } = req.query as ListQuery;
  const owner = req.user!.id;
  const filter: FilterQuery<IProduct> = { user: owner };

  if (query) filter.title = { $regex: String(query), $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean({ virtuals: true }),

    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), limit: Number(limit) });
}

// POST /api/products
export async function createProduct(req: AuthRequest, res: Response) {
  const owner = req.user!.id;
  const payload = productDto.parse(req.body)
  const product = await Product.create({ ...payload, user: owner });
  res.status(201).json(product.toJSON({ virtuals: true }));
}

//GET /api/products/:id
export async function getProduct(req: AuthRequest, res: Response) {
  const owner = req.user!.id;
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, user: owner });
  if (!product) return res.status(404).json({ message: "Not found" });

  res.json(product.toJSON({ virtuals: true }));
}

//PATCH /api/products/:id
export async function updateProduct(req: AuthRequest, res: Response) {
  const owner = req.user!.id;
  const { id } = req.params;

  const updated = await Product.findOneAndUpdate({ _id: id, user: owner }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated.toJSON({ virtuals: true }));
}

//DELETE /api/products/:id
export async function deleteProduct(req: AuthRequest, res: Response) {
  const owner = req.user!.id;
  const { id } = req.params;

  const deleted = await Product.findOneAndDelete({ _id: id, user: owner });
  if (!deleted) return res.status(404).json({ message: "Not found" });

  res.status(204).send();
}
