import { NextResponse } from "next/server";
import { sendLocationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    // Parse request body
    const { latitude, longitude, accuracy } = await request.json();

    // Get client information
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "unknown";

    // Validate required data
    if (!latitude || !longitude) {
      return NextResponse.json(
        { success: false, error: "Location data is required" },
        { status: 400 },
      );
    }

    // Send email notification to admin
    const emailResult = await sendLocationEmail({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      accuracy: accuracy ? parseFloat(accuracy) : 50,
      ip,
      userAgent,
    });

    // Prepare response data
    const responseData = {
      success: true,
      message: "Location successfully captured and email sent",
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        accuracy: accuracy ? parseFloat(accuracy) : 50,
        ip,
        timestamp: new Date().toISOString(),
        emailId: emailResult.messageId || "sent",
      },
    };

    // Log success (optional)
    console.log("✅ Location captured:", {
      latitude,
      longitude,
      ip,
      userAgent: userAgent.substring(0, 100) + "...",
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("❌ Error in allow route:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process location",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}

// Optional: Add GET method for checking API status
export async function GET() {
  return NextResponse.json({
    status: "active",
    service: "Permission Allow API",
    description: "Accepts location data and sends email notification",
    requires: ["latitude", "longitude"],
  });
}
