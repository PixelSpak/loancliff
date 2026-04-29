import { ImageResponse } from "next/og";
import { computeGap } from "@/lib/calc";
import { caps, programs, schools } from "@/lib/data";
import { ShareCard } from "@/lib/share-card";
import type { ProgramType } from "@/lib/types";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ school: string; program: string }>;
}

export default async function OGImage({ params }: Props) {
  const { school, program } = await params;

  const result = computeGap(
    { schoolId: school, programType: program as ProgramType, startYear: 2026 },
    schools,
    programs,
    caps
  );

  if (result.kind !== "ok") {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "1200px",
          height: "630px",
          background: "#0d0d0d",
          fontFamily: "sans-serif",
          fontSize: "40px",
          color: "#fff",
        }}
      >
        Loan Cliff
      </div>,
      { width: 1200, height: 630 }
    );
  }

  return new ImageResponse(<ShareCard result={result} />, { width: 1200, height: 630 });
}
