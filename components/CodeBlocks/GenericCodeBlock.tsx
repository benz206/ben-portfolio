"use client";

import { PrismTheme } from "prism-react-renderer";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

type CodeBlockProps = {
    code: string;
    language: string;
};

const catppuccinMochaTheme: PrismTheme = {
    plain: {
        color: "#cdd6f4",
        backgroundColor: "transparent",
    },
    styles: [
        { types: ["comment"], style: { color: "#6c7086" } },
        { types: ["string", "char", "inserted"], style: { color: "#a6e3a1" } },
        {
            types: ["number", "constant", "builtin", "boolean"],
            style: { color: "#fab387" },
        },
        { types: ["function", "class-name"], style: { color: "#89b4fa" } },
        { types: ["keyword", "operator"], style: { color: "#cba6f7" } },
        { types: ["punctuation"], style: { color: "#bac2de" } },
        { types: ["property", "variable"], style: { color: "#f9e2af" } },
        { types: ["tag", "important", "deleted"], style: { color: "#f38ba8" } },
        { types: ["attr-name", "selector"], style: { color: "#94e2d5" } },
    ],
};

const LANGUAGE_LABELS: Record<string, string> = {
    cpp: "C++",
    ts: "TypeScript",
    tsx: "TSX",
    js: "JavaScript",
    jsx: "JSX",
    py: "Python",
    sh: "Shell",
    bash: "Shell",
    json: "JSON",
    text: "Text",
};

const CODE_CLASS =
    "overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6 text-[#cdd6f4] md:px-5 md:text-sm";

export default function GenericCodeBlock({ code, language }: CodeBlockProps) {
    const [copyStatus, setCopyStatus] = useState("");
    const copyTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
    const lastCopyStatus = useRef("");
    const [CodeBlock, setCodeBlock] = useState<any>(null);

    useEffect(() => {
        const loadCodeBlock = async () => {
            try {
                const { CodeBlock: CodeBlockComponent } =
                    await import("react-code-block");
                setCodeBlock(() => CodeBlockComponent);
            } catch (error) {
                console.error("Failed to load CodeBlock component:", error);
            }
        };

        loadCodeBlock();
    }, []);

    const copyCode = async () => {
        let message = "Copied!";
        try {
            await navigator.clipboard.writeText(code);
        } catch (error) {
            console.error("Failed to copy code", error);
            message = "Copy failed";
        }
        if (message === lastCopyStatus.current) message += " ";
        lastCopyStatus.current = message;

        clearTimeout(copyTimeout.current);
        setCopyStatus("");
        requestAnimationFrame(() => setCopyStatus(message));

        copyTimeout.current = setTimeout(() => {
            setCopyStatus("");
        }, 1500);
    };

    const header = (
        <div className="flex items-center justify-between border-b border-white/[0.06] py-1.5 pr-1.5 pl-4 md:pl-5">
            <span className="font-mono text-xs text-white/40">
                {LANGUAGE_LABELS[language] ?? language}
            </span>
            <div className="relative">
                <button
                    type="button"
                    onClick={copyCode}
                    className="rounded-md px-2.5 py-1 text-xs text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/90 cursor-pointer"
                >
                    Copy
                </button>
                <span
                    role="status"
                    className={cn(
                        "pointer-events-none absolute inset-y-0 right-0 flex items-center rounded-md bg-[#15161c] px-2.5 text-xs whitespace-nowrap text-white/90 opacity-0",
                        copyStatus && "opacity-100",
                    )}
                >
                    {copyStatus}
                </span>
            </div>
        </div>
    );

    return (
        <div className="my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0f1015] md:my-8">
            {header}
            {CodeBlock ? (
                <CodeBlock
                    code={code}
                    language={language}
                    theme={catppuccinMochaTheme}
                >
                    <CodeBlock.Code className={CODE_CLASS}>
                        <div className="table-row">
                            <CodeBlock.LineNumber className="table-cell pr-5 text-right text-white/20 select-none" />
                            <CodeBlock.LineContent className="table-cell">
                                <CodeBlock.Token />
                            </CodeBlock.LineContent>
                        </div>
                    </CodeBlock.Code>
                </CodeBlock>
            ) : (
                <pre className={CODE_CLASS}>
                    <code>{code}</code>
                </pre>
            )}
        </div>
    );
}
