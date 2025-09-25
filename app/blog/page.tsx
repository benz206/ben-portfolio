// Removed animations to avoid client-only framer-motion in server component
import Link from "next/link";
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
    const { Octokit } = await import("octokit");
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
            <div className="relative top-0 flex justify-center w-full h-[550px] bg-rainbow-gradient animate-breathing-gradient">
                <div className="relative flex h-[370px] lg:h-[300px] card-hero w-11/12 lg:w-[1000px] mt-32 lg:mt-40">
                    <div className="flex flex-col justify-center w-full h-full p-12">
                        <h2 className="p-2 text-lg text-center">
                            SOME OF MY THOUGHTS AND EXPERIENCES
                        </h2>
                        <h1 className="p-2 text-4xl font-black text-center lg:text-6xl">
                            BLOG
                        </h1>
                        <p className="p-2 py-5 font-light">
                            Welcome to my blog! Here you&apos;ll find some of my
                            thoughts and experiences that I&apos;ve had over the
                            years.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-wrap content-center w-full min-h-[50vh] pt-12 pb-16 lg:pb-20 lg:pt-24 3xl:pt-12 dark:text-[#ececec] max-w-[1000px] mx-auto p-4">
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
