"use client";

import { useEffect } from "react";

export default function ViewCounter() {
    useEffect(() => {
        (async () => {
            try {
                await fetch("/api/views", { method: "POST" });
            } catch (error) {
                console.error("Failed to increment global views", error);
            }
        })();
    }, []);

    return null;
}


