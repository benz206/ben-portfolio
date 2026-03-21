import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.imgur.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.jsdelivr.net",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.scdn.co",
                pathname: "/**",
            },
        ],
    },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
