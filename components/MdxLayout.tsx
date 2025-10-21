import Link from "next/link";
import Hashtag from "@/components/Hashtag";
import { AmbientGradient } from "@/components/AmbientGradient";
import { RawBlogMetadata } from "@/types";

export default function MdxLayout({
    children,
    metadata,
    createdDate,
    updatedDate,
}: {
    children: React.ReactNode;
    metadata: RawBlogMetadata;
    createdDate: string;
    updatedDate: string;
}) {
    return (
        <section className="relative overflow-hidden text-white noir-strip">
            <AmbientGradient className="absolute inset-0 opacity-25" seed={metadata.slug} />
            <div className="relative mx-auto w-11/12 max-w-[1040px] space-y-16 pb-24 pt-20 lg:pb-32 lg:pt-28">
                <div className="flex flex-col gap-4">
                    <Link
                        href="/blog"
                        className="text-xs uppercase tracking-[0.35em] text-white/40 hover:text-white/70 transition-colors"
                    >
                        Back to Blog
                    </Link>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs uppercase tracking-[0.35em] text-white/40">
                                Blog Entry
                            </span>
                            <h1 className="text-4xl font-semibold leading-tight lg:text-[2.75rem]">
                                {metadata.title}
                            </h1>
                        </div>
                        <p className="text-base text-white/70 max-w-2xl">
                            {metadata.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                            <span>Created {createdDate}</span>
                            <span className="w-4 h-[1px] bg-white/20" />
                            <span>Updated {updatedDate}</span>
                            {metadata.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {metadata.tags.map((tag) => (
                                        <Hashtag key={tag} hashtag={tag} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <article className="relative mx-auto w-full max-w-3xl space-y-8 text-base leading-7 text-white/70">
                    {children}
                </article>
            </div>
        </section>
    );
}
