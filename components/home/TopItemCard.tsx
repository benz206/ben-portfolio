import Image from "next/image";
import { FaSpotify } from "react-icons/fa6";
import Card from "@/components/Card";
import type { TopItem } from "./useSpotifyTop";

type TopItemCardProps = {
    item: TopItem;
    rank: number;
    kind: "track" | "artist";
};

function formatFollowers(n?: number) {
    if (typeof n !== "number" || Number.isNaN(n)) return null;
    return Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
}

export default function TopItemCard({ item, rank, kind }: TopItemCardProps) {
    const followers = formatFollowers(item.followers);
    const subtitle =
        kind === "track"
            ? item.subtitle
            : followers
              ? `${followers} followers`
              : item.subtitle;

    return (
        <Card
            variant="glass"
            ambient
            ambientSeed={`${kind}:${rank}:${item.name}`}
            ambientClassName="opacity-50"
            className="relative mx-auto mt-0 flex w-full items-center overflow-hidden rounded-xl border-0 px-2 py-2"
            motionProps={{
                initial: { opacity: 0, y: 12 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.4 },
                transition: { duration: 0.6 },
            }}
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

            <div className="relative z-10 flex w-full items-center gap-4 sm:gap-6">
                <div className="ml-2 h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5 shadow-xl sm:h-20 sm:w-20">
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
                            <FaSpotify className="w-10 h-10 text-white/35" />
                        </div>
                    )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-medium truncate text-slate-200">
                            {subtitle}
                        </span>
                    </div>

                    <h3 className="text-base font-bold leading-tight text-white sm:text-lg">
                        {item.name}
                    </h3>
                </div>
            </div>
        </Card>
    );
}
