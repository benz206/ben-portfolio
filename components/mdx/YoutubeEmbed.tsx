type YouTubeEmbedProps = {
    src: string;
    title?: string;
};

const YouTubeEmbed = ({
    src,
    title = "YouTube video player",
}: YouTubeEmbedProps) => {
    return (
        <div className="w-full mx-auto my-4 border-0 rounded-lg shadow-lg aspect-video">
            <iframe
                src={src}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full rounded-lg"
            />
        </div>
    );
};

export default YouTubeEmbed;
