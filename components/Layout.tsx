import React, { PropsWithChildren } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className="scroll-smooth">
            <Navigation />
            {children}
            <Footer />
        </div>
    );
}
