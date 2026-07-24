import Image from "next/image";
import type { CSSProperties } from "react";
import { FaSpotify } from "react-icons/fa6";
import Card from "@/components/Card";
import type { TopItem } from "./useSpotifyTop";
import { formatCompact } from "@/utils/format";
import { glowColor } from "@/utils/glowColor";
import { inView } from "@/utils/motion";

type TopItemCardProps = {
    item: TopItem;
    rank: number;
    kind: "track" | "artist";
};

function formatFollowers(n?: number) {
    if (typeof n !== "number" || Number.isNaN(n)) return null;
    return formatCompact(n);
}

export default function TopItemCard({ item, rank, kind }: TopItemCardProps) {
    const followers = formatFollowers(item.followers);
    const glow = glowColor(item.color);
    const subtitle =
        kind === "track"
            ? item.subtitle
            : followers
              ? `${followers} followers`
              : item.subtitle;

    const card = (
        <Card
            variant="glass"
            ambient
            ambientSeed={`${kind}:${rank}:${item.name}`}
            ambientClassName="opacity-50"
            className="flex overflow-hidden relative items-center px-2 py-1 mx-auto mt-0 w-full h-28 rounded-xl border border-transparent transition-colors duration-300 hover:border-[rgba(var(--glow),0.6)]"
            style={{ "--glow": glow } as CSSProperties}
            motionProps={inView(12, 0.4, 0.6)}
        >
            {item.image && (
                <>
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </>
            )}

            <div className="flex relative z-10 gap-6 items-center w-full">
                <div className="overflow-hidden ml-2 size-20 rounded-lg shadow-xl bg-white/5">
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={140}
                            height={140}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex justify-center items-center w-full h-full">
                            <FaSpotify className="size-10 text-white/35" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col flex-1 justify-center min-w-0">
                    <div className="flex items-center mb-1 gap-x-2">
                        <span className="text-xs font-medium truncate text-zinc-200">
                            {subtitle}
                        </span>
                    </div>

                    <h3 className="text-lg font-semibold leading-tight text-white truncate">
                        {item.name}
                    </h3>
                </div>
            </div>
        </Card>
    );

    if (!item.href) return card;

    return (
        <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${item.name} on Spotify`}
            style={{ "--glow": glow } as CSSProperties}
            className="block w-full min-w-0 rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--glow),0.6)]"
        >
            {card}
        </a>
    );
}
