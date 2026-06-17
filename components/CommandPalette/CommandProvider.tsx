"use client";

import {
    createContext,
    use,
    useCallback,
    useMemo,
    useSyncExternalStore,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type {
    CommandDescriptor,
    RegisterCommandsOptions,
} from "@/types/command";
import {
    useCommandState,
    type CommandView,
} from "@/components/CommandPalette/useCommandState";
import { useCommandKeyboard } from "@/components/CommandPalette/useCommandKeyboard";
import CommandPaletteModal, {
    type CommandSection,
} from "@/components/CommandPalette/CommandPaletteModal";

type CommandContextValue = {
    isOpen: boolean;
    search: string;
    setSearch: (value: string) => void;
    toggle: () => void;
    open: () => void;
    close: () => void;
    registerCommands: (options: RegisterCommandsOptions) => () => void;
    pushView: (view: CommandView) => void;
    popView: () => void;
};

const CommandContext = createContext<CommandContextValue | null>(null);

export function useCommandMenu() {
    const context = use(CommandContext);
    if (!context) {
        throw new Error("useCommandMenu must be used within a CommandProvider");
    }
    return context;
}

export function CommandProvider({ children }: { children: ReactNode }) {
    const isClient = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );
    const { state, actions } = useCommandState();
    const { push } = useRouter();

    const commands = useMemo(() => {
        const activeView = state.viewStack[state.viewStack.length - 1];
        if (activeView) return activeView.commands;
        const flattened: CommandDescriptor[] = [];
        state.sources.forEach((list) => {
            flattened.push(...list);
        });
        return flattened;
    }, [state.sources, state.viewStack]);

    const placeholder = useMemo(() => {
        const activeView = state.viewStack[state.viewStack.length - 1];
        return activeView?.placeholder ?? "Search actions...";
    }, [state.viewStack]);

    const filtered = useMemo(() => {
        const query = state.search.trim().toLowerCase();
        if (!query) return commands.filter((command) => !command.hideWhenEmpty);
        return commands.filter((command) => {
            const haystack = [
                command.label,
                command.description,
                command.meta,
                ...(command.keywords ?? []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(query);
        });
    }, [commands, state.search]);

    const sections = useMemo<CommandSection[]>(() => {
        if (!filtered.length) return [];
        const map = new Map<string, CommandDescriptor[]>();
        filtered.forEach((command) => {
            const sectionName = command.section ?? "General";
            if (!map.has(sectionName)) map.set(sectionName, []);
            map.get(sectionName)?.push(command);
        });
        return Array.from(map.entries()).map(([name, list]) => ({
            name,
            commands: list,
        }));
    }, [filtered]);

    const totalCount = filtered.length;

    const runCommand = useCallback(
        (command: CommandDescriptor) => {
            const shouldClose = command.closeOnRun ?? true;
            if (shouldClose) actions.close();
            if (command.action) {
                command.action();
                return;
            }
            if (command.href) push(command.href);
        },
        [push, actions],
    );

    useCommandKeyboard({
        isOpen: state.isOpen,
        totalCount,
        viewStackDepth: state.viewStack.length,
        activeCommand: filtered[state.activeIndex],
        open: actions.open,
        close: actions.close,
        popView: actions.popView,
        navUp: actions.navUp,
        navDown: actions.navDown,
        runCommand,
    });

    const contextValue = useMemo<CommandContextValue>(
        () => ({
            isOpen: state.isOpen,
            search: state.search,
            setSearch: actions.setSearch,
            toggle: actions.toggle,
            open: actions.open,
            close: actions.close,
            registerCommands: actions.registerCommands,
            pushView: actions.pushView,
            popView: actions.popView,
        }),
        [state.isOpen, state.search, actions],
    );

    const viewStackTopId =
        state.viewStack.length > 0
            ? state.viewStack[state.viewStack.length - 1].id
            : null;

    return (
        <CommandContext.Provider value={contextValue}>
            {children}
            {isClient && state.isOpen && (
                <CommandPaletteModal
                    search={state.search}
                    placeholder={placeholder}
                    sections={sections}
                    filtered={filtered}
                    activeIndex={state.activeIndex}
                    totalCount={totalCount}
                    viewStackTopId={viewStackTopId}
                    setSearch={actions.setSearch}
                    setActiveIndex={actions.setActiveIndex}
                    runCommand={runCommand}
                />
            )}
        </CommandContext.Provider>
    );
}
