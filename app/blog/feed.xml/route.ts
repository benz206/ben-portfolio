import { fetchBlogPosts } from "@/utils/blog";

export const revalidate = 3600;

const SITE_URL = "https://bzhou.ca";
const FEED_TITLE = "Ben Zhou — Blog";
const FEED_DESCRIPTION = "Blog posts about my projects and experiences.";

const XML_ENTITIES: Record<string, string> = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
};

function escapeXml(value: string) {
    return value.replace(/[<>&'"]/g, (char) => XML_ENTITIES[char]);
}

export async function GET() {
    const posts = await fetchBlogPosts();

    const items = posts.map((post) => {
        const url = `${SITE_URL}/blog/${post.slug}`;
        const categories = post.tags.map(
            (tag) => `            <category>${escapeXml(tag)}</category>`,
        );

        return [
            "        <item>",
            `            <title>${escapeXml(post.title)}</title>`,
            `            <link>${url}</link>`,
            `            <guid isPermaLink="true">${url}</guid>`,
            `            <description>${escapeXml(post.description)}</description>`,
            `            <pubDate>${new Date(post.created).toUTCString()}</pubDate>`,
            ...categories,
            "        </item>",
        ].join("\n");
    });

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "    <channel>",
        `        <title>${escapeXml(FEED_TITLE)}</title>`,
        `        <link>${SITE_URL}/blog</link>`,
        `        <description>${escapeXml(FEED_DESCRIPTION)}</description>`,
        "        <language>en</language>",
        `        <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />`,
        ...items,
        "    </channel>",
        "</rss>",
    ].join("\n");

    return new Response(xml, {
        headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
}
