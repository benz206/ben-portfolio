"use client";

import { useEffect, useState } from "react";

type Language = {
    [key: string]: number;
};

const tags = [
    { name: "Python", colour: "bg-blue-500" },
    { name: "CSS", colour: "bg-purple-500" },
    { name: "C++", colour: "bg-yellow-400" },
    { name: "GDScript", colour: "bg-slate-800" },
    { name: "Svelte", colour: "bg-[#ff3e00]" },
    { name: "C", colour: "bg-gray-500" },
    { name: "Java", colour: "bg-red-500" },
    { name: "Rust", colour: "bg-[#CE412B]" },
    { name: "TypeScript", colour: "bg-[#007acc]" },
    { name: "HTML", colour: "bg-emerald-500" },
    { name: "JavaScript", colour: "bg-[#f0db4f]" },
    { name: "React", colour: "bg-[#61dafb]" },
    { name: "Next.js", colour: "bg-[#000000]" },
    { name: "MongoDB", colour: "bg-[#00ed64]" },
    { name: "Node.js", colour: "bg-[#68a063]" },
    { name: "Redis", colour: "bg-[#dc382d]" },
    { name: "TailwindCSS", colour: "bg-[#0ea5e9]" },
    { name: "MySQL", colour: "bg-[#00758f]" },
    { name: "SQLite", colour: "bg-[#003b57]" },
    { name: "PostgreSQL", colour: "bg-[#336791]" },
    { name: "Firebase", colour: "bg-[#ffca28]" },
    { name: "Vercel", colour: "bg-[#000000]" },
];

export default function LanguageBar({ repo }: { repo: string }) {
    const [languages, setLanguages] = useState<Language>({});

    const fetchWithCache = async (
        url: string,
        cacheKey: string
    ): Promise<Language> => {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            const now = new Date().getTime();
            if (now - timestamp < 24 * 60 * 60 * 1000) {
                return data;
            }
        }

        const response = await fetch(url);
        const data = await response.json();

        localStorage.setItem(
            cacheKey,
            JSON.stringify({
                data,
                timestamp: new Date().getTime(),
            })
        );

        return data;
    };

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const data = await fetchWithCache(
                    `https://api.github.com/repos/benz206/${repo}/languages`,
                    `github_languages_${repo}`
                );
                setLanguages(data);
            } catch (error) {
                console.error("Error fetching language data:", error);
            }
        };

        fetchLanguages();
    }, [repo]);

    const total = Object.values(languages).reduce((acc, curr) => acc + curr, 0);

    return (
        <div className="flex overflow-hidden w-full h-2 rounded-lg">
            {Object.entries(languages).map(([language, count]) => {
                const tag = tags.find((tag) => tag.name === language);
                const percentage = (count / total) * 100;

                return (
                    <div
                        key={language}
                        className={`${tag?.colour} h-2`}
                        style={{
                            width: `${percentage}%`,
                        }}
                    />
                );
            })}
        </div>
    );
}
