import { NextResponse } from "next/server";
import { sendDeniedEmail } from "@/lib/email";

export async function POST(request) {
  try {
    // Parse request body
    const { reason } = await request.json();

    // Get client information
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "unknown";

    // Send denial email to admin
    const emailResult = await sendDeniedEmail(
      ip,
      userAgent,
      reason || "User rejected permissions",
    );

    // Prepare response
    const responseData = {
      success: true,
      message: "Denial recorded and email sent",
      data: {
        reason: reason || "User rejected permissions",
        ip,
        timestamp: new Date().toISOString(),
        emailId: emailResult.messageId || "sent",
      },
    };

    // Log denial (optional)
    console.log("🚫 Permission denied:", {
      ip,
      reason,
      userAgent: userAgent.substring(0, 100) + "...",
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("❌ Error in deny route:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to record denial",
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
    service: "Permission Deny API",
    description: "Records denial attempts and sends email alerts",
  });
}
