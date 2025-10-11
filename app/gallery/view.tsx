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
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [direction, setDirection] = useState<number>(0);
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
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
    const totalImages = images.length;
    const progressLabel = totalImages
        ? `${String(currentIndex + 1).padStart(2, "0")} / ${String(
              totalImages
          ).padStart(2, "0")}`
        : undefined;

    const handleSelect = useCallback((image: ImageT, index: number) => {
        setDirection(0);
        setIsImageLoaded(false);
        setCurrentIndex(index);
        setSelectedImage(image);
    }, []);

    const handleNext = useCallback(() => {
        if (!images.length) return;
        setDirection(1);
        setIsImageLoaded(false);
        setCurrentIndex((previous) => {
            const nextIndex = (previous + 1) % images.length;
            setSelectedImage(images[nextIndex]);
            return nextIndex;
        });
    }, [images]);

    const handlePrevious = useCallback(() => {
        if (!images.length) return;
        setDirection(-1);
        setIsImageLoaded(false);
        setCurrentIndex((previous) => {
            const previousIndex =
                (previous - 1 + images.length) % images.length;
            setSelectedImage(images[previousIndex]);
            return previousIndex;
        });
    }, [images]);

    const handleClose = useCallback(() => {
        setSelectedImage(null);
        setIsImageLoaded(false);
    }, []);

    useEffect(() => {
        if (!selectedImage) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                handleNext();
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                handlePrevious();
            }
            if (event.key === "Escape") {
                event.preventDefault();
                handleClose();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [selectedImage, handleNext, handlePrevious, handleClose]);
    return (
        <>
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
                className={`grid w-full min-h-screen gap-4 px-6 pt-12 pb-20 mx-auto place-items-center max-w-7xl md:grid-cols-2 lg:grid-cols-3 lg:pb-24 lg:pt-24 3xl:pt-12 3xl:grid-cols-4 3xl:max-w-[1700px] ${
                    selectedImage ? "blur-sm" : ""
                }`}
                variants={boxAnim}
                initial="hidden"
                animate="visible"
            >
                {images.map((image, index) => (
                    <motion.div
                        key={image.public_id}
                        className="p-2 duration-100 hover:brightness-110"
                        onClick={() => handleSelect(image, index)}
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
                            blurDataURL={placeholderDataUrls[image.public_id]}
                            loading="lazy"
                            crop="fill"
                            quality="auto"
                            dpr="auto"
                            format="webp"
                        />
                    </motion.div>
                ))}
            </motion.div>
            {selectedImage && (
                <motion.div
                    className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-neutral-950/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleClose();
                    }}
                >
                    <motion.div
                        className="relative flex flex-col items-center gap-6 px-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <motion.div className="absolute top-0 right-0 z-20 flex items-center gap-3">
                            {progressLabel && (
                                <span className="px-4 py-2 text-[10px] font-medium tracking-[0.6em] text-white/70 uppercase bg-white/5 rounded-full">
                                    {progressLabel}
                                </span>
                            )}
                            <motion.button
                                className="flex items-center gap-2 px-4 py-2 text-sm text-white uppercase transition bg-white/10 rounded-full tracking-[0.3em] hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClose();
                                }}
                                aria-label="Close gallery"
                                whileTap={{ scale: 0.95 }}
                            >
                                Close
                            </motion.button>
                        </motion.div>
                        <motion.button
                            className="absolute left-0 z-10 flex items-center gap-2 px-4 py-2 text-white transition-transform transform -translate-x-full rounded-full bg-white/10 backdrop-blur-sm hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrevious();
                            }}
                            aria-label="View previous image"
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="text-xs uppercase tracking-[0.2em] hidden lg:block">
                                Previous
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </motion.button>
                        <motion.div
                            key={selectedImage.public_id}
                            className="relative flex items-center justify-center"
                            initial={{
                                x: direction > 0 ? 100 : -100,
                                opacity: 0,
                            }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CldImage
                                className="rounded-lg max-w-[75vw] max-h-[75vh] object-contain"
                                width={selectedImage.width}
                                height={selectedImage.height}
                                src={selectedImage.public_id}
                                alt={selectedImage.public_id}
                                placeholder="blur"
                                blurDataURL={
                                    selectedImage
                                        ? placeholderDataUrls[
                                              selectedImage.public_id
                                          ]
                                        : undefined
                                }
                                crop="fill"
                                quality="auto"
                                dpr="auto"
                                format="webp"
                                onLoad={() => setIsImageLoaded(true)}
                                onError={() => setIsImageLoaded(true)}
                            />
                            {!isImageLoaded && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                    <div className="w-16 h-16 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                                    <p className="text-xs tracking-[0.4em] uppercase text-white/60">
                                        Rendering image
                                    </p>
                                </div>
                            )}
                        </motion.div>
                        <motion.button
                            className="absolute right-0 z-10 flex items-center gap-2 px-4 py-2 text-white transition-transform transform translate-x-full rounded-full bg-white/10 backdrop-blur-sm hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            aria-label="View next image"
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                            <span className="text-xs uppercase tracking-[0.2em] hidden lg:block">
                                Next
                            </span>
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
