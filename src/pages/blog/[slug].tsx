import matter from "gray-matter";
import MdxLayout from "@/components/MdxLayout";
import { RawBlogMetadata } from "@/types";
import { useMDXComponents } from "@/mdx-components";
import type { MDXComponents } from "mdx/types";
import { useState, useEffect } from "react";

interface Props {
    mdxSource: any;
    metadata: RawBlogMetadata;
    createdDate: string;
    updatedDate: string;
}

export default function RemoteMdxPage({
    mdxSource,
    metadata,
    createdDate,
    updatedDate,
}: Props) {
    const [MDXRemote, setMDXRemote] = useState<any>(null);
    const customMDXComponents: MDXComponents = useMDXComponents({});

    useEffect(() => {
        const loadMDXRemote = async () => {
            try {
                const { MDXRemote: MDXRemoteComponent } = await import(
                    "next-mdx-remote"
                );
                setMDXRemote(() => MDXRemoteComponent);
            } catch (error) {
                console.error("Failed to load MDXRemote component:", error);
            }
        };

        loadMDXRemote();
    }, []);

    if (!MDXRemote) {
        return (
            <MdxLayout
                metadata={metadata}
                createdDate={createdDate}
                updatedDate={updatedDate}
            >
                <div>Loading...</div>
            </MdxLayout>
        );
    }

    return (
        <MdxLayout
            metadata={metadata}
            createdDate={createdDate}
            updatedDate={updatedDate}
        >
            <MDXRemote {...mdxSource} components={customMDXComponents} />
        </MdxLayout>
    );
}
export async function getStaticPaths() {
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
        console.error("Error fetching content for paths:", error);
        response = { data: [] };
    }

    const files = Array.isArray(response.data) ? response.data : [];

    const paths = files
        .filter((file: any) => file.name.endsWith(".mdx"))
        .map((file: any) => ({
            params: { slug: file.name.replace(".mdx", "") },
        }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const { Octokit } = await import("octokit");
    const octokit = new Octokit({ auth: process.env.BLOG_PAT });
    const owner = "benz206";
    const repo = "blog";
    const filePath = `posts/${slug}.mdx`;

    let fileResponse;
    try {
        fileResponse = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: filePath,
        });
    } catch (error) {
        console.error("Error fetching file content:", error);
        throw new Error("Failed to fetch blog post content.");
    }

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

    const { serialize } = await import("next-mdx-remote/serialize");
    const mdxSource = await serialize(content);

    if (data.tags && typeof data.tags === "string") {
        data.tags = data.tags.split(",").map((tag: string) => tag.trim());
    } else {
        data.tags = [];
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
        props: {
            mdxSource,
            metadata,
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
        },
    };
}
