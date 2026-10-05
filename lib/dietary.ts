import type { DietaryInfo, SugarTolerance } from "@/lib/types";

export const sugarOptions: { value: SugarTolerance; label: string }[] = [
  { value: "", label: "Normal — no limit" },
  { value: "reduced", label: "Reduced sugar" },
  { value: "none", label: "No added sugar (e.g. diabetic)" },
];

export function sugarLabel(value: SugarTolerance) {
  return sugarOptions.find((option) => option.value === value)?.label ?? "";
}

export function toSugarTolerance(value: unknown): SugarTolerance {
  return value === "reduced" || value === "none" ? value : "";
}

export function hasDietary(info: DietaryInfo) {
  return Boolean(info.allergies || info.sugarTolerance || info.medicalRestrictions);
}
