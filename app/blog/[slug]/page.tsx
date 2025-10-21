import matter from "gray-matter";
import { notFound } from "next/navigation";
import { cache } from "react";
import MdxLayout from "@/components/MdxLayout";
import { getMDXComponents } from "@/mdx-components";
import type { RawBlogMetadata } from "@/types";

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
});

async function fetchSlugs(): Promise<string[]> {
    const octokit = await client();
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
        return [];
    }
    const files = Array.isArray(response.data) ? response.data : [];
    return files
        .filter((f: any) => f.name.endsWith(".mdx"))
        .map((f: any) => f.name.replace(".mdx", ""));
}

export async function generateStaticParams() {
    const slugs = await fetchSlugs();
    return slugs.map((slug) => ({ slug }));
}

const client = cache(async () => {
    const { Octokit } = await import("@octokit/rest");
    return new Octokit({ auth: process.env.BLOG_PAT });
});

async function fetchPost(slug: string) {
    const octokit = await client();
    const owner = "benz206";
    const repo = "blog";
    const filePath = `posts/${slug}.mdx`;

    let fileResponse: any;
    try {
        fileResponse = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: filePath,
        });
    } catch {
        return null;
    }
    const fileContent = Buffer.from(
        (fileResponse.data as any).content,
        "base64"
    ).toString("utf8");
    const { data, content } = matter(fileContent);

    let commitsResponse: any;
    try {
        commitsResponse = await octokit.rest.repos.listCommits({
            owner,
            repo,
            path: filePath,
        });
    } catch {
        commitsResponse = { data: [] };
    }
    const latestCommit = commitsResponse.data[0];
    const oldestCommit = commitsResponse.data[commitsResponse.data.length - 1];

    const createdDate = oldestCommit?.commit.committer?.date || null;
    const updatedDate = latestCommit?.commit.committer?.date || null;

    if (data.tags && typeof data.tags === "string") {
        data.tags = data.tags.split(",").map((t: string) => t.trim());
    }

    const metadata: RawBlogMetadata = {
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        slug,
        created: createdDate || new Date().toISOString(),
        updated: updatedDate || new Date().toISOString(),
    };

    return {
        metadata,
        content,
        createdDate: createdDate || new Date().toISOString(),
        updatedDate: updatedDate || new Date().toISOString(),
    };
}

export const revalidate = 3600;

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;
    const post = await fetchPost(slug);
    if (!post) {
        notFound();
    }
    const { metadata, content, createdDate, updatedDate } = post;
    // Not a React hook, just a mapper, safe to call here
    const components = getMDXComponents({});
    const { MDXRemote } = await import("next-mdx-remote/rsc");
    const MDX = MDXRemote as any;
    return (
        <MdxLayout
            metadata={metadata}
            createdDate={dateFormatter.format(new Date(createdDate))}
            updatedDate={dateFormatter.format(new Date(updatedDate))}
        >
            <MDX source={content} components={components as any} />
        </MdxLayout>
    );
}
