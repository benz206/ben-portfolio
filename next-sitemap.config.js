/** @type {import('next-sitemap').IConfig} */

async function getBlogSlugs() {
    try {
        const { Octokit } = await import("@octokit/rest");
        const octokit = new Octokit({ auth: process.env.BLOG_PAT });
        const owner = "benz206";
        const repo = "blog";
        const directoryPath = "posts";

        const response = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: directoryPath,
        });

        const files = Array.isArray(response.data) ? response.data : [];
        return files
            .filter(
                (f) => typeof f?.name === "string" && f.name.endsWith(".mdx"),
            )
            .map((f) => f.name.replace(/\.mdx$/, ""));
    } catch {
        return [];
    }
}

module.exports = {
    siteUrl: "https://bzhou.ca",
    generateRobotsTxt: false,
    additionalPaths: async (config) => {
        const slugs = await getBlogSlugs();
        const paths = await Promise.all(
            slugs.map((slug) => config.transform(config, `/blog/${slug}`)),
        );
        return paths;
    },
};
