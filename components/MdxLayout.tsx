import { RawBlogMetadata } from "@/types";
import Hashtag from "@/components/Hashtag";

export default function MdxLayout({
    children,
    metadata,
    createdDate,
    updatedDate,
    viewCounter,
}: {
    children: React.ReactNode;
    metadata: RawBlogMetadata;
    createdDate: string;
    updatedDate: string;
    viewCounter?: React.ReactNode;
}) {
    return (
        <>
            <div className="flex relative top-0 justify-center w-full h-24 lg:h-32 bg-rainbow-gradient animate-breathing-gradient" />
            <div className="flex mx-auto w-[400px] md:w-[700px] lg:w-[1000px] xl:[1200px] mt-12 mb-16 lg:mb-10 lg:mt-8 p-2 lg:p-4 scroll-m-6 text-[#ececec]">
                <div className="flex flex-col px-6 w-full min-h-screen">
                    <h1 className="py-2 text-3xl font-black lg:text-5xl">
                        {metadata.title}
                    </h1>
                    <h3 className="py-2 italic text-md lg:text-xl font-base">
                        {metadata.description}
                    </h3>
                    <h4 className="py-2 text-xs font-light lg:text-sm">
                        Posted: {createdDate} - Last Updated: {updatedDate} -
                        Tags:{" "}
                        {metadata.tags.map((tag) => (
                            <Hashtag key={tag} hashtag={tag} />
                        ))}
                    </h4>
                    {viewCounter}
                    {children}
                </div>
            </div>
        </>
    );
}
