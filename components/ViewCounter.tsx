"use client";

import { useEffect, useRef } from "react";

const SESSION_KEY = "portfolio:sessionId";
const HEARTBEAT_INTERVAL = 30_000;

function getSessionId() {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
}

export default function ViewCounter() {
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const sessionId = getSessionId();

        fetch("/api/views", { method: "POST" }).catch(() => {});

        const sendHeartbeat = () => {
            fetch("/api/presence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
            }).catch(() => {});
        };

        const sendLeave = () => {
            navigator.sendBeacon(
                "/api/presence",
                new Blob([JSON.stringify({ sessionId, leave: true })], {
                    type: "application/json",
                }),
            );
        };

        sendHeartbeat();
        heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                sendHeartbeat();
                if (!heartbeatRef.current) {
                    heartbeatRef.current = setInterval(
                        sendHeartbeat,
                        HEARTBEAT_INTERVAL,
                    );
                }
            } else {
                if (heartbeatRef.current) {
                    clearInterval(heartbeatRef.current);
                    heartbeatRef.current = null;
                }
            }
        };

        const onPageHide = () => sendLeave();

        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("pagehide", onPageHide);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                onVisibilityChange,
            );
            window.removeEventListener("pagehide", onPageHide);
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        };
    }, []);

    return null;
}
