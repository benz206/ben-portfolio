"use client";

import { m, type Variants } from "framer-motion";
import { CldImage } from "next-cloudinary";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type MouseEvent,
} from "react";
import { FiX } from "react-icons/fi";
import ScatteredGradients from "@/components/blog/ScatteredGradients";
import { cn } from "@/utils/cn";
import Eyebrow from "@/components/Eyebrow";

type ImageT = {
    public_id: string;
    format: string;
    width: number;
    height: number;
    alt: string;
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
            aria-haspopup="dialog"
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
                    alt={image.alt}
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

type RgbColor = [number, number, number];

export default function GalleryClient({
    images,
    placeholders,
    colors,
}: {
    images: ImageT[];
    placeholders: Record<string, string>;
    colors: Record<string, RgbColor>;
}) {
    const [selectedImage, setSelectedImage] = useState<ImageT | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const columnCount = useColumnCount();
    const columns = useMemo(
        () => distributeIntoColumns(images, columnCount),
        [images, columnCount],
    );

    const handleSelect = useCallback((image: ImageT) => {
        setSelectedImage(image);
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
        if (!imageRef.current?.contains(event.target as Node)) {
            dialogRef.current?.close();
        }
    };

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    return (
        <section className="relative overflow-hidden bg-[#05070f] text-white">
            <div className="absolute inset-0 z-0 pointer-events-none bg-noir-gradient" />
            <div className="absolute inset-0 z-0 opacity-80 pointer-events-none bg-noir-radial" />
            <ScatteredGradients seed="gallery" count={32} />
            <div className="absolute inset-0 z-0 bg-gradient-to-b via-transparent pointer-events-none from-black/45 to-black/80" />
            <div className="relative z-10 mx-auto w-11/12 max-w-260 space-y-16 pb-24 pt-16 lg:pb-32 lg:pt-24">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-3">
                        <Eyebrow className="tracking-[0.4em] text-white/40">
                            Photos I&apos;ve Taken
                        </Eyebrow>
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
                        isOpen && "blur-sm",
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

            <dialog
                ref={dialogRef}
                {...({ closedby: "any" } as Record<string, string>)}
                aria-label="Photo viewer"
                onClose={handleClose}
                onClick={handleDialogClick}
                className="group fixed inset-0 m-0 h-full max-h-none w-full max-w-none cursor-pointer items-center justify-center overscroll-contain bg-transparent text-white opacity-0 backdrop-blur-md transition-[opacity,display,overlay] duration-250 transition-discrete open:flex open:opacity-100 starting:open:opacity-0 motion-reduce:duration-100 backdrop:overflow-hidden backdrop:overscroll-contain backdrop:bg-transparent"
            >
                {selectedImage &&
                    (() => {
                        const rgb = colors[selectedImage.public_id] ?? [
                            12, 12, 14,
                        ];
                        const [r, g, b] = rgb;
                        return (
                            <>
                                <div
                                    className="pointer-events-none absolute inset-0"
                                    style={{
                                        background: `radial-gradient(ellipse at center, rgba(${r}, ${g}, ${b}, 0.55), rgba(${Math.round(r * 0.25)}, ${Math.round(g * 0.25)}, ${Math.round(b * 0.25)}, 0.85) 70%, rgba(5, 5, 8, 0.92) 100%)`,
                                        transition: "background 350ms ease",
                                    }}
                                    aria-hidden
                                />
                                <div
                                    className="pointer-events-none absolute inset-0"
                                    style={{
                                        background: `radial-gradient(circle at 50% 50%, rgba(${r}, ${g}, ${b}, 0.35), transparent 55%)`,
                                        filter: "blur(90px)",
                                        transition: "background 350ms ease",
                                    }}
                                    aria-hidden
                                />
                                <form
                                    method="dialog"
                                    className="absolute right-4 top-4 z-10"
                                >
                                    <button
                                        aria-label="Close"
                                        className="flex size-10 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur transition hover:bg-black/60 hover:text-white"
                                    >
                                        <FiX size={20} aria-hidden />
                                    </button>
                                </form>
                                <div
                                    ref={imageRef}
                                    className="relative cursor-default opacity-0 transition-[opacity,scale] duration-300 ease-out group-open:opacity-100 starting:group-open:opacity-0 motion-safe:scale-94 motion-safe:group-open:scale-100 motion-safe:starting:group-open:scale-94 motion-reduce:duration-100"
                                >
                                    <CldImage
                                        className="max-h-[80vh] w-auto max-w-[90vw] rounded-xl object-contain shadow-2xl shadow-black/30"
                                        width={selectedImage.width}
                                        height={selectedImage.height}
                                        src={selectedImage.public_id}
                                        alt={selectedImage.alt}
                                        placeholder="blur"
                                        blurDataURL={
                                            placeholders[
                                                selectedImage.public_id
                                            ]
                                        }
                                        crop="fill"
                                        quality="auto"
                                        dpr="auto"
                                        format="webp"
                                    />
                                </div>
                            </>
                        );
                    })()}
            </dialog>
        </section>
    );
}
