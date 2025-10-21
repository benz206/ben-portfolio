"use client";
import { motion, useInView } from "framer-motion";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

type ImageT = {
    public_id: string;
    format: string;
    width: number;
    height: number;
};

const boxAnim = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
};
const itemAnim = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

function PhotoTile({
    image,
    placeholder,
    onSelect,
}: {
    image: ImageT;
    placeholder?: string;
    onSelect: (image: ImageT) => void;
}) {
    const ref = useRef<HTMLButtonElement | null>(null);
    const shouldLoadImage = useInView(ref, { once: true, amount: 0.35 });

    return (
        <motion.button
            ref={ref}
            type="button"
            className="group block w-full overflow-hidden rounded-2xl transition duration-200 hover:brightness-110"
            onClick={() => onSelect(image)}
            variants={itemAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                {shouldLoadImage && (
                    <CldImage
                        fill
                        src={image.public_id}
                        alt={image.public_id}
                        placeholder="blur"
                        blurDataURL={placeholder}
                        loading="lazy"
                        crop="fill"
                        quality="auto"
                        dpr="auto"
                        format="webp"
                        sizes="(min-width: 1280px) 360px, (min-width: 768px) 320px, 260px"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                )}
            </div>
        </motion.button>
    );
}

export default function GalleryClient({ images }: { images: ImageT[] }) {
    const [selectedImage, setSelectedImage] = useState<ImageT | null>(null);
    const placeholderDataUrls = useMemo(() => {
        const map: Record<string, string> = {};
        images.forEach((image) => {
            map[image.public_id] = getCldImageUrl({
                src: image.public_id,
                width: 40,
                height: 40,
                crop: "fill",
                quality: "auto:low",
                format: "auto",
            });
        });
        return map;
    }, [images]);

    const handleSelect = useCallback((image: ImageT) => {
        setSelectedImage(image);
    }, []);

    const handleClose = useCallback(() => {
        setSelectedImage(null);
    }, []);

    useEffect(() => {
        if (!selectedImage) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                handleClose();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [selectedImage, handleClose]);

    return (
        <section className="relative overflow-hidden bg-[#05070f] text-white">
            <div className="absolute inset-0 z-0 pointer-events-none bg-noir-gradient" />
            <div className="absolute inset-0 z-0 opacity-80 pointer-events-none bg-noir-radial" />
            <div className="absolute inset-0 z-0 bg-gradient-to-b via-transparent pointer-events-none from-black/45 to-black/80" />
            <div className="relative z-10 mx-auto w-11/12 max-w-[1040px] space-y-16 pb-24 pt-16 lg:pb-32 lg:pt-24">
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

                <motion.div
                    className={`grid w-full min-h-[60vh] gap-6 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 ${
                        selectedImage ? "blur-sm" : ""
                    }`}
                    variants={boxAnim}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {images.map((image) => (
                        <PhotoTile
                            key={image.public_id}
                            image={image}
                            placeholder={placeholderDataUrls[image.public_id]}
                            onSelect={handleSelect}
                        />
                    ))}
                </motion.div>
            </div>

            {selectedImage && (
                <motion.div
                    className="flex fixed top-0 left-0 z-20 justify-center items-center w-full h-full backdrop-blur-md bg-neutral-950/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleClose();
                    }}
                >
                    <motion.div
                        className="flex relative flex-col items-center px-4 w-full max-w-4xl sm:px-8"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            key={selectedImage.public_id}
                            className="flex justify-center w-full"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.35 }}
                        >
                            <CldImage
                                className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl shadow-black/30"
                                width={selectedImage.width}
                                height={selectedImage.height}
                                src={selectedImage.public_id}
                                alt={selectedImage.public_id}
                                placeholder="blur"
                                blurDataURL={
                                    placeholderDataUrls[selectedImage.public_id]
                                }
                                crop="fill"
                                quality="auto"
                                dpr="auto"
                                format="webp"
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}
