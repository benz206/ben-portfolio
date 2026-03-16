import type { Metadata } from "next";
import MdxLayout from "@/components/MdxLayout";
import PostViewCounter from "@/components/PostViewCounter";
import { getMDXComponents } from "@/mdx-components";
import { notFound } from "next/navigation";
import { fetchBlogPost, fetchBlogSlugs } from "@/utils/blog";

export async function generateStaticParams() {
    const slugs = await fetchBlogSlugs();
    return slugs.map((slug) => ({ slug }));
}

export const revalidate = 3600;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await fetchBlogPost(slug);

    if (!post) {
        return {
            title: "Blog - Ben's Portfolio",
            alternates: {
                canonical: `/blog/${slug}`,
            },
        };
    }

    return {
        title: `${post.metadata.title} - Ben's Portfolio`,
        description: post.metadata.description,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: post.metadata.title,
            description: post.metadata.description,
            url: `/blog/${slug}`,
            type: "article",
            publishedTime: post.metadata.created,
            modifiedTime: post.metadata.updated,
        },
        twitter: {
            card: "summary_large_image",
            title: post.metadata.title,
            description: post.metadata.description,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await fetchBlogPost(slug);
    if (!post) notFound();
    const { metadata, content, createdDate, updatedDate } = post;
    // Not a React hook, just a mapper, safe to call here
    const components = getMDXComponents({});
    const { MDXRemote } = await import("next-mdx-remote/rsc");
    const remarkGfm = (await import("remark-gfm")).default;
    const MDX = MDXRemote as any;
    return (
        <MdxLayout
            metadata={metadata}
            createdDate={createdDate}
            updatedDate={updatedDate}
            viewCounter={
                <span className="py-2 text-xs font-light lg:text-sm text-[#ececec]/70">
                    <PostViewCounter slug={slug} />
                </span>
            }
        >
            <MDX
                source={content}
                components={components as any}
                options={{
                    mdxOptions: {
                        remarkPlugins: [remarkGfm],
                    },
                }}
            />
        </MdxLayout>
    );
}
