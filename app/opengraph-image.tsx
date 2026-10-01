import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Powerhouse Numerology — Numerology, Reiki & Personal Guidance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo/powerhouse-logo-on-dark.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          background: "radial-gradient(ellipse at 70% 60%, #4a3a29 0%, #181714 65%)",
          color: "#f2ede3",
        }}
      >
        <img src={src} width={380} height={356} alt="" />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#dcc18b" }}>NUMEROLOGY · REIKI · GUIDANCE</div>
          <div style={{ fontSize: 68, lineHeight: 1.05, marginTop: 24 }}>Numbers Align. Lives Transform.</div>
        </div>
      </div>
    ),
    size,
  );
}
