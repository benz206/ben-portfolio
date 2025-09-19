import { motion } from "framer-motion";
import Head from "next/head";

export default function The404() {
    return (
        <>
            <Head>
                <title>404 Not Found</title>
            </Head>
            <div className="relative top-0 flex items-center justify-center w-full h-screen bg-rainbow-gradient animate-breathing-gradient">
                <motion.div
                    className="relative flex h-[370px] lg:h-[300px] card w-11/12 lg:w-[1000px] drop-shadow-2xl duration-1000 ease-in-out transition-all"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="flex flex-col justify-center w-full h-full p-12">
                        <h2 className="p-2 text-lg text-center">ERROR</h2>
                        <h1 className="p-2 text-5xl font-black text-center lg:text-6xl">
                            404 NOT FOUND
                        </h1>
                        <p className="p-2 py-5 font-light text-center">
                            Sorry... This wasn&apos;t supposed to happen, try
                            going back to home.
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
