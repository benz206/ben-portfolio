import type { Metadata } from "next";
import StatusClient from "./StatusClient";

export const metadata: Metadata = {
    title: "Status - Ben's Portfolio",
    description: "Live status checks for the services used on this site.",
};

export default function StatusPage() {
    return <StatusClient />;
}
