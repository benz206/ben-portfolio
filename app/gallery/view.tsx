"use client";

import { AnimatePresence, m, type Variants } from "framer-motion";
import { CldImage } from "next-cloudinary";
import {
    useCallback,
    useEffect,
    useEffectEvent,
    useMemo,
    useState,
} from "react";
import ScatteredGradients from "@/components/blog/ScatteredGradients";
import { cn } from "@/utils/cn";

type ImageT = {
    public_id: string;
    format: string;
    width: number;
    height: number;
};

const boxAnim: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { delayChildren: 0.2, staggerChildren: 0.05 },
    },
};
const itemAnim: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

const viewportOptions = { once: true, margin: "200px 0px 200px 0px" };

const COLUMN_BREAKPOINTS: { minWidth: number; columns: number }[] = [
    { minWidth: 1920, columns: 4 },
    { minWidth: 1024, columns: 3 },
    { minWidth: 640, columns: 2 },
    { minWidth: 0, columns: 1 },
];

function computeColumnCount(width: number): number {
    for (const bp of COLUMN_BREAKPOINTS) {
        if (width >= bp.minWidth) return bp.columns;
    }
    return 1;
}

function useColumnCount(defaultCount = 3): number {
    const [count, setCount] = useState(defaultCount);
    useEffect(() => {
        const update = () => setCount(computeColumnCount(window.innerWidth));
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return count;
}

function distributeIntoColumns<T>(items: T[], columnCount: number): T[][] {
    const columns: T[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, i) => {
        columns[i % columnCount].push(item);
    });
    return columns;
}

function MasonryTile({
    image,
    placeholder,
    onSelect,
}: {
    image: ImageT;
    placeholder?: string;
    onSelect: (image: ImageT) => void;
}) {
    return (
        <m.button
            type="button"
            className="block w-full overflow-hidden rounded-xl transition duration-200 group hover:brightness-110"
            onClick={() => onSelect(image)}
            variants={itemAnim}
            initial="hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            viewport={viewportOptions}
            whileInView="visible"
        >
            <div
                className="overflow-hidden relative w-full rounded-xl"
                style={{ aspectRatio: `${image.width} / ${image.height}` }}
            >
                <CldImage
                    fill
                    src={image.public_id}
                    alt={image.public_id}
                    placeholder="blur"
                    blurDataURL={placeholder}
                    loading="lazy"
                    quality="auto"
                    dpr="auto"
                    format="webp"
                    sizes="(min-width: 1280px) 360px, (min-width: 768px) 320px, 260px"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
            </div>
        </m.button>
    );
}

export default function GalleryClient({
    images,
    placeholders,
}: {
    images: ImageT[];
    placeholders: Record<string, string>;
}) {
    const [selectedImage, setSelectedImage] = useState<ImageT | null>(null);
    const columnCount = useColumnCount();
    const columns = useMemo(
        () => distributeIntoColumns(images, columnCount),
        [images, columnCount],
    );

    const handleSelect = useCallback((image: ImageT) => {
        setSelectedImage(image);
    }, []);

    const handleClose = useCallback(() => {
        setSelectedImage(null);
    }, []);

    const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            event.preventDefault();
            handleClose();
        }
    });

    useEffect(() => {
        if (!selectedImage) return;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [selectedImage]);

    return (
        <section className="relative overflow-hidden bg-[#05070f] text-white">
            <div className="absolute inset-0 z-0 pointer-events-none bg-noir-gradient" />
            <div className="absolute inset-0 z-0 opacity-80 pointer-events-none bg-noir-radial" />
            <ScatteredGradients seed="gallery" count={32} />
            <div className="absolute inset-0 z-0 bg-gradient-to-b via-transparent pointer-events-none from-black/45 to-black/80" />
            <div className="relative z-10 mx-auto w-11/12 max-w-260 space-y-16 pb-24 pt-16 lg:pb-32 lg:pt-24">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-3">
                        <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                            Photos I&apos;ve Taken
                        </span>
                        <h1 className="text-4xl font-semibold lg:text-5xl">
                            Gallery
                        </h1>
                    </div>
                    <p className="max-w-md text-sm text-white/70 sm:text-right">
                        Photos I&apos;ve taken over the years.
                    </p>
                </div>

                <m.div
                    className={cn(
                        "flex w-full min-h-[60vh] gap-4",
                        selectedImage && "blur-sm",
                    )}
                    variants={boxAnim}
                    initial="hidden"
                    animate="visible"
                >
                    {columns.map((column, columnIndex) => (
                        <div
                            key={columnIndex}
                            className="flex flex-1 flex-col gap-4 min-w-0"
                        >
                            {column.map((image) => (
                                <MasonryTile
                                    key={image.public_id}
                                    image={image}
                                    placeholder={placeholders[image.public_id]}
                                    onSelect={handleSelect}
                                />
                            ))}
                        </div>
                    ))}
                </m.div>
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <m.div
                        className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center backdrop-blur-md bg-neutral-950/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={handleClose}
                    >
                        <m.div
                            key={selectedImage.public_id}
                            className="cursor-default"
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CldImage
                                className="max-h-[80vh] w-auto max-w-[90vw] rounded-xl object-contain shadow-2xl shadow-black/30"
                                width={selectedImage.width}
                                height={selectedImage.height}
                                src={selectedImage.public_id}
                                alt={selectedImage.public_id}
                                placeholder="blur"
                                blurDataURL={
                                    placeholders[selectedImage.public_id]
                                }
                                crop="fill"
                                quality="auto"
                                dpr="auto"
                                format="webp"
                            />
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </section>
    );
}
