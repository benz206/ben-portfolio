import {
    renderOgImage,
    OG_SIZE,
    OG_CONTENT_TYPE,
} from "@/components/og/OgImage";

export const alt = "Ben Zhou";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
    return renderOgImage({
        eyebrow: "Portfolio",
        title: "Ben Zhou",
        description:
            "I like building elegant, efficient, and scalable software.",
        chips: ["Projects", "Blog", "Gallery"],
    });
}
