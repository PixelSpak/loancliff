import type {
  CalcInput,
  CalcOutput,
  CapsData,
  ProgramsData,
  SchoolsData,
} from "./types";

export function computeGap(
  input: CalcInput,
  schools: SchoolsData,
  programs: ProgramsData,
  caps: CapsData
): CalcOutput {
  const school = schools[input.schoolId];
  if (!school) {
    return { kind: "missing_school", schoolId: input.schoolId };
  }

  const schoolProgram = school.programs[input.programType];
  if (!schoolProgram) {
    return {
      kind: "missing_program",
      schoolName: school.name,
      programType: input.programType,
    };
  }

  const program = programs[input.programType];
  const lengthYears = schoolProgram.lengthYears ?? program.defaultLengthYears;
  const coaPerYear = schoolProgram.coaPerYear;
  const capPerYear = caps.caps[program.category].annual;
  const aggregateCap = caps.caps[program.category].aggregate;

  const gapPerYear = Math.max(0, coaPerYear - capPerYear);
  const totalCoa = coaPerYear * lengthYears;
  const naiveCap = capPerYear * lengthYears;
  const totalCap = Math.min(naiveCap, aggregateCap);
  const totalGap = Math.max(0, totalCoa - totalCap);
  const monthlyEquivalent = Math.round(totalGap / (lengthYears * 12));

  return {
    kind: "ok",
    schoolName: school.name,
    schoolShortName: school.shortName ?? school.name,
    schoolState: school.state,
    programLabel: program.label,
    programShortLabel: program.shortLabel,
    category: program.category,
    coaPerYear,
    capPerYear,
    gapPerYear,
    lengthYears,
    totalCoa,
    totalCap,
    totalGap,
    monthlyEquivalent,
    citation: {
      ipedsYear: 2024,
      statute: caps.statute + ", effective " + caps.effective_date,
    },
  };
}
