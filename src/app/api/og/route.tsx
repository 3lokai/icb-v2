// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get title from query params or use default
    const title = searchParams.get("title") ?? "Indian Coffee Beans";
    const type = searchParams.get("type") ?? "website";
    const imageUrl = searchParams.get("image") ?? null;

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4eee2",
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : "linear-gradient(to bottom right, #f4eee2, #e8dfca)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "40px",
            borderRadius: "16px",
            maxWidth: "80%",
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: "bold",
              color: "#f4eee2",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#d6c6a9",
              textAlign: "center",
            }}
          >
            {type === "product"
              ? "Premium Indian Coffee Bean"
              : type === "coffee"
                ? "Premium Indian Coffee Bean"
                : type === "roaster"
                  ? "Specialty Indian Coffee Roaster"
                  : type === "article"
                    ? "Coffee Education Article"
                    : "Discover the rich world of Indian coffee."}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
