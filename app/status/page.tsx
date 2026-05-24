import type { Metadata } from "next";
import StatusClient from "./StatusClient";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function StatusPage() {
    return <StatusClient />;
}
