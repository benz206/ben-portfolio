import matter from "gray-matter";

export type RawBlogMetadata = {
    title: string;
    description: string;
    tags: string[];
    slug: string;
    created: string;
    updated: string;
};

const BLOG_OWNER = "benz206";
const BLOG_REPO = "blog";
const BLOG_POSTS_DIR = "posts";

async function getOctokit() {
    const g = globalThis as any;
    if (!g.__blogOctokitPromise) {
        g.__blogOctokitPromise = import("@octokit/rest").then(
            ({ Octokit }: any) => new Octokit({ auth: process.env.BLOG_PAT })
        ) as Promise<any>;
    }
    return g.__blogOctokitPromise as Promise<any>;
}

function normalizeTags(tags: unknown): string[] {
    if (Array.isArray(tags)) return tags.filter((t) => typeof t === "string") as string[];
    if (typeof tags === "string") return tags.split(",").map((t) => t.trim()).filter(Boolean);
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
        const content = (res.data as any)?.content;
        if (!content || typeof content !== "string") return null;
        return Buffer.from(content, "base64").toString("utf8");
    } catch {
        return null;
    }
}

async function getCommitDates(path: string): Promise<{ created: string | null; updated: string | null }> {
    const octokit = await getOctokit();
    try {
        const commitsResponse = await octokit.rest.repos.listCommits({
            owner: BLOG_OWNER,
            repo: BLOG_REPO,
            path,
        });
        const latestCommit = commitsResponse.data[0] ?? null;
        const oldestCommit = commitsResponse.data[commitsResponse.data.length - 1] ?? null;
        return {
            created: oldestCommit?.commit.committer?.date ?? null,
            updated: latestCommit?.commit.committer?.date ?? null,
        };
    } catch {
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
        return files
            .filter((f: any) => typeof f?.name === "string" && f.name.endsWith(".mdx"))
            .map((f: any) => f.name.replace(".mdx", ""));
    } catch {
        return [];
    }
}

export async function fetchBlogPosts(): Promise<RawBlogMetadata[]> {
    const octokit = await getOctokit();
    let response: any;
    try {
        response = await octokit.rest.repos.getContent({
            owner: BLOG_OWNER,
            repo: BLOG_REPO,
            path: BLOG_POSTS_DIR,
        });
    } catch {
        response = { data: [] } as any;
    }

    const files = Array.isArray(response.data) ? response.data : [];

    const posts: RawBlogMetadata[] = await Promise.all(
        files
            .filter((file: any) => typeof file?.name === "string" && file.name.endsWith(".mdx"))
            .map(async (file: any) => {
                const path = file.path as string;
                const { created, updated } = await getCommitDates(path);
                const fileContent = await getRepoFileContent(path);
                const { data } = matter(fileContent ?? "");

                return {
                    title: data.title || "Untitled",
                    description: data.description || "",
                    tags: normalizeTags(data.tags),
                    created: created || new Date().toISOString(),
                    updated: updated || new Date().toISOString(),
                    slug: (file.name as string).replace(".mdx", ""),
                };
            })
    );

    posts.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );
    return posts;
}

export async function fetchBlogPost(slug: string): Promise<{
    metadata: RawBlogMetadata;
    content: string;
    createdDate: string;
    updatedDate: string;
} | null> {
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
        createdDate: created
            ? new Date(created).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
            : "",
        updatedDate: updated
            ? new Date(updated).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
            : "",
    };
}


