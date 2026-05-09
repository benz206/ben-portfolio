import { useEffect } from "react";
import type { CommandDescriptor } from "@/types/command";

type Params = {
    isOpen: boolean;
    totalCount: number;
    viewStackDepth: number;
    activeCommand: CommandDescriptor | undefined;
    open: () => void;
    close: () => void;
    popView: () => void;
    navUp: (total: number) => void;
    navDown: (total: number) => void;
    runCommand: (command: CommandDescriptor) => void;
};

export function useCommandKeyboard({
    isOpen,
    totalCount,
    viewStackDepth,
    activeCommand,
    open,
    close,
    popView,
    navUp,
    navDown,
    runCommand,
}: Params) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isModifier = event.metaKey || event.ctrlKey;
            const target = event.target as HTMLElement | null;
            const isInputTarget =
                target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.isContentEditable);

            if (isModifier && event.key.toLowerCase() === "k") {
                if (isInputTarget) return;
                event.preventDefault();
                if (isOpen) close();
                else open();
                return;
            }

            if (!isOpen) return;

            if (event.key === "Escape") {
                event.preventDefault();
                if (viewStackDepth > 0) popView();
                else close();
            }
            if (event.key === "ArrowDown") {
                event.preventDefault();
                navDown(totalCount);
            }
            if (event.key === "ArrowUp") {
                event.preventDefault();
                navUp(totalCount);
            }
            if (event.key === "Enter") {
                event.preventDefault();
                if (activeCommand) runCommand(activeCommand);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        isOpen,
        totalCount,
        viewStackDepth,
        activeCommand,
        open,
        close,
        popView,
        navUp,
        navDown,
        runCommand,
    ]);
}
