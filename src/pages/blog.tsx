import Head from "next/head";
import { motion } from "framer-motion";
import { BlogMetadata, RawBlogMetadata } from "@/types";
import Link from "next/link";
import Hashtag from "@/components/Hashtag";
import matter from "gray-matter";

export async function getStaticProps() {
    const { Octokit } = await import("octokit");
    const octokit = new Octokit({ auth: process.env.BLOG_PAT });
    const owner = "benz206";
    const repo = "blog";
    const directoryPath = "posts";

    let response;
    try {
        response = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: directoryPath,
        });
    } catch (error) {
        console.error("Error fetching content from GitHub:", error);
        response = { data: [] };
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
                } catch (error) {
                    console.error("Error parsing tags:", error);
                }

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
    return {
        props: {
            posts,
        },
    };
}

export default function Blog({ posts }: { posts: BlogMetadata[] }) {
    posts.forEach((post) => {
        post.created = new Date(post.created).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
        post.updated = new Date(post.updated).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    });
    return (
        <>
            <Head>
                <title>Ben&apos;s Blog</title>
                <meta name="theme-color" content="#339ccd" />
                <meta property="og:title" content="Ben's Blog" />
                <meta
                    property="og:description"
                    content="Ben's Projects Page."
                />
                <meta property="description" content="Ben's Blog Page." />
                <meta
                    property="og:image"
                    content="https://i.imgur.com/6KdqAaf.png"
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://bzhou.ca/blog" />
                <meta
                    name="description"
                    content="Ben's Blog page, view some of my thoughts and experiences!"
                />
            </Head>
            <div className="relative top-0 flex justify-center w-full h-[550px] bg-rainbow-gradient animate-breathing-gradient">
                <motion.div
                    className="relative flex h-[370px] lg:h-[300px] card-hero w-11/12 lg:w-[1000px] mt-32 lg:mt-40"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
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
                            years. I hope you enjoy reading them as much as I
                            enjoyed writing them!
                        </p>
                    </div>
                </motion.div>
            </div>
            <div className="flex flex-col flex-wrap content-center w-full min-h-[50vh] pt-12 pb-16 lg:pb-20 lg:pt-24 3xl:pt-12 dark:text-[#ececec] max-w-[1000px] mx-auto p-4">
                <table className="min-w-full table-auto">
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.slug}>
                                <td className="w-2/5 px-4 py-2 text-lg font-bold text-blue-500 underline lg:text-2xl">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        prefetch={false}
                                    >
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
