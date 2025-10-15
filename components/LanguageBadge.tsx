import { AmbientGradient, palettes } from "@/components/AmbientGradient";
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

    return (
        <span
            className={cn(
                "relative flex items-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white/80",
                className
            )}
        >
            <AmbientGradient
                className="opacity-70"
                seed={label}
                palette={palette}
            />
            <span className="relative z-10">{label}</span>
        </span>
    );
}
