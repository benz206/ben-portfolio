import Card from "@/components/Card";
import StatusBadge from "./StatusBadge";
import { serviceSplash, type ServiceStatus } from "./services";

type ServiceCardProps = {
    service: ServiceStatus;
};

export default function ServiceCard({ service }: ServiceCardProps) {
    const splash = serviceSplash[service.id];

    return (
        <Card
            variant="glass"
            ambient
            ambientVariant={splash?.ambient ?? "slate"}
            ambientClassName="opacity-45"
            className="relative flex flex-col gap-5 border border-white/10 p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_18px_45px_-30px_rgba(255,255,255,0.55)]"
        >
            <div
                className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 opacity-60 blur-2xl ${
                    splash?.glow ?? "bg-noir-radial"
                }`}
            />
            <div className="absolute left-8 -bottom-24 w-56 h-56 opacity-40 blur-2xl pointer-events-none bg-noir-radial" />
            <div className="absolute inset-0 opacity-60 pointer-events-none">
                <div className="absolute inset-0 via-transparent to-transparent bg-linear-to-br from-white/5" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold">{service.name}</h2>
                    <p className="text-xs text-white/50">
                        {service.description}
                    </p>
                </div>
                <StatusBadge status={service.status} />
            </div>
            <div className="grid gap-3 text-sm text-white/70">
                {service.metrics.length === 0 ? (
                    <div className="space-y-3">
                        <div className="w-24 h-3 rounded-full bg-white/10" />
                        <div className="w-32 h-3 rounded-full bg-white/10" />
                        <div className="w-20 h-3 rounded-full bg-white/10" />
                    </div>
                ) : (
                    service.metrics.map((metric) => (
                        <div
                            key={`${service.id}-${metric.label}`}
                            className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                        >
                            <span className="text-xs uppercase tracking-[0.25em] text-white/40">
                                {metric.label}
                            </span>
                            <span className="wrap-break-word text-sm text-white/80 sm:text-right">
                                {metric.value}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <div className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.25em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-block">
                    {service.latencyMs ? `${service.latencyMs}ms` : "Checking"}
                </span>
                <span className="wrap-break-word sm:text-right">
                    {service.detail ? service.detail : "Last check"}
                </span>
            </div>
        </Card>
    );
}
