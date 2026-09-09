import { ImageResponse } from "next/og";

/** iOS home-screen icon — the header logo mark, drawn at touch-icon size. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f45a16",
          color: "#ffffff",
          display: "flex",
          fontSize: 84,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          letterSpacing: -3,
          width: "100%"
        }}
      >
        go
      </div>
    ),
    size
  );
}
