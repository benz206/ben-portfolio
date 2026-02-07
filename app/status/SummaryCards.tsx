import Card from "@/components/Card";
import StatusBadge from "./StatusBadge";
import type { ServiceStatus } from "./services";

type SummaryCardsProps = {
    services: ServiceStatus[];
};

export default function SummaryCards({ services }: SummaryCardsProps) {
    const total = services.length;
    const okCount = services.filter((s) => s.status === "ok").length;
    const degradedCount = services.filter(
        (s) => s.status === "degraded"
    ).length;
    const downCount = services.filter((s) => s.status === "down").length;

    const overallStatus: ServiceStatus["status"] =
        downCount > 0
            ? "down"
            : degradedCount > 0
            ? "degraded"
            : okCount === total && total > 0
            ? "ok"
            : "loading";

    return (
        <>
            <Card
                variant="glass"
                ambient
                ambientClassName="opacity-45"
                className="flex relative flex-col gap-4 p-5 border border-white/10"
            >
                <div className="absolute -top-16 -right-16 w-44 h-44 opacity-60 blur-2xl pointer-events-none bg-noir-radial-berry" />
                <div className="absolute left-6 -bottom-14 w-36 h-36 opacity-40 blur-2xl pointer-events-none bg-noir-radial" />
                <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Overall
                    </span>
                    <StatusBadge status={overallStatus} />
                </div>
                <div className="text-2xl font-semibold">
                    {okCount === total && total > 0
                        ? "All clear"
                        : downCount > 0
                        ? "Issues"
                        : degradedCount > 0
                        ? "Degraded"
                        : "Checking"}
                </div>
            </Card>
            <Card
                variant="glass"
                ambient
                ambientVariant="blue"
                ambientClassName="opacity-40"
                className="flex relative flex-col gap-4 p-5 border border-white/10"
            >
                <div className="absolute -top-16 -right-16 w-44 h-44 opacity-60 blur-2xl pointer-events-none bg-noir-radial-cool" />
                <div className="absolute left-6 -bottom-14 w-36 h-36 opacity-40 blur-2xl pointer-events-none bg-noir-radial" />
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                    Services
                </span>
                <div className="text-3xl font-semibold">{total}</div>
                <div className="text-xs uppercase tracking-[0.25em] text-white/35">
                    Monitored
                </div>
            </Card>
            <Card
                variant="glass"
                ambient
                ambientVariant="tangerine"
                ambientClassName="opacity-40"
                className="flex relative flex-col gap-4 p-5 border border-white/10"
            >
                <div className="absolute -top-16 -right-16 w-44 h-44 opacity-60 blur-2xl pointer-events-none bg-noir-radial-spotify" />
                <div className="absolute left-6 -bottom-14 w-36 h-36 opacity-40 blur-2xl pointer-events-none bg-noir-radial" />
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                    Operational
                </span>
                <div className="text-3xl font-semibold">{okCount}</div>
                <div className="text-xs uppercase tracking-[0.25em] text-white/35">
                    Operational
                </div>
            </Card>
            <Card
                variant="glass"
                ambient
                ambientVariant="slate"
                ambientClassName="opacity-35"
                className="flex relative flex-col gap-4 p-5 border border-white/10"
            >
                <div className="absolute -top-16 -right-16 w-44 h-44 opacity-60 blur-2xl pointer-events-none bg-noir-radial-warm" />
                <div className="absolute left-6 -bottom-14 w-36 h-36 opacity-40 blur-2xl pointer-events-none bg-noir-radial" />
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                    Alerts
                </span>
                <div className="text-3xl font-semibold">
                    {degradedCount + downCount}
                </div>
                <div className="text-xs uppercase tracking-[0.25em] text-white/35">
                    Degraded/Down
                </div>
            </Card>
        </>
    );
}
