import { NextResponse } from "next/server";
import client from "@/lib/contentful";
import { Product } from "@/lib/Skeleton";

export async function GET() {
  try {
    const productEntries = await client.getEntries<Product>({
      content_type: "product",
      limit: 300,
    });

    const formattedProducts = productEntries.items.map((item) => ({
      sys: item.sys,
      fields: {
        name: item.fields.name,
        type: item.fields.type,
        price10ml: item.fields.price10ml,
        price30ml: item.fields.price30ml,
        price120ml: item.fields.price120ml,
        gender: item.fields.gender,
        classification: item.fields.classification,
        topNote: item.fields.topNote,
        strength: item.fields.strength,
      },
      contentTypeId: item.sys.contentType.sys.id,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
