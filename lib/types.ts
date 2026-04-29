export type ProgramCategory = "graduate" | "professional";

export type ProgramType =
  | "mba"
  | "md"
  | "do"
  | "jd"
  | "dds"
  | "pharmd"
  | "dvm"
  | "od"
  | "phd"
  | "ms"
  | "ma"
  | "med";

export interface Program {
  category: ProgramCategory;
  defaultLengthYears: number;
  label: string;
  shortLabel: string;
}

export type ProgramsData = Record<ProgramType, Program>;

export interface SchoolProgram {
  coaPerYear: number;
  lengthYears?: number;
}

export interface School {
  id: string;
  name: string;
  shortName?: string;
  state: string;
  programs: Partial<Record<ProgramType, SchoolProgram>>;
}

export type SchoolsData = Record<string, School>;

export interface CapTier {
  annual: number;
  aggregate: number;
}

export interface CapsData {
  effective_date: string;
  statute: string;
  source_note?: string;
  caps: Record<ProgramCategory, CapTier>;
  total_federal_aggregate: number;
  old_grad_plus: {
    interest_rate_2025_2026: number;
    loan_fee: number;
    annual_limit: string;
  };
}

export interface CalcInput {
  schoolId: string;
  programType: ProgramType;
  startYear: number;
}

export interface CalcSuccess {
  kind: "ok";
  schoolName: string;
  schoolShortName: string;
  schoolState: string;
  programLabel: string;
  programShortLabel: string;
  category: ProgramCategory;
  coaPerYear: number;
  capPerYear: number;
  gapPerYear: number;
  lengthYears: number;
  totalCoa: number;
  totalCap: number;
  totalGap: number;
  monthlyEquivalent: number;
  citation: { ipedsYear: number; statute: string };
}

export interface MissingSchoolResult {
  kind: "missing_school";
  schoolId: string;
}

export interface MissingProgramResult {
  kind: "missing_program";
  schoolName: string;
  programType: ProgramType;
}

export type CalcOutput = CalcSuccess | MissingSchoolResult | MissingProgramResult;
