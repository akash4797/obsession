import { createClient } from "contentful-management";
import { NextResponse } from "next/server";

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerText, adminText, adminDeliver } = body;

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    const entry = await environment.createEntry("order", {
      fields: {
        customerName: {
          "en-US": customerName,
        },
        customerText: {
          "en-US": customerText,
        },
        adminText: {
          "en-US": adminText,
        },
        adminDeliver: {
          "en-US": adminDeliver,
        },
      },
    });

    await entry.publish();

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
