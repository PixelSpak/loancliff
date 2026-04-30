import { NextResponse } from "next/server";

const index = {
  "$schema": "https://agentskills.io/schemas/agent-skills-index-v0.2.json",
  skills: [
    {
      name: "loan-cliff-calculator",
      type: "documentation",
      description:
        "Understand Loan Cliff's graduate funding gap calculator, methodology, sitemap, and public discovery endpoints.",
      url: "https://loancliff.com/.well-known/agent-skills/loan-cliff-calculator/SKILL.md",
      sha256: "0c0a5861a915fb3aee44e0d70adca06be5071b033673313a2a7bbffbfc436057",
    },
  ],
};

export function GET() {
  return NextResponse.json(index);
}
