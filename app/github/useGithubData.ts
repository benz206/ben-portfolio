import { useEffect, useReducer } from "react";
import type { GitHubRepo } from "@/types";
import type {
    GitHubContributionsDay,
    GitHubContributionsResponse,
    GitHubUserResponse,
} from "@/types/externalApis";

export type ContributionWeek = GitHubContributionsDay[];

export type GithubStats = {
    commits: number;
    contributions: number;
    publicRepos: number;
};

export type GithubData = {
    repoData: GitHubRepo[];
    stats: GithubStats | null;
    contributionWeeks: ContributionWeek[];
    maxContributionCount: number;
};

type State = {
    isLoading: boolean;
    data: GithubData;
};

type Action =
    | { type: "loaded"; payload: GithubData }
    | { type: "failed" };

const initialState: State = {
    isLoading: true,
    data: {
        repoData: [],
        stats: null,
        contributionWeeks: [],
        maxContributionCount: 0,
    },
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "loaded":
            return { isLoading: false, data: action.payload };
        case "failed":
            return { ...state, isLoading: false };
    }
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

async function fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached) as {
            data: T;
            timestamp: number;
        };
        if (Date.now() - timestamp < ONE_DAY_MS) return data;
    }
    const response = await fetch(url);
    const data = (await response.json()) as T;
    localStorage.setItem(
        cacheKey,
        JSON.stringify({ data, timestamp: Date.now() }),
    );
    return data;
}

function buildPayload(
    repos: GitHubRepo[],
    profile: GitHubUserResponse,
    contributions: GitHubContributionsResponse,
): GithubData {
    const filteredRepos = repos.filter((repo) => {
        const name = repo.name.toLowerCase();
        if (name === "benz206") return false;
        if (name.includes("experiments")) return false;
        if (name.includes("learning")) return false;
        return true;
    });

    const sortedDays = contributions.contributions
        .filter((day) => day.date)
        .sort(
            (a, b) =>
                new Date(a.date).valueOf() - new Date(b.date).valueOf(),
        );
    const now = new Date();
    const yearAgo = new Date(now);
    yearAgo.setDate(yearAgo.getDate() - 364);
    const recentDays = sortedDays.filter((day) => {
        const dayDate = new Date(day.date);
        return dayDate >= yearAgo && dayDate <= now;
    });
    const lastYearCommits = recentDays.reduce(
        (sum, day) => sum + (day.count ?? 0),
        0,
    );
    const totalCommits = Object.values(contributions.total).reduce(
        (sum, yearTotal) => sum + yearTotal,
        0,
    );
    const maxCount = recentDays.reduce(
        (max, day) => Math.max(max, day.count ?? 0),
        0,
    );

    const paddedDays: GitHubContributionsDay[] = [...recentDays];
    while (paddedDays.length % 7 !== 0) {
        paddedDays.unshift({
            date: `placeholder-${paddedDays.length}`,
            count: 0,
            level: 0,
        });
    }
    const weeks: ContributionWeek[] = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
        weeks.push(paddedDays.slice(i, i + 7));
    }

    return {
        repoData: filteredRepos,
        stats: {
            commits: lastYearCommits,
            contributions: totalCommits,
            publicRepos: profile.public_repos,
        },
        contributionWeeks: weeks,
        maxContributionCount: maxCount,
    };
}

export function useGithubData(): { isLoading: boolean } & GithubData {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [repos, profile, contributions] = await Promise.all([
                    fetchWithCache<GitHubRepo[]>(
                        "https://api.github.com/users/benz206/repos",
                        "github_repos",
                    ),
                    fetchWithCache<GitHubUserResponse>(
                        "https://api.github.com/users/benz206",
                        "github_profile",
                    ),
                    fetchWithCache<GitHubContributionsResponse>(
                        "https://github-contributions-api.jogruber.de/v4/benz206",
                        "github_contributions",
                    ),
                ]);
                if (cancelled) return;
                dispatch({
                    type: "loaded",
                    payload: buildPayload(repos, profile, contributions),
                });
            } catch (error) {
                console.error("Error fetching repository data:", error);
                if (!cancelled) dispatch({ type: "failed" });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return { isLoading: state.isLoading, ...state.data };
}
