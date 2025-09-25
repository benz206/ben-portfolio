export default function Hashtag({ hashtag }: { hashtag: string }) {
    // TODO: Add a funny hashtag search function
    return (
        <div className="inline-block px-1 underline border-black rounded-lg dark:border-[#ececec]">
            #{hashtag}
        </div>
    );
}
