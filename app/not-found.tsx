// Server Component: avoid client-only libraries like framer-motion here

export default function NotFound() {
    return (
        <div className="relative top-0 flex items-center justify-center w-full h-screen bg-rainbow-gradient animate-breathing-gradient">
            <div className="relative flex h-[370px] lg:h-[300px] card w-11/12 lg:w-[1000px] drop-shadow-2xl transition-all duration-1000 ease-in-out">
                <div className="flex flex-col justify-center w-full h-full p-12">
                    <h2 className="p-2 text-lg text-center">ERROR</h2>
                    <h1 className="p-2 text-5xl font-black text-center lg:text-6xl">
                        404 NOT FOUND
                    </h1>
                    <p className="p-2 py-5 font-light text-center">
                        Sorry... This wasn&apos;t supposed to happen, try going back to home.
                    </p>
                </div>
            </div>
        </div>
    );
}
