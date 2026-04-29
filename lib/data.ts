import schoolsRaw from "@/data/schools.json";
import programsRaw from "@/data/programs.json";
import capsRaw from "@/data/caps.json";
import type { CapsData, ProgramsData, SchoolsData } from "./types";

const { _note, ...schoolsClean } = schoolsRaw as Record<string, unknown> & { _note?: string };
void _note;

export const schools = schoolsClean as unknown as SchoolsData;
export const programs = programsRaw as unknown as ProgramsData;
export const caps = capsRaw as unknown as CapsData;
