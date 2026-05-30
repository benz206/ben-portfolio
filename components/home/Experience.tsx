"use client";

import Image from "next/image";
import { m } from "framer-motion";
import GridGlow from "@/components/home/GridGlow";
import { now, previously, type Org } from "@/data/about";
// symbol-tracing hover feature — disabled for now:
// import { useMemo, useState } from "react";
// import { type GridGlowOrg } from "@/components/home/GridGlow";
// import { symbols } from "@/data/symbols";

const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.055, delayChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

function Diamond() {
    return (
        <span className="inline-block size-1.5 rotate-45 rounded-[1px] bg-white/30 shrink-0" />
    );
}

function Logo({ org }: { org: Org }) {
    return (
        <span
            className="relative inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[5px] ring-1 ring-white/15"
            style={{ boxShadow: `0 0 12px -2px rgba(${org.accent},0.55)` }}
        >
            {org.logo ? (
                <Image
                    src={org.logo}
                    alt={`${org.name} logo`}
                    fill
                    sizes="20px"
                    className={org.fit === "contain" ? "object-contain" : "object-cover"}
                />
            ) : (
                <span
                    className="flex h-full w-full items-center justify-center text-[8px] font-semibold tracking-tight text-white/90"
                    style={{
                        background: `linear-gradient(135deg, rgba(${org.accent},0.35), rgba(${org.accent},0.05))`,
                    }}
                >
                    {org.monogram}
                </span>
            )}
        </span>
    );
}

function OrgRow({
    org,
    small,
    onHover,
}: {
    org: Org;
    small?: boolean;
    onHover?: (active: boolean) => void;
}) {
    const name = (
        <span className="group inline-flex items-center gap-2">
            <Logo org={org} />
            <span
                className="font-semibold text-white decoration-white/30 underline-offset-4 group-hover:underline"
                onPointerEnter={() => onHover?.(true)}
                onPointerLeave={() => onHover?.(false)}
            >
                {org.name}
            </span>
        </span>
    );
    return (
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={small ? "text-white/45" : "text-white/55"}>
                {org.role}
            </span>
            {org.href ? (
                <a href={org.href} target="_blank" rel="noreferrer">
                    {name}
                </a>
            ) : (
                name
            )}
        </span>
    );
}

function Arrow() {
    return (
        <span className="select-none font-mono text-white/25 shrink-0">↳</span>
    );
}

export default function ExperienceSection() {
    // symbol-tracing hover feature — disabled for now:
    // const [activeKey, setActiveKey] = useState<string | null>(null);
    // const logos = useMemo<GridGlowOrg[]>(
    //     () =>
    //         [...now, ...previously]
    //             .filter((o) => symbols[o.name])
    //             .map((o) => ({
    //                 key: o.name,
    //                 accent: o.accent,
    //                 symbol: symbols[o.name],
    //             })),
    //     []
    // );

    return (
        <section className="home-section relative flex min-h-screen items-center justify-center overflow-hidden bg-black py-24 text-white">
            <GridGlow />
            {/* light vignette: only the outer edges fade so the beams stay
                visible across the whole section */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_85%_at_50%_50%,transparent_0%,transparent_60%,rgba(0,0,0,0.5)_100%)]" />

            <m.div
                className="relative z-10 flex w-11/12 max-w-2xl flex-col gap-9"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="flex flex-col gap-3.5 text-[15px] leading-relaxed [text-shadow:0_0_16px_rgba(0,0,0,0.7)] sm:text-base">
                    {now.map((org) => (
                        <m.div
                            key={org.name}
                            variants={item}
                            className="flex items-center gap-3"
                        >
                            <Diamond />
                            <OrgRow org={org} />
                        </m.div>
                    ))}

                    <m.div variants={item} className="flex items-center gap-3 pt-3">
                        <Diamond />
                        <span className="italic text-white/55">Previously:</span>
                    </m.div>
                    {previously.map((org) => (
                        <m.div
                            key={org.name}
                            variants={item}
                            className="flex items-center gap-3 pl-6"
                        >
                            <Arrow />
                            <OrgRow org={org} small />
                        </m.div>
                    ))}
                </div>
            </m.div>
        </section>
    );
}
