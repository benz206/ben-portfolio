import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import Card from "@/components/Card";
import {
    AmbientGradient,
    type AmbientVariant,
} from "@/components/AmbientGradient";
import Eyebrow from "@/components/Eyebrow";
import { cn } from "@/utils/cn";

export type RoleCardData = {
    title: string;
    company: string;
    location: string;
    period: string;
    image: {
        src: StaticImageData;
        alt: string;
    };
    locationClass?: string;
    periodClass?: string;
    ambientVariant: AmbientVariant;
    href?: string;
    accent?: string;
};

type RoleCardProps = {
    role: RoleCardData;
    animationDelay: number;
};

export default function RoleCard({ role, animationDelay }: RoleCardProps) {
    const card = (
        <Card
            variant="glass"
            ambient
            ambientVariant={role.ambientVariant}
            ambientClassName="opacity-40"
            className={cn(
                "flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6",
                role.href &&
                    "transition-colors duration-300 group-hover:border-[rgba(var(--accent),0.55)]",
            )}
            motionProps={{
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.4 },
                transition: {
                    duration: 0.6,
                    delay: animationDelay,
                },
            }}
        >
            <Image
                src={role.image.src}
                alt={role.image.alt}
                width={56}
                height={56}
                className="hidden object-contain z-10 w-8 h-8 rounded-lg shrink-0 sm:block sm:h-16 sm:w-16"
            />

            <div className="flex flex-col flex-1 gap-1 sm:my-auto">
                <div className="flex flex-wrap gap-2 justify-between items-center">
                    <h2 className="text-base font-medium text-white">
                        {role.company}
                    </h2>
                    <Eyebrow
                        className={`tracking-[0.2em] ${
                            role.locationClass ?? "text-white/55"
                        }`}
                    >
                        {role.location}
                    </Eyebrow>
                </div>
                <div className="flex flex-wrap gap-2 justify-between items-center text-sm">
                    <p className="font-extralight text-white/65">
                        {role.title}
                    </p>
                    <Eyebrow
                        className={`tracking-[0.1em] ${
                            role.periodClass ?? "text-white/45"
                        }`}
                    >
                        {role.period}
                    </Eyebrow>
                </div>
            </div>
        </Card>
    );

    if (!role.href) return card;

    return (
        <a
            href={role.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${role.company} — opens in new tab`}
            style={{ "--accent": role.accent ?? "255,255,255" } as CSSProperties}
            className="group block relative rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent),0.6)]"
        >
            {/* glow = the card's own ambient gradient, blurred out past its edges */}
            <AmbientGradient
                variant={role.ambientVariant}
                className="-inset-2 rounded-xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70"
            />
            {card}
        </a>
    );
}
