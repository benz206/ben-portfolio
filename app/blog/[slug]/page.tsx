import matter from "gray-matter";
import MdxLayout from "@/components/MdxLayout";
import PostViewCounter from "@/components/PostViewCounter";
import { getMDXComponents } from "@/mdx-components";

type RawBlogMetadata = {
    title: string;
    description: string;
    tags: string[];
    slug: string;
    created: string;
    updated: string;
};

async function fetchSlugs(): Promise<string[]> {
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

async function fetchPost(slug: string) {
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth: process.env.BLOG_PAT });
    const owner = "benz206";
    const repo = "blog";
    const filePath = `posts/${slug}.mdx`;

    const fileResponse = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
    });
    const fileContent = Buffer.from(
        (fileResponse.data as any).content,
        "base64"
    ).toString("utf8");
    const { data, content } = matter(fileContent);

    const commitsResponse = await octokit.rest.repos.listCommits({
        owner,
        repo,
        path: filePath,
    });
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
        createdDate: createdDate
            ? new Date(createdDate).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
            : "",
        updatedDate: updatedDate
            ? new Date(updatedDate).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
            : "",
    };
}

export const revalidate = 3600;

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { metadata, content, createdDate, updatedDate } = await fetchPost(
        slug
    );
    // Not a React hook, just a mapper, safe to call here
    const components = getMDXComponents({});
    const { MDXRemote } = await import("next-mdx-remote/rsc");
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
            <MDX source={content} components={components as any} />
        </MdxLayout>
    );
}
