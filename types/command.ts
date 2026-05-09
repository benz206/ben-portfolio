import type { ReactNode } from "react";

export interface CommandDescriptor {
    id: string;
    label: string;
    href?: string;
    section?: string;
    keywords?: string[];
    description?: string;
    action?: () => void;
    icon?: ReactNode;
    meta?: string;
    closeOnRun?: boolean;
    actionLabel?: string;
}

export interface RegisterCommandsOptions {
    source: string;
    commands: CommandDescriptor[];
    replace?: boolean;
}
