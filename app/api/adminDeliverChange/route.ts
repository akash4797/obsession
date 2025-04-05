import { createClient } from "contentful-management";
import { NextResponse } from "next/server";

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, adminDeliver } = body;

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    // Get the existing entry
    const entry = await environment.getEntry(orderId);

    // Update the adminDeliver field
    entry.fields.adminDeliver = {
      "en-US": adminDeliver,
    };

    // Update and publish the entry
    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
