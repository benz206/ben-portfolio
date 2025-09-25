"use client";
import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { useState } from "react";

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

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setSelectedImage(images[(currentIndex + 1) % images.length]);
    };
    const handlePrevious = () => {
        setDirection(-1);
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
        setSelectedImage(
            images[(currentIndex - 1 + images.length) % images.length]
        );
    };

    return (
        <>
            <div
                className={`relative top-0 flex justify-center w-full h-[550px] bg-rainbow-gradient animate-breathing-gradient ${
                    selectedImage ? "blur-md" : ""
                }`}
            >
                <motion.div
                    className="relative flex h-[370px] lg:h-[300px] card-hero w-11/12 lg:w-[1000px] mt-32 lg:mt-40"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="flex flex-col justify-center w-full h-full p-12">
                        <h2 className="p-2 text-lg text-center">
                            PHOTOS I&apos;VE TAKEN
                        </h2>
                        <h1 className="p-2 text-4xl font-black text-center lg:text-6xl">
                            GALLERY
                        </h1>
                        <p className="p-2 py-5 font-light">
                            A collection of photos I&apos;ve taken over the
                            years.
                        </p>
                    </div>
                </motion.div>
            </div>
            <motion.div
                className={`grid gap-3 w-full min-h-screen grid-flow-row px-12 pt-12 pb-16 mx-auto place-items-center max-w-7xl md:grid-cols-2 lg:grid-cols-3 lg:pb-20 lg:pt-24 3xl:pt-12 ${
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
                        onClick={() => setSelectedImage(image)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        variants={itemAnim}
                    >
                        <CldImage
                            className="object-cover w-64 h-64 rounded-lg cursor-pointer lg:h-96 lg:w-96"
                            width={400}
                            height={400}
                            src={image.public_id}
                            alt={image.public_id}
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
                    className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setSelectedImage(null);
                    }}
                >
                    <motion.div
                        className="relative flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <button
                            className="absolute left-0 z-10 p-2 text-white transition-transform transform -translate-x-full hover:scale-110"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrevious();
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8"
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
                        </button>
                        <motion.div
                            key={selectedImage.public_id}
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
                                crop="fill"
                                quality="auto"
                                dpr="auto"
                                format="webp"
                            />
                        </motion.div>
                        <button
                            className="absolute right-0 z-10 p-2 text-white transition-transform transform translate-x-full hover:scale-110"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8"
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
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
