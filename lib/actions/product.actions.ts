"use server";

import { connectToDatabase } from "..";
import Product, { IProduct } from "@/lib/db/models/product.model";
import { PAGE_SIZE } from "../constants";
import { Types } from "mongoose";

export async function getAllCategories() {
  await connectToDatabase();
  const categories = await Product.find({ isPublished: true }).distinct(
    "category",
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
      href: { $concat: ["/product/", "$slug"] },
      image: { $arrayElemAt: ["$images", 0] },
    },
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

export async function getAllProducts({
  query,
  limit,
  page,
  category,
  tag,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category: string;
  tag: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  limit = limit || PAGE_SIZE;
  await connectToDatabase();

  const isPublished = { isPublished: true };
  const queryFilter =
    query && query !== "all"
      ? {
          name: {
            $regex: query,
            $options: "i",
          },
        }
      : {};

  const tagFilter = tag && tag !== "all" ? { tags: tag } : {};
  const categoryFilter = category && category !== "all" ? { category } : {};
  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const ratingFilter =
    rating && rating !== "all"
      ? {
          avgRating: {
            $gte: Number(rating),
          },
        }
      : {};

  const order: Record<string, 1 | -1> =
    sort === "best-selling"
      ? { numSales: -1 }
      : sort === "price-low-to-high"
        ? { price: 1 }
        : sort === "price-high-to-low"
          ? { price: -1 }
          : sort === "avg-customer-review"
            ? { avgRating: -1 }
            : { _id: -1 };

   const products = await Product.find({
     ...isPublished,
     ...queryFilter,
     ...tagFilter,
     ...categoryFilter,
     ...priceFilter,
     ...ratingFilter,
   })
     .sort(order)
     .skip(limit * (Number(page) - 1))
     .limit(limit)
     .lean();

  console.log("products are ", products);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });

  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + products.length,
  };
}

export async function getAllTags() {
  const tags = await Product.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: null, uniqueTags: { $addToSet: "$tags" } } },
    { $project: { _id: 0, uniqueTags: 1 } },
  ]);
  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      ) as string[]) || []
  );
}
