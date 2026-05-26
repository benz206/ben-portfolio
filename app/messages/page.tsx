import type { Metadata } from "next";
import MessagesClient from "./MessagesClient";

export const metadata: Metadata = {
    title: "Messages | Ben's Portfolio",
    robots: {
        index: false,
        follow: false,
    },
};

export default function MessagesPage() {
    return <MessagesClient />;
}
