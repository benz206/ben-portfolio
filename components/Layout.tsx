"use client";

import React, { PropsWithChildren } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function Layout({ children }: PropsWithChildren) {
    const pathname = usePathname();
    if (pathname === "/") {
        return (
            <div className="relative h-screen bg-[#050506]">
                <Navigation />
                <main className="h-full overflow-y-auto home-scroll snap-y snap-proximity">
                    {children}
                    <Footer />
                </main>
            </div>
        );
    }
    return (
        <div className="scroll-smooth">
            <Navigation />
            {children}
            <Footer />
        </div>
    );
}
