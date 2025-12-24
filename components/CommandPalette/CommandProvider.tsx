"use client";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { cn } from "@/utils/cn";
import type {
    CommandDescriptor,
    RegisterCommandsOptions,
} from "@/types/command";

type CommandContextValue = {
    isOpen: boolean;
    search: string;
    setSearch: (value: string) => void;
    toggle: () => void;
    open: () => void;
    close: () => void;
    registerCommands: (options: RegisterCommandsOptions) => () => void;
    pushView: (view: {
        id: string;
        commands: CommandDescriptor[];
        placeholder?: string;
    }) => void;
    popView: () => void;
};

const CommandContext = createContext<CommandContextValue | null>(null);

export function useCommandMenu() {
    const context = useContext(CommandContext);
    if (!context) {
        throw new Error("useCommandMenu must be used within a CommandProvider");
    }
    return context;
}

type CommandProviderProps = {
    children: ReactNode;
};

type CommandSection = {
    name: string;
    commands: CommandDescriptor[];
};

export function CommandProvider({ children }: CommandProviderProps) {
    const [isClient, setIsClient] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [sources, setSources] = useState<Map<string, CommandDescriptor[]>>(
        new Map()
    );
    const [activeIndex, setActiveIndex] = useState(0);
    const [viewStack, setViewStack] = useState<
        Array<{
            id: string;
            commands: CommandDescriptor[];
            placeholder?: string;
        }>
    >([]);
    const searchRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const registerCommands = useCallback((options: RegisterCommandsOptions) => {
        const { source, commands, replace } = options;
        setSources((prev) => {
            const next = new Map(prev);
            if (!replace && next.has(source)) {
                const existing = next.get(source) ?? [];
                const merged = [...existing, ...commands];
                const dedup = new Map<string, CommandDescriptor>();
                merged.forEach((command) => {
                    dedup.set(command.id, command);
                });
                next.set(source, Array.from(dedup.values()));
            } else {
                next.set(source, commands);
            }
            return next;
        });
        return () => {
            setSources((prev) => {
                const next = new Map(prev);
                const current = next.get(source);
                if (!current) return prev;
                const isSameReference = current === commands;
                if (isSameReference || replace || !replace) {
                    next.delete(source);
                }
                return next;
            });
        };
    }, []);

    const commands = useMemo(() => {
        const activeView = viewStack[viewStack.length - 1];
        if (activeView) return activeView.commands;
        const flattened: CommandDescriptor[] = [];
        sources.forEach((list) => {
            flattened.push(...list);
        });
        return flattened;
    }, [sources, viewStack]);

    const placeholder = useMemo(() => {
        const activeView = viewStack[viewStack.length - 1];
        return activeView?.placeholder ?? "Search actions...";
    }, [viewStack]);

    useEffect(() => {
        if (!isOpen) {
            setSearch("");
            setActiveIndex(0);
            setViewStack([]);
        }
    }, [isOpen]);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return commands;
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
    }, [commands, search]);

    const sections = useMemo(() => {
        if (!filtered.length) return [];
        const map = new Map<string, CommandDescriptor[]>();
        filtered.forEach((command) => {
            const sectionName = command.section ?? "General";
            if (!map.has(sectionName)) {
                map.set(sectionName, []);
            }
            map.get(sectionName)?.push(command);
        });
        return Array.from(map.entries()).map<CommandSection>(
            ([name, list]) => ({
                name,
                commands: list,
            })
        );
    }, [filtered]);

    const totalCount = filtered.length;

    const runCommand = useCallback(
        (command: CommandDescriptor) => {
            const shouldClose = command.closeOnRun ?? true;
            if (shouldClose) {
                setIsOpen(false);
            }
            if (command.action) {
                command.action();
                return;
            }
            if (command.href) {
                router.push(command.href);
            }
        },
        [router]
    );

    const pushView = useCallback(
        (view: {
            id: string;
            commands: CommandDescriptor[];
            placeholder?: string;
        }) => {
            setViewStack((prev) => [...prev, view]);
            setSearch("");
            setActiveIndex(0);
        },
        []
    );

    const popView = useCallback(() => {
        setViewStack((prev) => prev.slice(0, -1));
        setSearch("");
        setActiveIndex(0);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const el = itemRefs.current[activeIndex];
        if (!el) return;
        el.scrollIntoView({ block: "nearest" });
    }, [activeIndex, filtered, isOpen]);

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
                setIsOpen((prev) => !prev);
                return;
            }
            if (!isOpen) return;
            if (event.key === "Escape") {
                event.preventDefault();
                if (viewStack.length > 0) {
                    popView();
                } else {
                    setIsOpen(false);
                }
            }
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((prev) => {
                    const nextIndex = prev + 1;
                    if (nextIndex >= totalCount) return 0;
                    return nextIndex;
                });
            }
            if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((prev) => {
                    const nextIndex = prev - 1;
                    if (nextIndex < 0) return Math.max(totalCount - 1, 0);
                    return nextIndex;
                });
            }
            if (event.key === "Enter") {
                event.preventDefault();
                const command = filtered[activeIndex];
                if (command) {
                    runCommand(command);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        filtered,
        activeIndex,
        totalCount,
        isOpen,
        viewStack.length,
        popView,
        runCommand,
    ]);

    useEffect(() => {
        if (!isOpen) return;
        const focusTimeout = setTimeout(() => {
            searchRef.current?.focus();
        }, 10);
        return () => clearTimeout(focusTimeout);
    }, [isOpen]);

    const contextValue = useMemo<CommandContextValue>(
        () => ({
            isOpen,
            search,
            setSearch,
            toggle: () => setIsOpen((prev) => !prev),
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
            registerCommands,
            pushView,
            popView,
        }),
        [isOpen, search, registerCommands, pushView, popView]
    );

    return (
        <CommandContext.Provider value={contextValue}>
            {children}
            {isClient &&
                isOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-[15vh] sm:px-6">
                        <Card
                            variant="glass"
                            className="overflow-hidden !p-1 w-full max-w-xl border border-white/10 bg-black/70"
                        >
                            <div className="flex items-center px-4 py-3 border-b border-white/10">
                                <div className="flex-1">
                                    <input
                                        ref={searchRef}
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                            setActiveIndex(0);
                                        }}
                                        placeholder={placeholder}
                                        className="w-full text-sm text-white bg-transparent outline-none placeholder:text-white/40"
                                    />
                                </div>
                                <span className="hidden text-xs text-white/40 sm:inline-flex">
                                    Esc
                                </span>
                            </div>
                            <div
                                ref={listRef}
                                className="command-scroll max-h-[320px] overflow-y-auto"
                            >
                                {sections.length === 0 && (
                                    <div className="px-4 py-12 text-sm text-center text-white/60">
                                        No commands found.
                                    </div>
                                )}
                                {sections.map((section) => (
                                    <div
                                        key={section.name}
                                        className="px-2 py-3"
                                    >
                                        <div className="px-2 pb-2 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                                            {section.name}
                                        </div>
                                        <div className="flex flex-col">
                                            {section.commands.map((command) => {
                                                const index =
                                                    filtered.indexOf(command);
                                                const isActive =
                                                    index === activeIndex;
                                                return (
                                                    <button
                                                        key={command.id}
                                                        ref={(node) => {
                                                            if (index >= 0) {
                                                                itemRefs.current[
                                                                    index
                                                                ] = node;
                                                            }
                                                        }}
                                                        type="button"
                                                        onMouseEnter={() =>
                                                            setActiveIndex(
                                                                index
                                                            )
                                                        }
                                                        onClick={() =>
                                                            runCommand(command)
                                                        }
                                                        className={cn(
                                                            "flex justify-between items-center px-3 py-2 w-full text-left rounded-md transition-colors",
                                                            isActive
                                                                ? "text-white bg-white/15"
                                                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                                        )}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-medium">
                                                                {command.label}
                                                            </span>
                                                            {command.description && (
                                                                <span className="text-xs text-white/60">
                                                                    {
                                                                        command.description
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {command.meta && (
                                                                <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                                                                    {
                                                                        command.meta
                                                                    }
                                                                </span>
                                                            )}
                                                            {command.icon}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.25em] text-white/40">
                                <span>
                                    {viewStack.length > 0
                                        ? "Esc Back • Esc Close"
                                        : "Navigate • Theme • Actions"}
                                </span>
                                <span>Ctrl K</span>
                            </div>
                        </Card>
                    </div>,
                    document.body
                )}
        </CommandContext.Provider>
    );
}
