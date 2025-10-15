"use client";
import { motion } from "framer-motion";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";

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
        <div className="relative w-full min-h-screen overflow-hidden bg-[#05070f] text-white">
            <div className="pointer-events-none absolute inset-0 z-0 bg-noir-gradient" />
            <div className="pointer-events-none absolute inset-0 z-0 bg-noir-radial opacity-80" />
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/45 via-transparent to-black/80" />
            <div className="relative z-10 flex flex-col items-center">
                <div
                    className={`relative top-0 flex justify-center w-full h-[550px] bg-rainbow-gradient animate-breathing-gradient ${
                        selectedImage ? "blur-md" : ""
                    }`}
                >
                    <Card
                        variant="glass"
                        ambient
                        ambientSeed="gallery"
                        ambientClassName="opacity-80"
                        className="relative flex flex-col items-center justify-center h-[370px] lg:h-[360px] w-11/12 lg:w-[1000px] mt-32 lg:mt-40"
                    >
                        <motion.p
                            className="text-sm tracking-[0.6em] text-white/70 uppercase"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            Photos I&apos;ve Taken
                        </motion.p>
                        <motion.h1
                            className="mt-3 text-5xl font-black tracking-tight text-center uppercase lg:text-6xl"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                        >
                            Gallery
                        </motion.h1>
                        <motion.p
                            className="max-w-xl mt-8 text-base text-center text-white/80"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45, duration: 0.6 }}
                        >
                            Quiet light, far horizons, everyday magic. Explore a
                            curated collection captured across the years.
                        </motion.p>
                    </Card>
                </div>
                <motion.div
                    className={`grid w-full min-h-[60vh] gap-4 px-6 pt-12 pb-24 mx-auto place-items-center max-w-7xl md:grid-cols-2 lg:grid-cols-3 3xl:pt-16 3xl:grid-cols-4 3xl:max-w-[1700px] ${
                        selectedImage ? "blur-sm" : ""
                    }`}
                    variants={boxAnim}
                    initial="hidden"
                    animate="visible"
                >
                    {images.map((image) => (
                        <motion.div
                            key={image.public_id}
                            className="p-2 duration-100 hover:brightness-110"
                            onClick={() => handleSelect(image)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            variants={itemAnim}
                        >
                            <CldImage
                                className="object-cover w-[280px] h-[280px] rounded-2xl cursor-pointer shadow-xl shadow-black/10 lg:h-[360px] lg:w-[360px]"
                                width={400}
                                height={400}
                                src={image.public_id}
                                alt={image.public_id}
                                placeholder="blur"
                                blurDataURL={
                                    placeholderDataUrls[image.public_id]
                                }
                                loading="lazy"
                                crop="fill"
                                quality="auto"
                                dpr="auto"
                                format="webp"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            {selectedImage && (
                <motion.div
                    className="fixed top-0 left-0 z-20 flex items-center justify-center w-full h-full bg-neutral-950/80 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleClose();
                    }}
                >
                    <motion.div
                        className="relative flex w-full max-w-4xl flex-col items-center px-4 sm:px-8"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            key={selectedImage.public_id}
                            className="flex w-full justify-center"
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
        </div>
    );
}
