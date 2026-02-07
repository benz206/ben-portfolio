"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    buildServiceChecks,
    initialServices,
    type ServiceStatus,
} from "./services";
import SummaryCards from "./SummaryCards";
import ServiceCard from "./ServiceCard";

const formatTime = (value?: number) => {
    if (!value) return null;
    return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
};

export default function StatusClient() {
    const [services, setServices] = useState<ServiceStatus[]>(initialServices);
    const [lastCheckedAt, setLastCheckedAt] = useState<number | null>(null);

    const serviceChecks = useMemo(() => buildServiceChecks(), []);

    useEffect(() => {
        let cancelled = false;
        const runChecks = async () => {
            const results = await Promise.all(
                serviceChecks.map(async (service) => {
                    const start = performance.now();
                    try {
                        const result = await service.check();
                        const latencyMs = Math.round(
                            performance.now() - start
                        );
                        return {
                            id: service.id,
                            name: service.name,
                            description: service.description,
                            status: result.status,
                            metrics: result.metrics,
                            detail: result.detail,
                            updatedAt: result.updatedAt,
                            latencyMs,
                        } as ServiceStatus;
                    } catch {
                        return {
                            id: service.id,
                            name: service.name,
                            description: service.description,
                            status: "down",
                            metrics: [],
                            detail: "Check failed",
                            latencyMs: Math.round(performance.now() - start),
                        } as ServiceStatus;
                    }
                })
            );
            if (!cancelled) {
                setServices(results);
                setLastCheckedAt(Date.now());
            }
        };
        runChecks();
        const interval = window.setInterval(runChecks, 60_000);
        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [serviceChecks]);

    const summary = useMemo(() => {
        const okCount = services.filter((s) => s.status === "ok").length;
        const degradedCount = services.filter(
            (s) => s.status === "degraded"
        ).length;
        const downCount = services.filter((s) => s.status === "down").length;
        return { okCount, degradedCount, downCount };
    }, [services]);

    const lastCheckLabel = formatTime(lastCheckedAt ?? undefined);

    return (
        <section className="relative overflow-hidden text-white bg-[#050506]">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 opacity-70 bg-noir-radial" />
            <div className="absolute -top-24 right-0 h-[380px] w-[380px] opacity-40 bg-noir-radial-berry" />
            <div className="absolute -bottom-28 left-0 h-[420px] w-[420px] opacity-35 bg-noir-radial-cool" />
            <div className="relative mx-auto flex w-11/12 max-w-[1180px] flex-col gap-14 pb-24 pt-20 lg:pb-32 lg:pt-28">
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-3">
                            <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                                Status overview
                            </span>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                                Status
                            </h1>
                        </div>
                        <div className="space-y-2 text-sm text-white/60 sm:text-right">
                            <div>
                                {summary.okCount} operational ·{" "}
                                {summary.degradedCount} degraded ·{" "}
                                {summary.downCount} down
                            </div>
                            <div className="text-xs uppercase tracking-[0.3em] text-white/35">
                                {lastCheckLabel
                                    ? `Last check ${lastCheckLabel}`
                                    : "Auto refresh"}
                            </div>
                        </div>
                    </div>
                    <p className="max-w-2xl text-sm text-white/55">
                        Live checks for site dependencies. No links, just data.
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.08,
                    }}
                >
                    <SummaryCards services={services} />
                </motion.div>

                <motion.div
                    className="grid gap-6 md:grid-cols-2"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.1,
                    }}
                >
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
