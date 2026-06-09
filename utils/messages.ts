import matter from "gray-matter";
import type { Octokit } from "@octokit/rest" with { "resolution-mode": "import" };
import { slugify } from "@/utils/slugify";

const MESSAGES_OWNER = "benz206";
const MESSAGES_REPO = "messages";
const SLUG_PATTERN = /^[a-zA-Z0-9-]+$/;

let octokitPromise: Promise<Octokit> | null = null;

function getOctokit(): Promise<Octokit> {
    if (!octokitPromise) {
        octokitPromise = import("@octokit/rest").then(
            ({ Octokit }) =>
                new Octokit({
                    auth: process.env.BLOG_PAT,
                }),
        );
    }
    return octokitPromise;
}

async function getFileContent(
    slug: string,
): Promise<ReturnType<typeof matter> | null> {
    if (!SLUG_PATTERN.test(slug)) return null;
    const octokit = await getOctokit();
    try {
        const res = await octokit.rest.repos.getContent({
            owner: MESSAGES_OWNER,
            repo: MESSAGES_REPO,
            path: `${slug}.md`,
        });
        if (Array.isArray(res.data) || !("content" in res.data)) return null;
        const raw = res.data.content;
        if (!raw || typeof raw !== "string") return null;
        const decoded = Buffer.from(raw, "base64").toString("utf8");
        return matter(decoded);
    } catch {
        return null;
    }
}

export async function lookupMessage(
    name: string,
): Promise<{ questions: string[] } | null> {
    const slug = slugify(name);
    const file = await getFileContent(slug);
    if (!file) return null;

    const questions = file.data.questions;
    if (!Array.isArray(questions) || questions.length === 0) return null;

    return {
        questions: questions.map((q) => String(q?.question ?? "")),
    };
}

export async function verifyAndGetMessage(
    name: string,
    answers: string[],
): Promise<{ message: string; senderName: string } | null> {
    const slug = slugify(name);
    const file = await getFileContent(slug);
    if (!file) return null;

    const questions = file.data.questions;
    if (!Array.isArray(questions)) return null;
    if (answers.length !== questions.length) return null;

    const correct = questions.every(
        (q, i) =>
            typeof q?.answer === "string" &&
            q.answer.toLowerCase().trim() === answers[i]?.toLowerCase().trim(),
    );
    if (!correct) return null;

    return {
        message: file.content.trim(),
        senderName: file.data.name || name,
    };
}
