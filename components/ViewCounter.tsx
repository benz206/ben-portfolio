"use client";

import { useEffect } from "react";

const VIEWED_KEY = "portfolio:viewed";

export default function ViewCounter() {
    useEffect(() => {
        if (sessionStorage.getItem(VIEWED_KEY)) return;

        (async () => {
            try {
                await fetch("/api/views", { method: "POST" });
                sessionStorage.setItem(VIEWED_KEY, "1");
            } catch (error) {
                console.error("Failed to increment global views", error);
            }
        })();
    }, []);

    return null;
}
