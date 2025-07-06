const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.imgur.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.jsdelivr.net",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.scdn.co",
                port: "",
                pathname: "/**",
            },
        ],
    },
    webpack(config) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };
        return config;
    },
};

module.exports = withMDX(nextConfig);
