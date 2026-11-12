"use client";

import "@/styles/view-transitions.css";
import { PropsWithChildren, ViewTransition } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Layout({ children }: PropsWithChildren) {
    const pathname = usePathname();

    return (
        <div className="scroll-smooth">
            <Navigation />
            <ViewTransition
                key={pathname}
                enter="page-fade"
                exit="page-fade"
                default="none"
            >
                {children}
            </ViewTransition>
            <Footer />
        </div>
    );
}
