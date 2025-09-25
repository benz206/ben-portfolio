import Image from "next/image";
import Link from "next/link";

export interface TechIconProps {
    name: string;
    image: string;
    link: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

const sizeMap = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
    xl: { width: 65, height: 65 },
};

export default function TechIcon({
    name,
    image,
    link,
    size = "md",
    className = "",
}: TechIconProps) {
    const dimensions = sizeMap[size];

    return (
        <Link href={link} target="_blank" rel="noopener noreferrer">
            <Image
                className={`transition-transform duration-200 ease-in-out animate-fade-in hover:scale-125 ${className}`}
                width={dimensions.width}
                height={dimensions.height}
                src={image}
                alt={name}
            />
        </Link>
    );
}
