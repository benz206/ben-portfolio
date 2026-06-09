import matter from "gray-matter";
import type { Octokit } from "@octokit/rest" with { "resolution-mode": "import" };
import { formatDate } from "@/utils/format";
import type { RawBlogMetadata } from "@/types";

export type { RawBlogMetadata };

const BLOG_OWNER = "benz206";
const BLOG_REPO = "blog";
const BLOG_POSTS_DIR = "posts";
const SLUG_PATTERN = /^[a-zA-Z0-9-]+$/;

let octokitPromise: Promise<Octokit> | null = null;

async function getOctokit(): Promise<Octokit> {
    if (!octokitPromise) {
        octokitPromise = import("@octokit/rest").then(
            ({ Octokit }) =>
                new Octokit(
                    process.env.BLOG_PAT ? { auth: process.env.BLOG_PAT } : {},
                ),
        );
    }
    return octokitPromise;
}

function normalizeTags(tags: unknown): string[] {
    if (Array.isArray(tags))
        return tags.filter((t) => typeof t === "string") as string[];
    if (typeof tags === "string")
        return tags
            .split(",")
            .flatMap((t) => (t.trim() ? [t.trim()] : []));
    return [];
}

async function getRepoFileContent(path: string): Promise<string | null> {
    const octokit = await getOctokit();
    try {
        const res = await octokit.rest.repos.getContent({
            owner: BLOG_OWNER,
            repo: BLOG_REPO,
            path,
        });
        if (Array.isArray(res.data) || !("content" in res.data)) return null;
        const content = res.data.content;
        if (!content || typeof content !== "string") return null;
        return Buffer.from(content, "base64").toString("utf8");
    } catch (error) {
        console.error(`Failed to fetch blog file ${path}`, error);
        return null;
    }
}

async function getCommitDates(
    path: string,
): Promise<{ created: string | null; updated: string | null }> {
    const octokit = await getOctokit();
    try {
        const commitsResponse = await octokit.rest.repos.listCommits({
            owner: BLOG_OWNER,
            repo: BLOG_REPO,
            path,
        });
        const latestCommit = commitsResponse.data[0] ?? null;
        const oldestCommit =
            commitsResponse.data[commitsResponse.data.length - 1] ?? null;
        return {
            created: oldestCommit?.commit.committer?.date ?? null,
            updated: latestCommit?.commit.committer?.date ?? null,
        };
    } catch (error) {
        console.error(`Failed to fetch commit dates for ${path}`, error);
        return { created: null, updated: null };
    }
}

export async function fetchBlogSlugs(): Promise<string[]> {
    const octokit = await getOctokit();
    try {
        const response = await octokit.rest.repos.getContent({
            owner: BLOG_OWNER,
            repo: BLOG_REPO,
            path: BLOG_POSTS_DIR,
        });
        const files = Array.isArray(response.data) ? response.data : [];
        return files.flatMap((f) =>
            f.name.endsWith(".mdx") ? [f.name.replace(".mdx", "")] : [],
        );
    } catch (error) {
        console.error("Failed to list blog posts", error);
        return [];
    }
}

export async function fetchBlogPosts(): Promise<RawBlogMetadata[]> {
    const octokit = await getOctokit();
    let files: { name: string; path: string }[] = [];
    try {
        const response = await octokit.rest.repos.getContent({
            owner: BLOG_OWNER,
            repo: BLOG_REPO,
            path: BLOG_POSTS_DIR,
        });
        files = Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Failed to list blog posts", error);
    }

    const posts: RawBlogMetadata[] = await Promise.all(
        files.flatMap((file) =>
            file.name.endsWith(".mdx")
                ? [
                      (async () => {
                          const [{ created, updated }, fileContent] =
                              await Promise.all([
                                  getCommitDates(file.path),
                                  getRepoFileContent(file.path),
                              ]);
                          const { data } = matter(fileContent ?? "");

                          return {
                              title: data.title || "Untitled",
                              description: data.description || "",
                              tags: normalizeTags(data.tags),
                              created: created || new Date().toISOString(),
                              updated: updated || new Date().toISOString(),
                              slug: file.name.replace(".mdx", ""),
                          };
                      })(),
                  ]
                : [],
        ),
    );

    posts.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );
    return posts;
}

export async function fetchBlogPost(slug: string): Promise<{
    metadata: RawBlogMetadata;
    content: string;
    createdDate: string;
    updatedDate: string;
} | null> {
    if (!SLUG_PATTERN.test(slug)) return null;
    const filePath = `${BLOG_POSTS_DIR}/${slug}.mdx`;
    const fileContent = await getRepoFileContent(filePath);
    if (!fileContent) return null;

    const { data, content } = matter(fileContent);
    const { created, updated } = await getCommitDates(filePath);

    const metadata: RawBlogMetadata = {
        title: data.title,
        description: data.description,
        tags: normalizeTags(data.tags),
        slug,
        created: created || new Date().toISOString(),
        updated: updated || new Date().toISOString(),
    };

    return {
        metadata,
        content,
        createdDate: formatDate(created, { year: "numeric", month: "long", day: "numeric" }, "en-CA") ?? "",
        updatedDate: formatDate(updated, { year: "numeric", month: "long", day: "numeric" }, "en-CA") ?? "",
    };
}
