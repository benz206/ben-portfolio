// Removed animations to avoid client-only framer-motion in server component
import Link from "next/link";
import Card from "@/components/Card";
import Hashtag from "@/components/Hashtag";
import matter from "gray-matter";
import type { AmbientVariant } from "@/components/AmbientGradient";

type RawBlogMetadata = {
    title: string;
    description: string;
    tags: string[];
    slug: string;
    created: string;
    updated: string;
};

const ambientVariants: AmbientVariant[] = [
    "violet",
    "blue",
    "sunset",
    "emerald",
    "tangerine",
    "crimson",
    "amber",
    "aqua",
    "magenta",
    "slate",
    "indigo",
    "rose",
];

function hashString(value: string) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function selectAmbientVariant(post: RawBlogMetadata): AmbientVariant {
    const seed = `${post.slug}|${post.title}|${post.tags.join(",")}`;
    const hash = hashString(seed);
    return ambientVariants[hash % ambientVariants.length];
}

async function fetchPosts(): Promise<RawBlogMetadata[]> {
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
    } catch (error) {
        response = { data: [] } as any;
    }

    const files = Array.isArray(response.data) ? response.data : [];

    const posts: RawBlogMetadata[] = await Promise.all(
        files
            .filter((file: any) => file.name.endsWith(".mdx"))
            .map(async (file: any) => {
                const commitsResponse = await octokit.rest.repos.listCommits({
                    owner,
                    repo,
                    path: file.path,
                });

                const latestCommit = commitsResponse.data[0];
                const oldestCommit =
                    commitsResponse.data[commitsResponse.data.length - 1];

                const createdDate =
                    oldestCommit?.commit.committer?.date || null;

                const updatedDate =
                    latestCommit?.commit.committer?.date || null;

                const fileResponse = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path: file.path,
                });

                const fileContent = Buffer.from(
                    (fileResponse.data as any).content,
                    "base64"
                ).toString("utf8");

                const { data } = matter(fileContent);
                try {
                    if (data.tags && typeof data.tags === "string") {
                        data.tags = data.tags
                            .split(",")
                            .map((tag: string) => tag.trim());
                    }
                } catch {}

                return {
                    title: data.title || "Untitled",
                    description: data.description || "",
                    tags: data.tags || [],
                    created: createdDate || new Date().toISOString(),
                    updated: updatedDate || new Date().toISOString(),
                    slug: file.name.replace(".mdx", ""),
                };
            })
    );

    posts.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );
    return posts;
}

export const revalidate = 3600;

export default async function BlogPage() {
    const posts = await fetchPosts();
    const enhancedPosts = posts.map((post) => {
        const ambientVariant = selectAmbientVariant(post);
        return {
            ...post,
            createdFormatted: new Date(post.created).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            updatedFormatted: new Date(post.updated).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            ambientVariant,
        };
    });

    const [featuredPost, ...restPosts] = enhancedPosts;

    return (
        <section className="relative overflow-hidden bg-[#050506] text-white">
            <div className="absolute inset-0 bg-noir-gradient" />
            <div className="absolute inset-0 opacity-70 bg-noir-radial" />
            <div className="relative mx-auto w-11/12 max-w-[1040px] space-y-16 pb-24 pt-16 lg:pb-32 lg:pt-24">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-3">
                        <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                            My thoughts and opinions
                        </span>
                        <h1 className="text-4xl font-semibold lg:text-5xl">
                            Blog
                        </h1>
                    </div>
                    <p className="max-w-md text-sm text-white/60 sm:text-right">
                        Blog posts about my projects and experiences.
                    </p>
                </div>
                {!featuredPost ? (
                    <div className="flex flex-col justify-center items-center h-48 text-center">
                        <p className="text-lg font-semibold text-white/70">
                            No posts yet, but the notebook is open.
                        </p>
                        <p className="mt-2 text-sm text-white/50">
                            Check back soon for fresh build logs and deep dives.
                        </p>
                    </div>
                ) : (
                    <>
                        <Link
                            href={`/blog/${featuredPost.slug}`}
                            className="block group"
                        >
                            <Card
                                variant="minimal"
                                ambient
                                ambientClassName="opacity-30 group-hover:opacity-45 transition-opacity"
                                className="flex flex-col gap-8 p-10 transition-transform group-hover:-translate-y-1 md:flex-row md:items-start md:justify-between md:p-12"
                                ambientVariant={featuredPost.ambientVariant}
                            >
                                <div className="space-y-5 md:max-w-2xl">
                                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
                                        <span>Latest</span>
                                        <span className="flex-1 h-px bg-white/10" />
                                    </div>
                                    <h2 className="text-3xl font-semibold leading-snug transition-colors group-hover:text-white md:text-[2.5rem]">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-base text-white/70">
                                        {featuredPost.description || "Tap in for the full story."}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 items-start md:items-end">
                                    <time className="text-sm text-white/50" dateTime={featuredPost.updated}>
                                        Updated {featuredPost.updatedFormatted}
                                    </time>
                                    <div className="flex flex-wrap gap-2">
                                        {featuredPost.tags.map((tag) => (
                                            <Hashtag key={tag} hashtag={tag} />
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        {restPosts.length > 0 && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center text-white/60">
                                    <h3 className="text-sm uppercase tracking-[0.35em]">
                                        Archive
                                    </h3>
                                    <span className="w-24 h-px bg-white/10" />
                                </div>
                                <div className="grid gap-8 md:grid-cols-2">
                                    {restPosts.map((post) => (
                                        <Link
                                            key={post.slug}
                                            href={`/blog/${post.slug}`}
                                            className="block group"
                                        >
                                            <Card
                                                variant="minimal"
                                                ambient
                                                ambientClassName="opacity-20 group-hover:opacity-40 transition-opacity"
                                                className="flex flex-col gap-6 p-8 h-full transition-transform group-hover:-translate-y-1"
                                                ambientVariant={post.ambientVariant}
                                            >
                                                <div className="space-y-3">
                                                    <time className="text-xs uppercase tracking-[0.2em] text-white/40" dateTime={post.updated}>
                                                        {post.updatedFormatted}
                                                    </time>
                                                    <h4 className="text-2xl font-semibold text-white transition-colors group-hover:text-blue-100">
                                                        {post.title}
                                                    </h4>
                                                    <p className="text-sm text-white/60">
                                                        {post.description || "Read the full entry."}
                                                    </p>
                                                </div>
                                                {post.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 text-sm text-white/60">
                                                        {post.tags.map((tag) => (
                                                            <Hashtag key={tag} hashtag={tag} />
                                                        ))}
                                                    </div>
                                                )}
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
