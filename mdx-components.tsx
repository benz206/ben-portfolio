import type { MDXComponents } from "mdx/types";
import YouTubeEmbed from "./components/mdx/YoutubeEmbed";
import SoundtrackSong from "@/components/blog/soundtrack/Song";
import GenericCodeBlock from "./components/CodeBlocks/GenericCodeBlock";
import MDXImage from "@/components/mdx/MDXImage";
import ResponsiveTable from "@/components/mdx/ResponsiveTable";
import { slugify } from "@/utils/slugify";
import { getRemoteImageSize } from "@/utils/imageSize";
import React from "react";
import { cn } from "@/utils/cn";

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

const CALLOUT_STYLES = {
    note: "border-sky-400/20 bg-sky-400/[0.06] [&>p:first-child>strong:first-child]:text-sky-300",
    warning:
        "border-amber-400/20 bg-amber-400/[0.06] [&>p:first-child>strong:first-child]:text-amber-300",
    important:
        "border-violet-400/20 bg-violet-400/[0.07] [&>p:first-child>strong:first-child]:text-violet-300",
    tip: "border-emerald-400/20 bg-emerald-400/[0.06] [&>p:first-child>strong:first-child]:text-emerald-300",
};

function calloutKind(
    children: React.ReactNode,
): keyof typeof CALLOUT_STYLES | null {
    const match = extractText(children)
        .trim()
        .match(/^(note|warning|caution|important|tip)\b/i);
    if (!match) return null;
    const kind = match[1].toLowerCase();
    return kind === "caution" ? "warning" : (kind as keyof typeof CALLOUT_STYLES);
}

export function getMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="mt-10 mb-4 text-[22px] leading-[26px] font-semibold md:mt-12 md:mb-6 md:text-[25px] md:leading-[30px] lg:mt-16 lg:text-[28px] lg:leading-[32px]">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2
                id={headingId(children)}
                className="mt-10 mb-4 text-xl leading-6 font-semibold scroll-mt-24 md:mt-12 md:mb-6 md:text-[22px] md:leading-[26px] lg:mt-16 lg:text-2xl lg:leading-7"
            >
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3
                id={headingId(children)}
                className="mt-8 mb-3 text-lg leading-[22px] font-semibold scroll-mt-24 md:mb-4 md:text-[19px] md:leading-6 lg:mt-12 lg:text-xl lg:leading-[26px]"
            >
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4 className="mt-8 mb-2 text-lg font-semibold">{children}</h4>
        ),
        p: ({ children }) => (
            <p className="mb-4 text-[17px] leading-[30px] text-white/80 md:mb-6 md:text-lg">
                {children}
            </p>
        ),
        a: ({ children, href }) => (
            <a
                className="text-blue-400 underline transition-colors underline-offset-2 hover:text-blue-300"
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
        blockquote: ({ children }) => {
            const kind = calloutKind(children);
            if (!kind) {
                return (
                    <blockquote className="my-8 border-l-2 border-white/20 pl-5 text-white/65 [&>p]:my-0 [&>p]:text-white/65">
                        {children}
                    </blockquote>
                );
            }
            return (
                <aside
                    className={cn(
                        "my-6 rounded-lg border px-4 py-3 md:px-5 md:py-4 [&>p]:my-0 [&>p]:text-base [&>p]:leading-7 [&>p]:text-white/75 [&>p+p]:mt-3",
                        CALLOUT_STYLES[kind],
                    )}
                >
                    {children}
                </aside>
            );
        },
        table: ({ children }) => <ResponsiveTable>{children}</ResponsiveTable>,
        thead: ({ children }) => <thead>{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
            <tr className="border-b border-white/[0.06] last:border-b-0">{children}</tr>
        ),
        th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-white/50 bg-white/[0.03] border-b border-white/10">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="px-4 py-2.5 text-sm leading-6 text-white/75 align-top">
                {children}
            </td>
        ),
        img: (async (props: { src?: string; alt?: string }) => {
            if (!props.src || typeof props.src !== "string") return null;
            const size = await getRemoteImageSize(props.src);
            return (
                <MDXImage
                    src={props.src}
                    alt={props.alt}
                    width={size?.width}
                    height={size?.height}
                />
            );
        }) as unknown as MDXComponents["img"],
        ol: ({ children }) => (
            <ol className="pl-6 mb-4 list-decimal list-outside md:mb-6">{children}</ol>
        ),
        ul: ({ children }) => (
            <ul className="pl-6 mb-4 list-disc list-outside md:mb-6">{children}</ul>
        ),
        li: ({ children }) => (
            <li className="mb-2 pl-1 text-[17px] leading-[30px] text-white/80 marker:font-normal marker:text-white/35 md:text-lg [&>ol]:mt-2 [&>ol]:mb-0 [&>ul]:mt-2 [&>ul]:mb-0">
                {children}
            </li>
        ),
        pre: ({ children }) => {
            const { className, children: code } = React.isValidElement(children)
                ? (children.props as {
                      className?: string;
                      children?: React.ReactNode;
                  })
                : { className: undefined, children };
            return (
                <GenericCodeBlock
                    code={extractText(code).replace(/\n$/, "")}
                    language={className?.replace("language-", "") ?? "text"}
                />
            );
        },
        code: ({ children }) => {
            return (
                <code
                    className="rounded-[5px] border border-white/[0.06] bg-white/[0.06] px-1.5 py-px text-[0.85em] font-mono text-white/90 box-decoration-clone break-words"
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
                        className="mr-2 cursor-pointer size-4 accent-blue-500"
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
        Song: ({ src, start }: { src: string; start?: string | number }) => (
            <SoundtrackSong src={src} start={start} />
        ),
        ...components,
    };
}
