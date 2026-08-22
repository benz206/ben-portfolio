import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BACKGROUND = [
    "radial-gradient(circle at 18% 18%, rgba(98,106,255,0.26), transparent 55%)",
    "radial-gradient(circle at 82% 8%, rgba(255,122,225,0.22), transparent 48%)",
    "radial-gradient(circle at 28% 88%, rgba(82,217,184,0.18), transparent 55%)",
    "linear-gradient(140deg, #090b10 0%, #06070c 45%, #020305 100%)",
].join(", ");

function truncate(value: string, limit: number) {
    return value.length > limit ? `${value.slice(0, limit - 1).trimEnd()}…` : value;
}

export function renderOgImage({
    eyebrow,
    title,
    description,
    chips = [],
}: {
    eyebrow: string;
    title: string;
    description?: string;
    chips?: string[];
}) {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 80,
                    backgroundImage: BACKGROUND,
                    backgroundColor: "#020305",
                    color: "#ffffff",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 24,
                        letterSpacing: 8,
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.45)",
                    }}
                >
                    {eyebrow}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div
                        style={{
                            display: "flex",
                            fontSize: title.length > 44 ? 64 : 82,
                            lineHeight: 1.1,
                            letterSpacing: -2,
                        }}
                    >
                        {truncate(title, 90)}
                    </div>
                    {description ? (
                        <div
                            style={{
                                display: "flex",
                                fontSize: 30,
                                lineHeight: 1.4,
                                color: "rgba(255,255,255,0.62)",
                            }}
                        >
                            {truncate(description, 150)}
                        </div>
                    ) : null}
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", gap: 12 }}>
                        {chips.slice(0, 4).map((chip) => (
                            <div
                                key={chip}
                                style={{
                                    display: "flex",
                                    padding: "10px 22px",
                                    borderRadius: 999,
                                    fontSize: 22,
                                    color: "rgba(255,255,255,0.72)",
                                    background: "rgba(255,255,255,0.07)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                }}
                            >
                                {chip}
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 24,
                            color: "rgba(255,255,255,0.4)",
                        }}
                    >
                        bzhou.ca
                    </div>
                </div>
            </div>
        ),
        OG_SIZE,
    );
}
