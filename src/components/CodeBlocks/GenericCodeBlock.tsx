import { useCopyToClipboard } from "react-use";
import { themes } from "prism-react-renderer";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type CodeBlockProps = {
    code: string;
    language: string;
};

export default function GenericCodeBlock({ code, language }: CodeBlockProps) {
    const [state, copyToClipboard] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState("Copy");
    const [CodeBlock, setCodeBlock] = useState<any>(null);

    useEffect(() => {
        const loadCodeBlock = async () => {
            try {
                const { CodeBlock: CodeBlockComponent } = await import(
                    "react-code-block"
                );
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
        <CodeBlock code={code} language={language} theme={themes.vsDark}>
            <motion.div className="relative my-2">
                <CodeBlock.Code className="bg-[#242424] lg:!p-6 !px-5 !py-4 rounded-xl shadow-lg overflow-auto">
                    <div className="table-row">
                        <CodeBlock.LineNumber className="table-cell pr-4 text-sm text-right text-gray-500 select-none" />
                        <CodeBlock.LineContent className="table-cell">
                            <CodeBlock.Token />
                        </CodeBlock.LineContent>
                    </div>
                </CodeBlock.Code>

                <motion.button
                    className="bg-[#333333] text-white hover:text-[#9cdcfe] rounded-full px-3.5 py-1.5 absolute top-2 right-2 text-sm font-semibold duration-500 ease-in-out transition-all"
                    onClick={copyCode}
                >
                    {isCopied}
                </motion.button>
            </motion.div>
        </CodeBlock>
    );
}
