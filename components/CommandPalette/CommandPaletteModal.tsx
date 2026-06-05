"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiArrowDown, FiArrowUp, FiCornerDownLeft } from "react-icons/fi";
import Card from "@/components/Card";
import Eyebrow from "@/components/Eyebrow";
import { cn } from "@/utils/cn";
import type { CommandDescriptor } from "@/types/command";

export type CommandSection = {
    name: string;
    commands: CommandDescriptor[];
};

type Props = {
    search: string;
    placeholder: string;
    sections: CommandSection[];
    filtered: CommandDescriptor[];
    activeIndex: number;
    totalCount: number;
    viewStackTopId: string | null;
    setSearch: (value: string) => void;
    setActiveIndex: (index: number) => void;
    runCommand: (command: CommandDescriptor) => void;
};

function Kbd({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <kbd
            className={cn(
                "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded border border-white/15 bg-white/[0.06] text-[10px] font-medium text-white/70 shadow-[inset_0_-1px_0_rgba(0,0,0,0.4)]",
                className,
            )}
        >
            {children}
        </kbd>
    );
}

function ActionHint({ keys, label }: { keys: ReactNode[]; label: string }) {
    return (
        <span className="flex items-center gap-1.5 text-[11px] text-white/55">
            <span className="flex items-center gap-0.5">
                {keys.map((key, i) => (
                    <Kbd key={typeof key === "string" ? key : i}>{key}</Kbd>
                ))}
            </span>
            <span className="font-medium tracking-normal normal-case">
                {label}
            </span>
        </span>
    );
}

export default function CommandPaletteModal({
    search,
    placeholder,
    sections,
    filtered,
    activeIndex,
    totalCount,
    viewStackTopId,
    setSearch,
    setActiveIndex,
    runCommand,
}: Props) {
    const searchRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

    useEffect(() => {
        const focusTimeout = setTimeout(() => {
            searchRef.current?.focus();
        }, 10);
        return () => clearTimeout(focusTimeout);
    }, []);

    useEffect(() => {
        const el = itemRefs.current[activeIndex];
        if (!el) return;
        el.scrollIntoView({ block: "nearest" });
    }, [activeIndex, filtered]);

    return createPortal(
        <div className="fixed inset-0 z-999 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-[15vh] sm:px-6">
            <Card
                variant="glass"
                className="overflow-hidden p-1! w-full max-w-xl border border-white/10 bg-black/70"
            >
                <div className="flex items-center px-4 py-3 border-b border-white/10">
                    {viewStackTopId && (
                        <Eyebrow className="mr-2 text-[10px] tracking-[0.2em] text-white/45">
                            {viewStackTopId.replace(/-/g, " ")}
                        </Eyebrow>
                    )}
                    <div className="flex-1">
                        <input
                            ref={searchRef}
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                            }}
                            placeholder={placeholder}
                            className="w-full text-sm text-white bg-transparent outline-none placeholder:text-white/40"
                        />
                    </div>
                </div>
                <div
                    ref={listRef}
                    className="command-scroll max-h-80 overflow-y-auto"
                >
                    {sections.length === 0 && (
                        <div className="px-4 py-12 text-sm text-center text-white/60">
                            No commands found.
                        </div>
                    )}
                    {sections.map((section) => (
                        <div key={section.name} className="px-2 py-3">
                            <div className="px-2 pb-2 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                                {section.name}
                            </div>
                            <div className="flex flex-col">
                                {section.commands.map((command) => {
                                    const index = filtered.indexOf(command);
                                    const isActive = index === activeIndex;
                                    return (
                                        <button
                                            key={command.id}
                                            ref={(node) => {
                                                if (index >= 0) {
                                                    itemRefs.current[index] =
                                                        node;
                                                }
                                            }}
                                            type="button"
                                            onMouseEnter={() =>
                                                setActiveIndex(index)
                                            }
                                            onClick={() => runCommand(command)}
                                            className={cn(
                                                "flex justify-between items-center gap-3 px-2.5 py-2 w-full text-left rounded-md transition-colors",
                                                isActive
                                                    ? "text-white bg-white/15"
                                                    : "text-white/80 hover:bg-white/10 hover:text-white",
                                            )}
                                        >
                                            <div className="flex flex-1 items-center gap-3 min-w-0">
                                                <span
                                                    className={cn(
                                                        "flex items-center justify-center size-7 rounded-md border border-white/10 shrink-0 transition-colors",
                                                        isActive
                                                            ? "bg-white/10 text-white"
                                                            : "bg-white/[0.04] text-white/70",
                                                    )}
                                                >
                                                    {command.icon}
                                                </span>
                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                    <span className="text-sm font-medium truncate">
                                                        {command.label}
                                                    </span>
                                                    {command.description && (
                                                        <span className="text-xs text-white/60 truncate">
                                                            {command.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {command.meta && (
                                                <Eyebrow className="text-[10px] tracking-[0.2em] text-white/45 shrink-0">
                                                    {command.meta}
                                                </Eyebrow>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-white/10 px-3 py-2.5">
                    <Eyebrow className="text-[10px] tracking-[0.2em] text-white/35 pl-1">
                        {totalCount} {totalCount === 1 ? "result" : "results"}
                    </Eyebrow>
                    <div className="flex items-center gap-3">
                        <ActionHint
                            keys={[
                                <FiArrowUp key="up" className="size-3" />,
                                <FiArrowDown key="down" className="size-3" />,
                            ]}
                            label="Navigate"
                        />
                        {filtered[activeIndex] && (
                            <ActionHint
                                keys={[
                                    <FiCornerDownLeft
                                        key="enter"
                                        className="size-3"
                                    />,
                                ]}
                                label={
                                    filtered[activeIndex]?.actionLabel ?? "Open"
                                }
                            />
                        )}
                        <ActionHint
                            keys={["esc"]}
                            label={viewStackTopId ? "Back" : "Close"}
                        />
                    </div>
                </div>
            </Card>
        </div>,
        document.body,
    );
}
