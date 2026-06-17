import type { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = {
    title: "Analytics | Ben's Portfolio",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminPage() {
    return <AnalyticsClient />;
}
