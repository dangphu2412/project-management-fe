import React, {useContext, useReducer, createContext, ReactNode} from "react";

// Contexts
const BacklogStateContext = createContext<BacklogState | undefined>(undefined);
const BacklogDispatchContext = createContext<React.Dispatch<BacklogAction> | undefined>(
    undefined
);

// Provider
export function BacklogActionProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(backlogReducer, initialState);

    return (
        <BacklogStateContext.Provider value={state}>
            <BacklogDispatchContext.Provider value={dispatch}>
                {children}
            </BacklogDispatchContext.Provider>
        </BacklogStateContext.Provider>
    );
}

// Hooks
export function useBacklogActionState() {
    const context = useContext(BacklogStateContext);
    if (context === undefined) {
        throw new Error("useBacklogState must be used within a BacklogProvider");
    }
    return context;
}

export function useBacklogActionDispatch() {
    const context = useContext(BacklogDispatchContext);
    if (context === undefined) {
        throw new Error("useBacklogDispatch must be used within a BacklogProvider");
    }
    return context;
}
