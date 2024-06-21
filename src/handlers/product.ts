import { Request, Response } from "express";

import Product from "../models/Product.model";

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    order: [["price", "DESC"]],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  res.json({ data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(400).json({ error: "Product does not exist" });
  }

  res.json({ data: product });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Product does not exist" });
  }

  await product.update(req.body);
  await product.save();

  res.json({ data: product });
};

export const updateAvailavility = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: "Product does not exist" });
  }

  product.availability = !product.dataValues.availability;
  await product.save();

  console.log(product.dataValues.availability);

  res.json({ data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      error: "Product does not exist",
    });
  }

  await product.destroy();

  res.json({ data: "The product has been eliminated" });
};
