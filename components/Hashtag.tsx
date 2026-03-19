export default function Hashtag({ hashtag }: { hashtag: string }) {
    return (
        <span className="inline-flex items-center rounded-full bg-white/[0.08] px-2.5 py-1 text-xs text-white/50">
            #{hashtag}
        </span>
    );
}
