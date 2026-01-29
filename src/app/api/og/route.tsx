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

    // Default to logo-icon.svg if no image provided
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
    const defaultLogoUrl = `${baseUrl}/logo-icon.svg`;
    const finalImageUrl = imageUrl || defaultLogoUrl;
    const isLogoImage = finalImageUrl.includes("logo-icon.svg");

    // Fetch logo SVG if it's the default logo
    let logoSrc: string | null = null;
    if (isLogoImage) {
      try {
        const logoResponse = await fetch(finalImageUrl);
        if (logoResponse.ok) {
          const logoText = await logoResponse.text();
          // Encode SVG as base64 for use in img src
          // In edge runtime, we use btoa for base64 encoding
          const logoBase64 = btoa(logoText);
          logoSrc = `data:image/svg+xml;base64,${logoBase64}`;
        }
      } catch (e) {
        // Fallback to gradient if logo fetch fails
        console.error("Failed to fetch logo:", e);
      }
    }

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
          backgroundImage:
            !isLogoImage && finalImageUrl.startsWith("http")
              ? `url(${finalImageUrl})`
              : "linear-gradient(to bottom right, #f4eee2, #e8dfca)",
          backgroundSize:
            !isLogoImage && finalImageUrl.startsWith("http")
              ? "contain"
              : "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Logo overlay in top-right corner when using logo */}
        {logoSrc ? (
          <div
            style={{
              position: "absolute",
              top: 40,
              right: 40,
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Logo"
              width={120}
              height={120}
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        ) : null}
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
