import { useCallback } from "react";

export function useScrollToSection(id: string) {
    return useCallback(() => {
        const nextSection = document.getElementById(id);
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
        }
    }, [id]);
}
