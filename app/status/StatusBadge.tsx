import type { ServiceStatus } from "./services";

export default function StatusBadge({
    status,
}: {
    status: ServiceStatus["status"];
}) {
    const label =
        status === "ok"
            ? "Operational"
            : status === "degraded"
              ? "Degraded"
              : status === "down"
                ? "Down"
                : "Checking";
    const color =
        status === "ok"
            ? "bg-emerald-500/20 text-emerald-200"
            : status === "degraded"
              ? "bg-amber-500/20 text-amber-200"
              : status === "down"
                ? "bg-rose-500/20 text-rose-200"
                : "bg-white/10 text-white/60";
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${color}`}
        >
            <span className="inline-flex size-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}
