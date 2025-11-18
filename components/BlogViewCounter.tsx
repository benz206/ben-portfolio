import { FiEye } from "react-icons/fi";

type Props = {
    views: number;
    className?: string;
};

export default function BlogViewCounter({ views, className }: Props) {
    const formatted = new Intl.NumberFormat().format(views);
    return (
        <div className={`flex items-center gap-1.5 ${className || ""}`}>
            <FiEye className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/50">{formatted}</span>
        </div>
    );
}

