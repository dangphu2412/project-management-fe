import React, {useContext, useReducer, createContext, ReactNode} from "react";

// Types
type BacklogState = {
    isCreateUserStoryModalOpen: boolean;
    isCreateTaskModalOpen: boolean;
    isCreateSprintModalOpen: boolean;
    selectedUserStory: string | null; // adjust type later if you have UserStory type
    selectedTask: string | null; // adjust type later if you have Task type
};

type BacklogAction =
    | { type: "OPEN_CREATE_USER_STORY_MODAL" }
    | { type: "CLOSE_CREATE_USER_STORY_MODAL" }
    | { type: "OPEN_CREATE_TASK_MODAL" }
    | { type: "CLOSE_CREATE_TASK_MODAL" }
    | { type: "OPEN_CREATE_SPRINT_MODAL" }
    | { type: "CLOSE_CREATE_SPRINT_MODAL" }
    | { type: "SET_SELECTED_USER_STORY"; payload: string | null }
    | { type: "SET_SELECTED_TASK"; payload: string | null };

const initialState: BacklogState = {
    isCreateUserStoryModalOpen: false,
    isCreateTaskModalOpen: false,
    isCreateSprintModalOpen: false,
    selectedUserStory: null,
    selectedTask: null,
};

// Reducer
export function backlogReducer(state: BacklogState, action: BacklogAction): BacklogState {
    switch (action.type) {
        case "OPEN_CREATE_USER_STORY_MODAL":
            return { ...state, isCreateUserStoryModalOpen: true };
        case "CLOSE_CREATE_USER_STORY_MODAL":
            return { ...state, isCreateUserStoryModalOpen: false };
        case "OPEN_CREATE_TASK_MODAL":
            return { ...state, isCreateTaskModalOpen: true };
        case "CLOSE_CREATE_TASK_MODAL":
            return { ...state, isCreateTaskModalOpen: false };
        case "OPEN_CREATE_SPRINT_MODAL":
            return { ...state, isCreateSprintModalOpen: true };
        case "CLOSE_CREATE_SPRINT_MODAL":
            return { ...state, isCreateSprintModalOpen: false };
        case "SET_SELECTED_USER_STORY":
            return { ...state, selectedUserStory: action.payload };
        case "SET_SELECTED_TASK":
            return { ...state, selectedTask: action.payload };
        default:
            return state;
    }
}

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
