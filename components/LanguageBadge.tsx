import { palettes } from "@/components/AmbientGradient";
import { cn } from "@/utils/cn";

type PaletteKey = keyof typeof palettes;

const languageVariants: Record<
    string,
    {
        label: string;
        palette: PaletteKey;
    }
> = {
    javascript: { label: "JavaScript", palette: "sunrise" },
    typescript: { label: "TypeScript", palette: "lagoon" },
    "next.js": { label: "Next.js", palette: "dusk" },
    nextjs: { label: "Next.js", palette: "dusk" },
    tailwind: { label: "Tailwind", palette: "mint" },
    "tailwind css": { label: "Tailwind", palette: "mint" },
    react: { label: "React", palette: "aurora" },
    mongo: { label: "MongoDB", palette: "mint" },
    mongodb: { label: "MongoDB", palette: "mint" },
    supabase: { label: "Supabase", palette: "lagoon" },
    firebase: { label: "Firebase", palette: "sunrise" },
    python: { label: "Python", palette: "aurum" },
    "c++": { label: "C++", palette: "dusk" },
    c: { label: "C", palette: "dusk" },
    graphql: { label: "GraphQL", palette: "candy" },
    figma: { label: "Figma", palette: "aurora" },
    git: { label: "Git", palette: "peach" },
    "google cloud": { label: "Google Cloud", palette: "sundown" },
    "cloudflare workers": { label: "Cloudflare Workers", palette: "sundown" },
    "discord api": { label: "Discord API", palette: "aurora" },
    "google sheets": { label: "Google Sheets", palette: "sunrise" },
    openai: { label: "OpenAI", palette: "grape" },
    arduino: { label: "Arduino", palette: "sunrise" },
    embedded: { label: "Embedded", palette: "peach" },
    sphinx: { label: "Sphinx", palette: "sunrise" },
    html: { label: "HTML", palette: "sunrise" },
    css: { label: "CSS", palette: "aurora" },
    google: { label: "Google", palette: "sunrise" },
    sap: { label: "SAP", palette: "aurum" },
};

interface LanguageBadgeProps {
    language: string;
    className?: string;
}

export default function LanguageBadge({
    language,
    className = "",
}: LanguageBadgeProps) {
    const key = language.toLowerCase();
    const variant = languageVariants[key];
    const label = variant?.label ?? language;
    const palette = variant?.palette ?? "mint";
    const paletteColors = palettes[palette];
    const gradientBackground = `linear-gradient(135deg, ${paletteColors[0]} 0%, ${paletteColors[1]} 45%, ${paletteColors[2]} 100%)`;

    return (
        <span
            className={cn(
                "inline-flex relative justify-center items-center",
                className,
            )}
        >
            <span
                className="pointer-events-none absolute -inset-1 rounded-md opacity-30 blur-lg"
                style={{ backgroundImage: gradientBackground }}
                aria-hidden
            />
            <span
                className="relative inline-flex items-center justify-center rounded-md p-[1.5px]"
                style={{ backgroundImage: gradientBackground }}
            >
                <span className="relative inline-flex items-center justify-center rounded-1 bg-[#050a18]/90 px-2 py-1 text-[10px] uppercase text-white/95">
                    {label}
                </span>
            </span>
        </span>
    );
}
