import { ImageResponse } from "next/og";
import { getStats } from "@/lib/db";
import { APP_COUNT } from "@/data/apps";

export const runtime = "nodejs";
export const revalidate = 300;
export const contentType = "image/png";

export async function GET() {
  let shipped30 = 0;
  let shippedTotal = 0;
  try {
    const stats = await getStats();
    shipped30 = stats.shippedLast30;
    shippedTotal = stats.shipped;
  } catch {
    // ignore
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #030712 0%, #0b1220 60%, #064e3b 100%)",
          color: "#f9fafb",
          padding: 64,
          fontFamily: "Inter, system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: "#34d399",
              boxShadow: "0 0 24px #34d399",
            }}
          />
          <div style={{ fontSize: 28, color: "#9ca3af" }}>pipeline.dashboard</div>
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, marginTop: 32, lineHeight: 1.05 }}>
          The portfolio
          <br />
          IS the product.
        </div>
        <div style={{ display: "flex", gap: 56, marginTop: 56 }}>
          <Stat label="Apps shipped" value={String(APP_COUNT)} />
          <Stat label="Pipeline runs (30d)" value={String(shipped30)} />
          <Stat label="Total runs" value={String(shippedTotal)} />
        </div>
        <div style={{ marginTop: "auto", fontSize: 26, color: "#9ca3af" }}>
          Autonomous overnight build pipeline. Real apps. Real receipts.
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 96, fontWeight: 800, color: "#34d399", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 24, color: "#9ca3af", marginTop: 8 }}>{label}</div>
    </div>
  );
}
