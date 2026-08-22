import { fetchBlogPost, fetchBlogSlugs } from "@/utils/blog";
import {
    renderOgImage,
    OG_SIZE,
    OG_CONTENT_TYPE,
} from "@/components/og/OgImage";

export async function generateStaticParams() {
    const slugs = await fetchBlogSlugs();
    return slugs.map((slug) => ({ slug }));
}

export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await fetchBlogPost(slug);

    return renderOgImage({
        eyebrow: post ? `Blog · ${post.createdDate}` : "Blog",
        title: post?.metadata.title ?? "Blog",
        description: post?.metadata.description,
        chips: post?.metadata.tags ?? [],
    });
}
