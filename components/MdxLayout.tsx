import Link from "next/link";
import { RawBlogMetadata } from "@/types";
import Hashtag from "@/components/Hashtag";
import ScatteredGradients from "@/components/blog/ScatteredGradients";
import TableOfContents from "@/components/blog/TableOfContents";
import SoundtrackProvider from "@/components/blog/soundtrack/SoundtrackProvider";

type Heading = { level: number; text: string; id: string };

const EMPTY_HEADINGS: Heading[] = [];

export default function MdxLayout({
    children,
    metadata,
    createdDate,
    updatedDate,
    viewCounter,
    headings = EMPTY_HEADINGS,
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

            <div className="relative mx-auto w-11/12 max-w-270 pb-32 pt-16 lg:pt-20">
                <header className="mb-10 grid grid-cols-1 gap-6 lg:mb-16 lg:grid-cols-12 lg:gap-[30px]">
                    <div className="flex flex-col gap-y-8 lg:col-span-7">
                        {/* Back navigation */}
                        <nav aria-label="Breadcrumb">
                            <ol className="flex list-none flex-wrap items-center gap-x-2 gap-y-1 ml-0 text-sm text-white/40">
                                <li>
                                    <Link
                                        href="/blog"
                                        className="transition-colors hover:text-white/70"
                                    >
                                        Blog
                                    </Link>
                                </li>
                                {metadata.tags[0] && (
                                    <>
                                        <li aria-hidden="true">
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                            >
                                                <path
                                                    d="M5 2l5 5-5 5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </li>
                                        <li>#{metadata.tags[0]}</li>
                                    </>
                                )}
                            </ol>
                        </nav>

                        <div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/40">
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
                            <h1 className="mt-4 text-balance text-[28px] leading-[32px] md:text-[32px] md:leading-[35px] lg:text-[40px] lg:leading-[42px]">
                                {metadata.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col justify-end gap-4 lg:col-span-4 lg:col-start-9">
                        {metadata.description && (
                            <p className="text-lg leading-[26px] text-white/55">
                                {metadata.description}
                            </p>
                        )}
                        {metadata.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {metadata.tags.map((tag) => (
                                    <Hashtag key={tag} hashtag={tag} />
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                <div className="mb-10 h-px bg-white/10 lg:mb-20" />

                {/* Article + sidebar layout */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-[30px]">
                    {/* TOC sidebar — visible lg+. createPortal in TableOfContents
                        renders the mobile button into document.body, so it's
                        visible on mobile despite this aside being display:none. */}
                    {hasTOC && (
                        <aside className="hidden lg:col-span-3 lg:block">
                            <TableOfContents headings={headings} />
                        </aside>
                    )}

                    {/* Article column */}
                    <div className="min-w-0 lg:col-span-8 lg:col-start-5">
                        <SoundtrackProvider>
                            <article>{children}</article>
                        </SoundtrackProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}
