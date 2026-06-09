import { NextResponse } from "next/server";
import matter from "gray-matter";

type BlogPostSummary = {
    slug: string;
    title: string;
    description?: string;
    tags?: string[];
};

export async function GET() {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.BLOG_PAT });
    const owner = "benz206";
    const repo = "blog";
    const directoryPath = "posts";

    let files: { name: string; path: string }[] = [];
    try {
        const response = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: directoryPath,
        });
        files = Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Failed to list blog posts", error);
        return NextResponse.json([], {
            headers: {
                "Cache-Control":
                    "public, s-maxage=300, stale-while-revalidate=3600",
            },
        });
    }

    const posts: BlogPostSummary[] = await Promise.all(
        files
            .filter((file) => file.name.endsWith(".mdx"))
            .map(async (file) => {
                const fileResponse = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path: file.path,
                });

                const rawContent =
                    !Array.isArray(fileResponse.data) &&
                    "content" in fileResponse.data
                        ? fileResponse.data.content
                        : "";
                const fileContent = Buffer.from(rawContent, "base64").toString(
                    "utf8",
                );
                const { data } = matter(fileContent);

                let tags: string[] | undefined = undefined;
                if (Array.isArray(data.tags)) tags = data.tags;
                if (typeof data.tags === "string")
                    tags = data.tags.split(",").map((t: string) => t.trim());

                return {
                    slug: file.name.replace(".mdx", ""),
                    title:
                        typeof data.title === "string"
                            ? data.title
                            : "Untitled",
                    description:
                        typeof data.description === "string"
                            ? data.description
                            : undefined,
                    tags,
                };
            }),
    );

    posts.sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json(posts, {
        headers: {
            "Cache-Control":
                "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
