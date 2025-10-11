// Removed animations to avoid client-only framer-motion in server component
import Link from "next/link";
import Card from "@/components/Card";
import Hashtag from "@/components/Hashtag";
import matter from "gray-matter";

type RawBlogMetadata = {
    title: string;
    description: string;
    tags: string[];
    slug: string;
    created: string;
    updated: string;
};

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
        (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
    );
    return posts;
}

export const revalidate = 3600;

export default async function BlogPage() {
    const posts = await fetchPosts();
    const formatted = posts.map((post) => ({
        ...post,
        created: new Date(post.created).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }),
        updated: new Date(post.updated).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }),
    }));

    return (
        <>
            <section className="relative flex justify-center overflow-hidden bg-[#050506] py-32 text-white">
                <div className="absolute inset-0 bg-noir-gradient" />
                <div className="absolute inset-0 bg-noir-radial opacity-70" />
                <Card
                    variant="glass"
                    ambient
                    ambientSeed="blog"
                    ambientClassName="opacity-60"
                    className="relative flex h-[300px] w-11/12 max-w-[960px] flex-col justify-center p-12"
                >
                    <span className="text-xs uppercase tracking-[0.4em] text-white/40">
                        Field notes
                    </span>
                    <h1 className="mt-4 text-4xl font-semibold lg:text-5xl">
                        Essays from the build trenches.
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm text-white/60">
                        Product breakdowns, hardware learnings, and playbooks on shipping. New posts land when the work demands a write-up.
                    </p>
                </Card>
            </section>
            <div className="flex flex-col flex-wrap content-center w-full min-h-[50vh] pt-12 pb-16 lg:pb-20 lg:pt-24 3xl:pt-12 text-white max-w-[1000px] mx-auto p-4">
                <table className="min-w-full table-auto">
                    <tbody>
                        {formatted.map((post) => (
                            <tr key={post.slug}>
                                <td className="w-2/5 px-4 py-2 text-lg font-bold text-blue-500 underline lg:text-2xl">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </td>
                                <td className="w-2/5 px-4 py-2 text-right text-md lg:text-lg">
                                    {post.tags.map((element) => (
                                        <Hashtag
                                            key={element}
                                            hashtag={element}
                                        />
                                    ))}
                                </td>
                                <td className="justify-end px-4 py-2 text-xs text-center right lg:text-lg">
                                    {post.updated}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
