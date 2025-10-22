export default function Hashtag({ hashtag }: { hashtag: string }) {
    // TODO: Add a funny hashtag search function
    return (
        <div className="inline-block px-1 underline border-[#ececec] rounded-lg">
            #{hashtag}
        </div>
    );
}
