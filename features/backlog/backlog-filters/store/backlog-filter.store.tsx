import React, { createContext, useContext, useReducer, ReactNode } from "react";

type BacklogFilterState = {
    searchQuery: string;
    priorityFilter: string;
    assigneeFilter: string;
};

const initialState: BacklogFilterState = {
    searchQuery: "",
    priorityFilter: "all",
    assigneeFilter: "all",
};

type BacklogFilterAction =
    | { type: "SET_SEARCH_QUERY"; payload: string }
    | { type: "SET_PRIORITY_FILTER"; payload: string }
    | { type: "SET_ASSIGNEE_FILTER"; payload: string }
    | { type: "RESET_FILTERS" };

function reducer(state: BacklogFilterState, action: BacklogFilterAction): BacklogFilterState {
    switch (action.type) {
        case "SET_SEARCH_QUERY":
            return { ...state, searchQuery: action.payload };
        case "SET_PRIORITY_FILTER":
            return { ...state, priorityFilter: action.payload };
        case "SET_ASSIGNEE_FILTER":
            return { ...state, assigneeFilter: action.payload };
        case "RESET_FILTERS":
            return initialState;
        default:
            return state;
    }
}

// State context
const BacklogFilterStateContext = createContext<BacklogFilterState | undefined>(undefined);
// Dispatch context
const BacklogFilterDispatchContext = createContext<React.Dispatch<BacklogFilterAction> | undefined>(undefined);

export const BacklogFilterProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <BacklogFilterStateContext.Provider value={state}>
            <BacklogFilterDispatchContext.Provider value={dispatch}>
                {children}
            </BacklogFilterDispatchContext.Provider>
        </BacklogFilterStateContext.Provider>
    );
};

export const useBacklogFilterState = () => {
    const context = useContext(BacklogFilterStateContext);
    if (!context) throw new Error("useBacklogFilterState must be used within BacklogFilterProvider");
    return context;
};

export const useBacklogFilterDispatch = () => {
    const context = useContext(BacklogFilterDispatchContext);
    if (!context) throw new Error("useBacklogFilterDispatch must be used within BacklogFilterProvider");
    return context;
};
