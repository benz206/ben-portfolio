"use client";

import { useCopyToClipboard } from "react-use";
import { PrismTheme } from "prism-react-renderer";
import { useState, useEffect } from "react";
import { m } from "framer-motion";

type CodeBlockProps = {
    code: string;
    language: string;
};

const catppuccinMochaTheme: PrismTheme = {
    plain: {
        color: "#cdd6f4",
        backgroundColor: "#1e1e2e",
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

export default function GenericCodeBlock({ code, language }: CodeBlockProps) {
    const [, copyToClipboard] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState("Copy");
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

    const copyCode = () => {
        copyToClipboard(code);
        setIsCopied("Copied!");

        setTimeout(() => {
            setIsCopied("Copy");
        }, 1500);
    };

    if (!CodeBlock) {
        return (
            <div className="bg-[#242424] lg:p-6 px-5 py-4 rounded-xl shadow-lg overflow-auto my-2">
                <pre className="text-white">
                    <code>{code}</code>
                </pre>
            </div>
        );
    }

    return (
        <CodeBlock code={code} language={language} theme={catppuccinMochaTheme}>
            <m.div className="relative my-2">
                <CodeBlock.Code className="bg-[#242424] lg:p-6! px-5! py-4! rounded-xl shadow-lg overflow-auto">
                    <div className="table-row">
                        <CodeBlock.LineNumber className="table-cell pr-4 text-sm text-right text-zinc-500 select-none" />
                        <CodeBlock.LineContent className="table-cell">
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </div>
                </CodeBlock.Code>

                <m.button
                    className="bg-[#333333] text-white hover:text-[#9cdcfe] rounded-full px-3.5 py-1.5 absolute top-2 right-2 text-sm font-semibold duration-500 ease-in-out transition-all"
                    onClick={copyCode}
                >
                    {isCopied}
                </m.button>
            </m.div>
        </CodeBlock>
    );
}
