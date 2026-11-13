import ProjectsClient from "./ProjectsClient";
import { fetchBlogSlugs } from "@/utils/blog";

export const revalidate = 3600;

export default async function Projects() {
    const writeups = await fetchBlogSlugs("projects");
    return <ProjectsClient writeups={writeups} />;
}
