import client from "@/lib/contentful";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const entries = await client.getEntries({
      content_type: "order",
      limit: 1000,
      order: ["-sys.createdAt"],
    });

    const orders = entries.items.map((item) => ({
      fields: item.fields,
      sys: {
        id: item.sys.id,
      },
      contentTypeId: item.sys.contentType.sys.id,
    }));

    console.log(entries.items[0].sys);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
