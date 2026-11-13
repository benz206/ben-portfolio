import type { Metadata } from "next";
import MdxLayout from "@/components/MdxLayout";
import ViewCount from "@/components/ViewCount";
import { getMDXComponents } from "@/mdx-components";
import { notFound } from "next/navigation";
import { fetchBlogPost, fetchBlogSlugs } from "@/utils/blog";
import { extractHeadings } from "@/utils/slugify";

const PROJECTS_DIR = "projects";

export async function generateStaticParams() {
    const slugs = await fetchBlogSlugs(PROJECTS_DIR);
    return slugs.map((slug) => ({ slug }));
}

export const revalidate = 3600;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await fetchBlogPost(slug, PROJECTS_DIR);
    if (!post) return { title: "Projects - Ben's Portfolio" };

    return {
        title: `${post.metadata.title} - Ben's Portfolio`,
        description: post.metadata.description,
        alternates: {
            canonical: `/projects/${slug}`,
        },
    };
}

export default async function ProjectWriteupPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await fetchBlogPost(slug, PROJECTS_DIR);
    if (!post) notFound();
    const { metadata, content, createdDate, updatedDate } = post;
    const components = getMDXComponents({});
    const { MDXRemote } = await import("next-mdx-remote/rsc");
    const remarkGfm = (await import("remark-gfm")).default;
    const MDX = MDXRemote as any;

    return (
        <MdxLayout
            metadata={metadata}
            createdDate={createdDate}
            updatedDate={updatedDate}
            viewCounter={<ViewCount slug={`project-${slug}`} method="POST" />}
            headings={extractHeadings(content)}
            section={{ href: "/projects", label: "Projects" }}
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
