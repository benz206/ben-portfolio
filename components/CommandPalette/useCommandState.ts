import { useCallback, useMemo, useReducer } from "react";
import type {
    CommandDescriptor,
    RegisterCommandsOptions,
} from "@/types/command";

export type CommandView = {
    id: string;
    commands: CommandDescriptor[];
    placeholder?: string;
};

export type CommandState = {
    isOpen: boolean;
    search: string;
    sources: Map<string, CommandDescriptor[]>;
    activeIndex: number;
    viewStack: CommandView[];
};

type Action =
    | { type: "OPEN" }
    | { type: "CLOSE" }
    | { type: "TOGGLE" }
    | { type: "SET_SEARCH"; search: string }
    | { type: "SET_ACTIVE_INDEX"; index: number }
    | { type: "NAV_DOWN"; total: number }
    | { type: "NAV_UP"; total: number }
    | {
          type: "REGISTER";
          source: string;
          commands: CommandDescriptor[];
          replace?: boolean;
      }
    | { type: "UNREGISTER"; source: string }
    | { type: "PUSH_VIEW"; view: CommandView }
    | { type: "POP_VIEW" };

const initialState: CommandState = {
    isOpen: false,
    search: "",
    sources: new Map(),
    activeIndex: 0,
    viewStack: [],
};

function resetTransient(state: CommandState): CommandState {
    return { ...state, search: "", activeIndex: 0, viewStack: [] };
}

function reducer(state: CommandState, action: Action): CommandState {
    switch (action.type) {
        case "OPEN":
            return state.isOpen ? state : { ...state, isOpen: true };
        case "CLOSE":
            return { ...resetTransient(state), isOpen: false };
        case "TOGGLE":
            return { ...resetTransient(state), isOpen: !state.isOpen };
        case "SET_SEARCH":
            return { ...state, search: action.search, activeIndex: 0 };
        case "SET_ACTIVE_INDEX":
            return { ...state, activeIndex: action.index };
        case "NAV_DOWN": {
            const next = state.activeIndex + 1;
            return {
                ...state,
                activeIndex: next >= action.total ? 0 : next,
            };
        }
        case "NAV_UP": {
            const next = state.activeIndex - 1;
            return {
                ...state,
                activeIndex: next < 0 ? Math.max(action.total - 1, 0) : next,
            };
        }
        case "REGISTER": {
            const { source, commands, replace } = action;
            const next = new Map(state.sources);
            if (!replace && next.has(source)) {
                const existing = next.get(source) ?? [];
                const dedup = new Map<string, CommandDescriptor>();
                [...existing, ...commands].forEach((command) => {
                    dedup.set(command.id, command);
                });
                next.set(source, Array.from(dedup.values()));
            } else {
                next.set(source, commands);
            }
            return { ...state, sources: next };
        }
        case "UNREGISTER": {
            if (!state.sources.has(action.source)) return state;
            const next = new Map(state.sources);
            next.delete(action.source);
            return { ...state, sources: next };
        }
        case "PUSH_VIEW":
            return {
                ...state,
                viewStack: [...state.viewStack, action.view],
                search: "",
                activeIndex: 0,
            };
        case "POP_VIEW":
            return {
                ...state,
                viewStack: state.viewStack.slice(0, -1),
                search: "",
                activeIndex: 0,
            };
    }
}

export type CommandActions = {
    open: () => void;
    close: () => void;
    toggle: () => void;
    setSearch: (value: string) => void;
    setActiveIndex: (index: number) => void;
    navDown: (total: number) => void;
    navUp: (total: number) => void;
    registerCommands: (options: RegisterCommandsOptions) => () => void;
    pushView: (view: CommandView) => void;
    popView: () => void;
};

export function useCommandState(): {
    state: CommandState;
    actions: CommandActions;
} {
    const [state, dispatch] = useReducer(reducer, initialState);

    const registerCommands = useCallback(
        (options: RegisterCommandsOptions) => {
            const { source, commands, replace } = options;
            dispatch({ type: "REGISTER", source, commands, replace });
            return () => dispatch({ type: "UNREGISTER", source });
        },
        [],
    );

    const actions = useMemo<CommandActions>(
        () => ({
            open: () => dispatch({ type: "OPEN" }),
            close: () => dispatch({ type: "CLOSE" }),
            toggle: () => dispatch({ type: "TOGGLE" }),
            setSearch: (value) =>
                dispatch({ type: "SET_SEARCH", search: value }),
            setActiveIndex: (index) =>
                dispatch({ type: "SET_ACTIVE_INDEX", index }),
            navDown: (total) => dispatch({ type: "NAV_DOWN", total }),
            navUp: (total) => dispatch({ type: "NAV_UP", total }),
            registerCommands,
            pushView: (view) => dispatch({ type: "PUSH_VIEW", view }),
            popView: () => dispatch({ type: "POP_VIEW" }),
        }),
        [registerCommands],
    );

    return { state, actions };
}
