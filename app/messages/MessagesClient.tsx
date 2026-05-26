"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";

type Stage = "name" | "questions" | "success" | "failed" | "rate-limited";

export default function MessagesClient() {
    const [stage, setStage] = useState<Stage>("name");
    const [name, setName] = useState("");
    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>(["", "", ""]);
    const [message, setMessage] = useState("");
    const [senderName, setSenderName] = useState("");
    const [retryAfter, setRetryAfter] = useState(0);
    const [loading, setLoading] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        nameInputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (retryAfter <= 0) return;
        const interval = setInterval(() => {
            setRetryAfter((prev) => {
                if (prev <= 1) {
                    setStage("name");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [retryAfter]);

    const handleNameSubmit = useCallback(async () => {
        if (!name.trim() || loading) return;
        setLoading(true);
        try {
            const res = await fetch("/api/messages/lookup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim() }),
            });
            const data = await res.json();
            if (data.found) {
                setQuestions(data.questions);
                setAnswers(new Array(data.questions.length).fill(""));
                setStage("questions");
            }
        } catch {
            // Silent failure — same as name not found
        } finally {
            setLoading(false);
        }
    }, [name, loading]);

    const handleVerify = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch("/api/messages/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), answers }),
            });
            const data = await res.json();

            if (data.rateLimited) {
                setRetryAfter(data.retryAfter || 300);
                setStage("rate-limited");
            } else if (data.correct) {
                setMessage(data.message);
                setSenderName(data.senderName);
                setStage("success");
            } else {
                setStage("failed");
                setRetryAfter(300);
                setTimeout(() => {
                    setStage("rate-limited");
                }, 2000);
            }
        } catch {
            // Silent failure
        } finally {
            setLoading(false);
        }
    }, [name, answers, loading]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <section className="relative flex min-h-screen items-center justify-center bg-[#050506] text-white">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 opacity-60 bg-noir-radial" />

            <div className="relative z-10 w-full max-w-lg px-6">
                <AnimatePresence mode="wait">
                    {stage === "name" && (
                        <m.div
                            key="name"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center gap-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Enter your name
                                </h1>
                                <p className="text-sm text-white/40">
                                    If there&apos;s a message for you,
                                    you&apos;ll know
                                </p>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleNameSubmit();
                                }}
                                className="w-full flex flex-col gap-4"
                            >
                                <input
                                    ref={nameInputRef}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full name"
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.07]"
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    disabled={!name.trim() || loading}
                                    className="w-full rounded-lg bg-white/10 py-3 text-sm font-medium text-white/80 transition-all hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" />
                                    ) : (
                                        "Continue"
                                    )}
                                </button>
                            </form>
                        </m.div>
                    )}

                    {stage === "questions" && (
                        <m.div
                            key="questions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Prove it
                                </h1>
                                <p className="text-sm text-white/40">
                                    Answer all three correctly to see your
                                    message
                                </p>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleVerify();
                                }}
                                className="flex flex-col gap-5"
                            >
                                {questions.map((q, i) => (
                                    <m.div
                                        key={i}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.35,
                                            delay: i * 0.1,
                                        }}
                                        className="space-y-2"
                                    >
                                        <label className="block text-sm text-white/60">
                                            {q}
                                        </label>
                                        <input
                                            type="text"
                                            value={answers[i]}
                                            onChange={(e) => {
                                                const next = [...answers];
                                                next[i] = e.target.value;
                                                setAnswers(next);
                                            }}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 outline-none transition-colors focus:border-white/25 focus:bg-white/[0.07]"
                                            autoComplete="off"
                                            autoFocus={i === 0}
                                        />
                                    </m.div>
                                ))}

                                <button
                                    type="submit"
                                    disabled={
                                        answers.some((a) => !a.trim()) ||
                                        loading
                                    }
                                    className="mt-2 w-full rounded-lg bg-white/10 py-3 text-sm font-medium text-white/80 transition-all hover:bg-white/15 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" />
                                    ) : (
                                        "Unlock"
                                    )}
                                </button>
                            </form>
                        </m.div>
                    )}

                    {stage === "failed" && (
                        <m.div
                            key="failed"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-4 text-center"
                        >
                            <div className="text-4xl">&#10005;</div>
                            <p className="text-lg font-medium text-white/70">
                                That&apos;s not right
                            </p>
                        </m.div>
                    )}

                    {stage === "rate-limited" && (
                        <m.div
                            key="rate-limited"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center gap-4 text-center"
                        >
                            <p className="text-lg font-medium text-white/70">
                                Try again in
                            </p>
                            <p className="text-4xl font-light tabular-nums text-white/50">
                                {formatTime(retryAfter)}
                            </p>
                        </m.div>
                    )}

                    {stage === "success" && (
                        <m.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="text-center space-y-1">
                                <p className="text-xs uppercase tracking-widest text-white/30">
                                    A message for {senderName}
                                </p>
                            </div>

                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
                            >
                                <p className="whitespace-pre-wrap text-white/80 leading-relaxed">
                                    {message}
                                </p>
                            </m.div>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
