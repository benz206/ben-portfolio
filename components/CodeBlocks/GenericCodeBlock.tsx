"use client";

import { useCopyToClipboard } from "react-use";
import { PrismTheme } from "prism-react-renderer";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
        { types: ["number", "constant", "builtin", "boolean"], style: { color: "#fab387" } },
        { types: ["function", "class-name"], style: { color: "#89b4fa" } },
        { types: ["keyword", "operator"], style: { color: "#cba6f7" } },
        { types: ["punctuation"], style: { color: "#bac2de" } },
        { types: ["property", "variable"], style: { color: "#f9e2af" } },
        { types: ["tag", "important", "deleted"], style: { color: "#f38ba8" } },
        { types: ["attr-name", "selector"], style: { color: "#94e2d5" } },
    ],
};

export default function GenericCodeBlock({ code, language }: CodeBlockProps) {
    const [state, copyToClipboard] = useCopyToClipboard();
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
            <div className="my-2 overflow-x-auto rounded-xl bg-[#242424] px-4 py-4 shadow-lg sm:px-5 lg:p-6">
                <pre className="text-white">
                    <code>{code}</code>
                </pre>
            </div>
        );
    }

    return (
        <CodeBlock code={code} language={language} theme={catppuccinMochaTheme}>
            <motion.div className="relative my-2">
                <CodeBlock.Code className="overflow-x-auto rounded-xl bg-[#242424] px-4! py-4! shadow-lg sm:px-5! lg:p-6!">
                    <div className="table-row">
                        <CodeBlock.LineNumber className="table-cell pr-3 text-xs text-right text-gray-500 select-none sm:pr-4 sm:text-sm" />
                        <CodeBlock.LineContent className="table-cell min-w-max">
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </div>
                </CodeBlock.Code>

                <motion.button
                    className="absolute right-2 top-2 rounded-full bg-[#333333] px-3 py-1.5 text-xs font-semibold text-white transition-all duration-500 ease-in-out hover:text-[#9cdcfe] sm:px-3.5 sm:text-sm"
                    onClick={copyCode}
                >
                    {isCopied}
                </motion.button>
            </motion.div>
        </CodeBlock>
    );
}
