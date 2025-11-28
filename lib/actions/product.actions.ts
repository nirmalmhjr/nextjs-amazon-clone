"use server";

import { connectToDatabase } from "..";
import Product, { IProduct } from "@/db/models/product.model";
import { PAGE_SIZE } from "../constants";
import { Types } from "mongoose";

export async function getAllCategories() {
  await connectToDatabase();
  const categories = await Product.find({ isPublished: true }).distinct(
    "category"
  );
  return categories;
}

export async function getProductForCard({
  tag,
  limit = 4,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDatabase();
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      href: { $concat: ["/product", "$slug"] },
      image: { $arrayElemAt: ["$images", 0] },
    }
  )
    .sort({ createdAt: "desc" })
    .limit(limit);

  return JSON.parse(JSON.stringify(products)) as {
    name: string;
    href: string;
    image: string;
  }[];
}

export async function getProductByTag({
  tag,
  limit = 10,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDatabase();

  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: "desc" })
    .limit(limit);

  return JSON.parse(JSON.stringify(products)) as IProduct[];
}

//get product by slug
export async function getProductBySlug(slug: string) {
  await connectToDatabase();

  const product = await Product.findOne({ slug, isPublished: true });

  if (!product) throw new Error("Product not found");

  return JSON.parse(JSON.stringify(product)) as IProduct;
}

// GET RELATED PRODUCTS: get product by same category
export async function getRelatedProductByCategory({
  category,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string;
  // productId: string;
  productId: Types.ObjectId;
  limit?: number;
  page: number;
}) {
  await connectToDatabase();
  const skipAmount = (Number(page) - 1) * limit;
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  };

  const products = await Product.find(conditions)
    .sort({ numSales: "desc" })
    .skip(skipAmount)
    .limit(limit);

  const productCount = await Product.countDocuments(conditions);

  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: productCount,
  };
}
