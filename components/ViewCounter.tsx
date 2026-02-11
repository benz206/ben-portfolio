"use client";

import { useEffect, useRef } from "react";

const VIEWED_KEY = "portfolio:viewed";
const SESSION_KEY = "portfolio:sessionId";
const HEARTBEAT_INTERVAL = 5 * 60 * 1000;

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

        if (!sessionStorage.getItem(VIEWED_KEY)) {
            fetch("/api/views", { method: "POST" }).then(() => {
                sessionStorage.setItem(VIEWED_KEY, "1");
            }).catch(() => {});
        }

        const sendHeartbeat = () => {
            fetch("/api/presence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
            }).catch(() => {});
        };

        sendHeartbeat();
        heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                sendHeartbeat();
                if (!heartbeatRef.current) {
                    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
                }
            } else {
                if (heartbeatRef.current) {
                    clearInterval(heartbeatRef.current);
                    heartbeatRef.current = null;
                }
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        };
    }, []);

    return null;
}
