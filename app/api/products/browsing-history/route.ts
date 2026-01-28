import Product from "@/lib/db/models/product.model";
import { connectToDatabase } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const listType = request.nextUrl.searchParams.get("type") || "history";
  const productParams = request.nextUrl.searchParams.get("ids");
  const categoriesParams = request.nextUrl.searchParams.get("categories");

  if (!productParams || !categoriesParams) {
    return NextResponse.json([]);
  }

  const productIds = productParams.split(",");
  const categories = categoriesParams.split(",");

  const filter =
    listType === "history"
      ? { _id: { $in: productIds } }
      : { category: { $in: categories }, _id: { $nin: productIds } };

  await connectToDatabase();
  const products = await Product.find(filter);

  if (listType == "history") {
    return NextResponse.json(
      products.sort(
        (a, b) =>
          productIds.indexOf(a._id.toString()) -
          productIds.indexOf(b._id.toString()),
      ),
    );
  }

  return NextResponse.json(products);
};
