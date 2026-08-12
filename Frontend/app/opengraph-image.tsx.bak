import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const alt = "Fatoki Victor Oluwabusayo || Product Designer & Business Strategist";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  // Read font files from the local filesystem
  const outfitBold = fs.readFileSync(
    path.join(process.cwd(), "public", "assets", "fonts", "Outfit-Bold.woff")
  );
  
  const interMedium = fs.readFileSync(
    path.join(process.cwd(), "public", "assets", "fonts", "Inter-Medium.woff")
  );

  // Read local profile picture
  let heroImageBase64 = "";
  try {
    const imagePath = path.join(process.cwd(), "public", "assets", "hero-image.png");
    const imageBuffer = fs.readFileSync(imagePath);
    heroImageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error reading hero image:", error);
  }

  // Read local logo
  let logoBase64 = "";
  try {
    const logoPath = path.join(process.cwd(), "public", "assets", "fatoki-logo.png");
    const logoBuffer = fs.readFileSync(logoPath);
    logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error reading logo:", error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#f1f1f1",
          padding: "60px 80px",
          fontFamily: "Inter, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Accent */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,200,200,0.15) 0%, rgba(241,241,241,0) 70%)",
            zIndex: 1,
          }}
        />

        {/* Header Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            zIndex: 2,
          }}
        >
          {logoBase64 ? (
            <img
              src={logoBase64}
              alt="Logo"
              style={{
                height: "36px",
                marginRight: "12px",
              }}
            />
          ) : (
            <div
              style={{
                fontFamily: "Outfit",
                fontSize: "24px",
                fontWeight: 700,
                color: "#303030",
              }}
            >
              V.O FATOKI
            </div>
          )}
          <div
            style={{
              marginLeft: "auto",
              padding: "6px 16px",
              borderRadius: "20px",
              border: "1.5px solid #d4d4d4",
              backgroundColor: "rgba(255,255,255,0.6)",
              color: "#525252",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            PORTFOLIO
          </div>
        </div>

        {/* Content Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "20px",
            zIndex: 2,
          }}
        >
          {/* Main Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "60%",
            }}
          >
            <h1
              style={{
                fontFamily: "Outfit",
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#525252",
                margin: "0 0 16px 0",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Hi, I'm Fatoki Victor.</span>
              <span style={{ color: "#303030" }}>Product Designer</span>
            </h1>
            <p
              style={{
                fontSize: "20px",
                lineHeight: 1.4,
                color: "#707070",
                margin: "0 0 24px 0",
              }}
            >
              I specialize in predicting what your users want before they do and designing it beautifully. So your product doesn't just look good, it sells better.
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.3,
                color: "#8e8e8e",
                margin: 0,
              }}
            >
              <span style={{ color: "#525252", fontWeight: 700 }}>Product Designer &amp; Business Strategist</span> by day,{" "}
              <span style={{ color: "#525252", fontWeight: 700 }}>Gamer &amp; Arsenal fan</span> by Night
            </p>
          </div>

          {/* Picture Box */}
          {heroImageBase64 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px",
                border: "1px solid #e0e0e0",
                borderRadius: "28px",
                transform: "rotate(-3deg)",
                backgroundColor: "#ffffff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              }}
            >
              <img
                src={heroImageBase64}
                alt="Profile Image"
                style={{
                  width: "190px",
                  height: "190px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div
          style={{
            fontSize: "15px",
            color: "#a3a3a3",
            fontWeight: 500,
            zIndex: 2,
          }}
        >
          vofatoki.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Outfit",
          data: outfitBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Inter",
          data: interMedium,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
