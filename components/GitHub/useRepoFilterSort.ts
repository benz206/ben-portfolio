import { useMemo, useState } from "react";
import type { GitHubRepo } from "@/types";

export enum SortOption {
    Name = "name",
    Stars = "stars",
    Forks = "forks",
    Language = "language",
}

const sortRepositories = (
    repos: GitHubRepo[],
    sortBy: SortOption,
    sortOrder: "asc" | "desc"
) => {
    return [...repos].sort((a, b) => {
        let aValue: string | number = 0;
        let bValue: string | number = 0;
        switch (sortBy) {
            case SortOption.Name:
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
            case SortOption.Stars:
                aValue = a.stargazers_count || 0;
                bValue = b.stargazers_count || 0;
                break;
            case SortOption.Forks:
                aValue = a.forks_count || 0;
                bValue = b.forks_count || 0;
                break;
            case SortOption.Language:
                aValue = (a.language || "").toLowerCase();
                bValue = (b.language || "").toLowerCase();
                break;
        }
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });
};

const getSortLabel = (option: SortOption) => {
    if (option === SortOption.Name) return "Name";
    if (option === SortOption.Stars) return "Stars";
    if (option === SortOption.Forks) return "Forks";
    return "Language";
};

export function useRepoFilterSort(repos: GitHubRepo[]) {
    const [sortBy, setSortBy] = useState<SortOption>(SortOption.Stars);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRepoData = useMemo(() => {
        return sortRepositories(repos, sortBy, sortOrder).filter((repo) =>
            repo.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [repos, sortBy, sortOrder, searchTerm]);

    const handleSortChange = (option: SortOption) => {
        if (option === sortBy) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }
        setSortBy(option);
        setSortOrder(option === SortOption.Name ? "asc" : "desc");
    };

    const sortOptions = Object.values(SortOption).map((option) => ({
        option,
        label: getSortLabel(option),
    }));

    return {
        sortBy,
        sortOrder,
        searchTerm,
        setSearchTerm,
        filteredRepoData,
        handleSortChange,
        sortOptions,
    };
}
