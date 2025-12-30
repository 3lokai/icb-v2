import { NextResponse } from "next/server";

/**
 * POST /api/analytics/event
 * Receives analytics events from client-side tracking
 * No storage needed - GA4 handles all event storage client-side
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request structure
    if (!body.event || typeof body.event !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'event' field" },
        { status: 400 }
      );
    }

    if (!body.properties || typeof body.properties !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid 'properties' field" },
        { status: 400 }
      );
    }

    // Log in development mode
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics Event]", {
        event: body.event,
        properties: body.properties,
        timestamp: body.timestamp || Date.now(),
      });
    }

    // In production, you could add additional validation here
    // For now, just acknowledge receipt
    // GA4 handles all storage client-side, so no DB needed

    return NextResponse.json(
      {
        success: true,
        received: true,
        event: body.event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API /analytics/event] Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process analytics event",
      },
      { status: 500 }
    );
  }
}
