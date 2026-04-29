import type { CalcSuccess } from "./types";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

interface ShareCardProps {
  result: CalcSuccess;
}

// Satori-compatible JSX — inline styles only, no Tailwind classes.
export function ShareCard({ result }: ShareCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "1200px",
        height: "630px",
        background: "#0d0d0d",
        padding: "60px 72px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Top: branding */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "24px", fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
          Loan Cliff
        </span>
        <span style={{ fontSize: "16px", color: "#666", marginTop: "2px" }}>
          · loancliff.com
        </span>
      </div>

      {/* Middle: gap number */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "22px", color: "#aaa", fontWeight: 500 }}>
          {result.schoolName} · {result.programLabel}
        </div>
        <div
          style={{
            fontSize: "108px",
            fontWeight: 800,
            color: "#ef4444",
            lineHeight: 1,
            letterSpacing: "-3px",
          }}
        >
          {fmt(result.totalGap)}
        </div>
        <div style={{ fontSize: "22px", color: "#888", fontWeight: 400 }}>
          funding gap over {result.lengthYears} years · {fmt(result.gapPerYear)}/yr uncovered
        </div>
      </div>

      {/* Bottom: citation + CTA */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: "15px", color: "#555" }}>
          COA {fmt(result.coaPerYear)}/yr − new federal cap {fmt(result.capPerYear)}/yr
        </div>
        <div
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: "#fff",
            background: "#ef4444",
            padding: "10px 20px",
            borderRadius: "8px",
          }}
        >
          Calculate yours →
        </div>
      </div>
    </div>
  );
}
