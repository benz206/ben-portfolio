import type { MDXComponents } from "mdx/types";
import YouTubeEmbed from "./components/mdx/YoutubeEmbed";
import GenericCodeBlock from "./components/CodeBlocks/GenericCodeBlock";
import styles from "@/styles/mdx.module.css";
import MDXImage from "@/components/mdx/MDXImage";
import ResponsiveTable from "@/components/mdx/ResponsiveTable";

export function getMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="py-2 text-3xl font-black lg:text-5xl">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="py-2 text-lg font-black lg:text-2xl">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="py-2 font-black text-md lg:text-xl">{children}</h3>
        ),
        h4: ({ children }) => (
            <h4 className="py-2 text-sm font-black lg:text-lg">{children}</h4>
        ),
        p: ({ children }) => (
            <p
                className={`my-5 text-xs font-light leading-5 ${styles.mdxParagraph} lg:text-base`}
            >
                {children}
            </p>
        ),
        a: ({ children, href }) => (
            <a
                className="text-blue-500 underline"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        ),
        strong: ({ children }) => (
            <strong className="font-bold bg-clip-text">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        del: ({ children }) => (
            <del className="line-through opacity-70">{children}</del>
        ),
        s: ({ children }) => (
            <s className="line-through opacity-70">{children}</s>
        ),
        blockquote: ({ children }) => (
            <blockquote className="pl-4 my-4 italic text-gray-300 border-l-4 border-gray-500">
                {children}
            </blockquote>
        ),
        table: ({ children }) => <ResponsiveTable>{children}</ResponsiveTable>,
        thead: ({ children }) => <thead className="">{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
            <tr className="border-b border-gray-500">{children}</tr>
        ),
        th: ({ children }) => (
            <th className="px-4 py-2 font-bold text-left border border-gray-500">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="px-4 py-2 border border-gray-500">{children}</td>
        ),
        img: (props) => {
            if (!props.src || typeof props.src !== "string") return null;
            return <MDXImage src={props.src} alt={props.alt} />;
        },
        ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
        ul: ({ children }) => <ul className="list-disc">{children}</ul>,
        li: ({ children }) => (
            <li className="my-2 text-sm font-light lg:text-lg">{children}</li>
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
                    className="rounded bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-200"
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
                        className="mr-2 w-4 h-4 cursor-pointer accent-blue-500"
                        disabled={props.disabled}
                        checked={props.checked}
                        readOnly
                    />
                );
            }
            return <input {...props} />;
        },
        hr: () => (
            <div className="my-6 max-w-[1170px] h-[1px] bg-[#383838] transition-colors duration-1000" />
        ),
        Youtube: ({ src }: { src: string }) => <YouTubeEmbed src={src} />,
        ...components,
    };
}
