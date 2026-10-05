import { HeartPulse } from "lucide-react";
import { hasDietary, sugarLabel } from "@/lib/dietary";
import type { DietaryInfo } from "@/lib/types";

export function DietaryAlert({
  info,
  title = "Dietary & health requirements",
  compact = false,
}: {
  info: DietaryInfo;
  title?: string;
  compact?: boolean;
}) {
  if (!hasDietary(info)) return null;
  const rows = [
    { label: "Allergies", value: info.allergies },
    { label: "Sugar", value: info.sugarTolerance ? sugarLabel(info.sugarTolerance) : "" },
    { label: "Medical", value: info.medicalRestrictions },
  ].filter((row) => row.value);

  return (
    <div
      role="note"
      className={`rounded-xl border-2 border-red-300 bg-red-50 text-red-900 ${compact ? "px-2.5 py-2 text-xs" : "px-4 py-3 text-sm"}`}
    >
      <p className="flex items-center gap-1.5 font-bold uppercase tracking-wide">
        <HeartPulse size={compact ? 13 : 16} aria-hidden="true" />
        {title}
      </p>
      <dl className="mt-1 space-y-0.5">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-1.5">
            <dt className="shrink-0 font-semibold">{row.label}:</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
