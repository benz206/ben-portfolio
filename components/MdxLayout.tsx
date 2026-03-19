import Link from "next/link";
import { RawBlogMetadata } from "@/types";
import Hashtag from "@/components/Hashtag";
import ScatteredGradients from "@/components/blog/ScatteredGradients";
import TableOfContents from "@/components/blog/TableOfContents";

type Heading = { level: number; text: string; id: string };

export default function MdxLayout({
    children,
    metadata,
    createdDate,
    updatedDate,
    viewCounter,
    headings = [],
}: {
    children: React.ReactNode;
    metadata: RawBlogMetadata;
    createdDate: string;
    updatedDate: string;
    viewCounter?: React.ReactNode;
    headings?: Heading[];
}) {
    const showUpdated = updatedDate && updatedDate !== createdDate;
    const hasTOC = headings.length > 0;

    return (
        <div className="relative min-h-screen bg-[#050506] text-[#ececec]">
            <ScatteredGradients seed={metadata.slug} />

            <div className="relative mx-auto max-w-[1100px] px-6 pb-32 pt-16 lg:pt-20">
                {/* Back navigation */}
                <div className="mb-14 max-w-[700px]">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M9 2L4 7l5 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        All posts
                    </Link>
                </div>

                {/* Article + sidebar layout */}
                <div className="flex gap-16">
                    {/* Article column */}
                    <div className="min-w-0 w-full max-w-[700px]">
                        <header className="mb-8 space-y-4">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight lg:text-[2.5rem]">
                                {metadata.title}
                            </h1>

                            {metadata.description && (
                                <p className="text-lg leading-relaxed text-white/55">
                                    {metadata.description}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-sm text-white/40">
                                <time dateTime={metadata.created}>
                                    {createdDate}
                                </time>
                                {showUpdated && (
                                    <>
                                        <span aria-hidden="true">·</span>
                                        <span>Updated {updatedDate}</span>
                                    </>
                                )}
                                {viewCounter && (
                                    <>
                                        <span aria-hidden="true">·</span>
                                        {viewCounter}
                                    </>
                                )}
                            </div>

                            {metadata.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {metadata.tags.map((tag) => (
                                        <Hashtag key={tag} hashtag={tag} />
                                    ))}
                                </div>
                            )}
                        </header>

                        <div className="mb-10 h-px bg-white/10" />

                        <article>{children}</article>
                    </div>

                    {/* TOC sidebar — visible lg+. createPortal in TableOfContents
                        renders the mobile button into document.body, so it's
                        visible on mobile despite this aside being display:none. */}
                    {hasTOC && (
                        <aside className="hidden lg:block w-[200px] shrink-0">
                            <TableOfContents headings={headings} />
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}
