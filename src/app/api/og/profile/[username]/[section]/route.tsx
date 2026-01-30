// app/api/og/profile/[username]/[section]/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { fetchUserProfileByUsername } from "@/lib/data/fetch-user-profile";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string; section: string }> }
) {
  try {
    const { username, section } = await params;

    // Validate section
    if (section !== "selections" && section !== "gear-station") {
      return new Response("Invalid section", { status: 400 });
    }

    // Fetch profile data
    const profileData = await fetchUserProfileByUsername(username);

    if (!profileData?.profile) {
      return new Response("Profile not found", { status: 404 });
    }

    const { profile, selections, station_photos } = profileData;
    const displayName = profile.full_name || profile.username || "User";
    const sectionTitle =
      section === "selections" ? "My Selections" : "My Gear Station";

    // Get images for the section
    let images: string[] = [];
    if (section === "selections") {
      images = selections
        .slice(0, 4)
        .map((s) => s.image_url)
        .filter((url): url is string => url !== null && url !== "");
    } else {
      images = station_photos
        .slice(0, 4)
        .map((p) => p.image_url)
        .filter((url): url is string => url !== null && url !== "");
    }

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1a1612",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #1a1612 0%, #2a2520 50%, #1a1612 100%)",
          }}
        />

        {/* Image grid (if images available) */}
        {images.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.3,
            }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                style={{
                  width: "50%",
                  height: "50%",
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "grayscale(100%) brightness(0.5)",
                }}
              />
            ))}
          </div>
        )}

        {/* Content overlay */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            padding: "80px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Username */}
          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#d6c6a9",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {displayName}
          </div>

          {/* Section title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: "bold",
              color: "#f4eee2",
              marginBottom: 24,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            {sectionTitle}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 28,
              color: "#a89b8a",
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            {section === "selections"
              ? "Curated coffee recommendations"
              : "Coffee brewing setup"}
          </div>
        </div>

        {/* Branding in corner */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            fontSize: 20,
            color: "#a89b8a",
            opacity: 0.6,
          }}
        >
          indiancoffeebeans.com
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("OG image generation error:", e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
