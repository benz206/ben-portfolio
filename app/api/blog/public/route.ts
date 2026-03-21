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

    let response: any;
    try {
        response = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: directoryPath,
        });
    } catch {
        return NextResponse.json([], {
            headers: {
                "Cache-Control":
                    "public, s-maxage=300, stale-while-revalidate=3600",
            },
        });
    }

    const files = Array.isArray(response.data) ? response.data : [];
    const posts: BlogPostSummary[] = await Promise.all(
        files
            .filter(
                (file: any) =>
                    typeof file?.name === "string" &&
                    file.name.endsWith(".mdx"),
            )
            .map(async (file: any) => {
                const fileResponse = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path: file.path,
                });

                const fileContent = Buffer.from(
                    (fileResponse.data as any).content,
                    "base64",
                ).toString("utf8");
                const { data } = matter(fileContent);

                let tags: string[] | undefined = undefined;
                try {
                    if (Array.isArray(data.tags)) tags = data.tags;
                    if (typeof data.tags === "string")
                        tags = data.tags
                            .split(",")
                            .map((t: string) => t.trim());
                } catch {}

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
