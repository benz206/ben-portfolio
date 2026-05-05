import type { MDXComponents } from "mdx/types";
import YouTubeEmbed from "./components/mdx/YoutubeEmbed";
import GenericCodeBlock from "./components/CodeBlocks/GenericCodeBlock";
import MDXImage from "@/components/mdx/MDXImage";
import ResponsiveTable from "@/components/mdx/ResponsiveTable";
import { slugify } from "@/utils/slugify";
import React from "react";

function extractText(node: React.ReactNode): string {
    if (typeof node === "string" || typeof node === "number")
        return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (React.isValidElement(node))
        return extractText(
            (node.props as { children?: React.ReactNode }).children,
        );
    return "";
}

function headingId(children: React.ReactNode): string {
    return slugify(extractText(children));
}

export function getMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="mt-12 mb-4 text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2
                id={headingId(children)}
                className="mt-12 mb-4 text-2xl font-bold leading-snug scroll-mt-24"
            >
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3
                id={headingId(children)}
                className="mt-10 mb-3 text-xl font-semibold leading-snug scroll-mt-24"
            >
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4 className="mt-8 mb-2 text-lg font-semibold">{children}</h4>
        ),
        p: ({ children }) => (
            <p className="my-5 text-base leading-[1.85] text-white/80">
                {children}
            </p>
        ),
        a: ({ children, href }) => (
            <a
                className="text-blue-400 underline underline-offset-2 transition-colors hover:text-blue-300"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        ),
        strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        del: ({ children }) => (
            <del className="line-through opacity-60">{children}</del>
        ),
        s: ({ children }) => (
            <s className="line-through opacity-60">{children}</s>
        ),
        blockquote: ({ children }) => (
            <blockquote className="my-8 border-l-[3px] border-white/20 pl-5 italic text-white/60 [&>p]:my-0">
                {children}
            </blockquote>
        ),
        table: ({ children }) => <ResponsiveTable>{children}</ResponsiveTable>,
        thead: ({ children }) => <thead>{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
            <tr className="border-b border-white/10">{children}</tr>
        ),
        th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-sm font-semibold border border-white/10">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="px-4 py-2.5 text-sm text-white/75 border border-white/10">
                {children}
            </td>
        ),
        img: (props) => {
            if (!props.src || typeof props.src !== "string") return null;
            return <MDXImage src={props.src} alt={props.alt} />;
        },
        ol: ({ children }) => (
            <ol className="my-5 list-decimal space-y-2 pl-6">{children}</ol>
        ),
        ul: ({ children }) => (
            <ul className="my-5 list-disc space-y-2 pl-6">{children}</ul>
        ),
        li: ({ children }) => (
            <li className="text-base leading-[1.85] text-white/80">
                {children}
            </li>
        ),
        code: ({ children, className }) => {
            if (className?.includes("language-")) {
                const language = className.replace("language-", "");
                return (
                    <GenericCodeBlock
                        code={children as string}
                        language={language}
                    />
                );
            }
            return (
                <code
                    className="rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[0.875em] font-mono text-white/85"
                    style={{
                        fontFamily:
                            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    }}
                >
                    {children}
                </code>
            );
        },
        input: (props) => {
            if (props.type === "checkbox") {
                return (
                    <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 cursor-pointer accent-blue-500"
                        disabled={props.disabled}
                        checked={props.checked}
                        readOnly
                    />
                );
            }
            return <input {...props} />;
        },
        hr: () => <div className="my-10 h-px bg-white/10" />,
        Youtube: ({ src }: { src: string }) => <YouTubeEmbed src={src} />,
        ...components,
    };
}
