import Image, { type StaticImageData } from "next/image";
import Card from "@/components/Card";
import type { AmbientVariant } from "@/components/AmbientGradient";

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
};

type RoleCardProps = {
    role: RoleCardData;
    animationDelay: number;
};

export default function RoleCard({ role, animationDelay }: RoleCardProps) {
    return (
        <Card
            variant="glass"
            ambient
            ambientVariant={role.ambientVariant}
            ambientClassName="opacity-40"
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6"
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
                    <span
                        className={`text-xs uppercase tracking-[0.2em] ${
                            role.locationClass ?? "text-white/55"
                        }`}
                    >
                        {role.location}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2 justify-between items-center text-sm">
                    <p className="font-extralight text-white/65">
                        {role.title}
                    </p>
                    <span
                        className={`text-xs uppercase tracking-[0.1em] ${
                            role.periodClass ?? "text-white/45"
                        }`}
                    >
                        {role.period}
                    </span>
                </div>
            </div>
        </Card>
    );
}
