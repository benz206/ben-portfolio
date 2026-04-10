"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaFolderOpen, FaHouse, FaImages, FaPenNib } from "react-icons/fa6";
import Card from "@/components/Card";
import { useCommandMenu } from "@/components/CommandPalette/CommandProvider";

const links = [
    {
        href: "/",
        label: "Home",
        icon: FaHouse,
        description: "Back to the landing page.",
    },
    {
        href: "/projects",
        label: "Projects",
        icon: FaFolderOpen,
        description: "Browse my work.",
    },
    {
        href: "/blog",
        label: "Blog",
        icon: FaPenNib,
        description: "Read the latest posts.",
    },
    {
        href: "/gallery",
        label: "Gallery",
        icon: FaImages,
        description: "Photos & snapshots.",
    },
] as const;

export default function NotFoundAnimated() {
    const pathname = usePathname();
    const router = useRouter();
    const { open } = useCommandMenu();

    return (
        <main className="overflow-hidden relative min-h-screen text-white">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 opacity-80 bg-noir-radial" />
            <div className="relative mx-auto flex w-11/12 max-w-270 flex-col items-center justify-center pb-24 pt-28 min-h-screen">
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                    <Card
                        variant="glass"
                        ambient
                        ambientVariant="violet"
                        ambientClassName="opacity-35"
                        className="p-8 sm:p-12"
                    >
                        <div className="flex flex-col gap-10">
                            <div className="space-y-4">
                                <div className="flex gap-4 justify-between items-center">
                                    <span className="text-xs uppercase tracking-[0.2em] text-white/45">
                                        404 - Not found
                                    </span>
                                </div>
                                <h1 className="text-4xl font-semibold tracking-tight leading-tight sm:text-5xl">
                                    Page not found
                                </h1>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </main>
    );
}
