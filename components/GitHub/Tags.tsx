type Tag = {
    name: string;
    colour: string;
};

export const tags: Tag[] = [
    // Languages
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
    // Frameworks/Misc
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

export default function Tags(props: { rawTags: string[] }) {
    return (
        <div className="flex flex-wrap items-center w-full gap-2">
            {props.rawTags.map((tag) => {
                const tagObj = tags.find((t) => t.name === tag);
                return (
                    <span
                        key={tag}
                        className={`px-2 py-1 text-sm font-semibold rounded-md ${tagObj?.colour} text-white`}
                    >
                        {tag}
                    </span>
                );
            })}
        </div>
    );
}
