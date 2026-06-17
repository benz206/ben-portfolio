"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "portfolio:sessionId";
const HEARTBEAT_INTERVAL = 30_000;

function getSession(): { id: string; isNew: boolean } {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (id) return { id, isNew: false };
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return { id, isNew: true };
}

export default function ViewCounter() {
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const sessionRef = useRef<{ id: string; isNew: boolean } | null>(null);
    const firstTrackRef = useRef(true);
    const pathname = usePathname();

    // Detailed pageview tracking — fires on initial load and every SPA route change.
    useEffect(() => {
        if (!sessionRef.current) sessionRef.current = getSession();
        const session = sessionRef.current;

        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path:
                    window.location.pathname +
                    window.location.search +
                    window.location.hash,
                referrer: document.referrer || null,
                session: session.id,
                isNewSession: session.isNew && firstTrackRef.current,
                viewport: {
                    w: window.innerWidth,
                    h: window.innerHeight,
                },
            }),
            keepalive: true,
        }).catch(() => {});

        firstTrackRef.current = false;
    }, [pathname]);

    // Global view count + live presence heartbeat.
    useEffect(() => {
        if (!sessionRef.current) sessionRef.current = getSession();
        const session = sessionRef.current;

        fetch("/api/views", { method: "POST" }).catch(() => {});

        const sendHeartbeat = () => {
            fetch("/api/presence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: session.id }),
            }).catch(() => {});
        };

        const sendLeave = () => {
            navigator.sendBeacon(
                "/api/presence",
                new Blob(
                    [JSON.stringify({ sessionId: session.id, leave: true })],
                    {
                        type: "application/json",
                    },
                ),
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
