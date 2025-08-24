import React, { createContext, useContext, useReducer, ReactNode } from "react";

export type UserStory = {
    id: string;
    title: string;
    description?: string;
    acceptanceCriteria: string;
    priority: string;
    status: string;
    tags: string[];
    storyPoints: string;
    priorityId?: string;
    assignee?: string;
    sprintId: string | null;
};

export type Task = {
    id: string;
    title: string;
    description?: string;
    userStoryId?: string;
    sprintId: string | null;
    assignee?: string;
    priority: string;
    tags: string[];
    dueDate: string;
    status: string;
};

export type Sprint = {
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
    goal: string;
};

export type DraggedItem = { id: string; type: "story" | "task" };

export type BacklogListState = {
    userStories: UserStory[];
    tasks: Task[];
    sprints: Sprint[];
    expandedSprints: string[];
    expandedStories: string[];
    draggedItem: DraggedItem | null;
    dragOverTarget: string | null;
};

const initialState: BacklogListState = {
    userStories: [],
    tasks: [],
    sprints: [],
    expandedSprints: [],
    expandedStories: [],
    draggedItem: null,
    dragOverTarget: null,
};

export type BacklogListAction =
    | { type: "SET_USER_STORIES"; payload: UserStory[] }
    | { type: "SET_TASKS"; payload: Task[] }
    | { type: "SET_SPRINTS"; payload: Sprint[] }
    | { type: "TOGGLE_EXPANDED_SPRINT"; payload: string }
    | { type: "TOGGLE_EXPANDED_STORY"; payload: string }
    | { type: "SET_DRAGGED_ITEM"; payload: DraggedItem | null }
    | { type: "SET_DRAG_OVER_TARGET"; payload: string | null }
    | { type: "RESET_BACKLOG_LIST" };

function reducer(state: BacklogListState, action: BacklogListAction): BacklogListState {
    switch (action.type) {
        case "SET_USER_STORIES":
            return { ...state, userStories: action.payload };
        case "SET_TASKS":
            return { ...state, tasks: action.payload };
        case "SET_SPRINTS":
            return { ...state, sprints: action.payload };
        case "TOGGLE_EXPANDED_SPRINT":
            return {
                ...state,
                expandedSprints: state.expandedSprints.includes(action.payload)
                    ? state.expandedSprints.filter((id) => id !== action.payload)
                    : [...state.expandedSprints, action.payload],
            };
        case "TOGGLE_EXPANDED_STORY":
            return {
                ...state,
                expandedStories: state.expandedStories.includes(action.payload)
                    ? state.expandedStories.filter((id) => id !== action.payload)
                    : [...state.expandedStories, action.payload],
            };
        case "SET_DRAGGED_ITEM":
            return { ...state, draggedItem: action.payload };
        case "SET_DRAG_OVER_TARGET":
            return { ...state, dragOverTarget: action.payload };
        case "RESET_BACKLOG_LIST":
            return initialState;
        default:
            return state;
    }
}

// State context
const BacklogListStateContext = createContext<BacklogListState | undefined>(undefined);
// Dispatch context
const BacklogListDispatchContext = createContext<React.Dispatch<BacklogListAction> | undefined>(undefined);

export const BacklogListProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <BacklogListStateContext.Provider value={state}>
            <BacklogListDispatchContext.Provider value={dispatch}>
                {children}
            </BacklogListDispatchContext.Provider>
        </BacklogListStateContext.Provider>
    );
};

// Hooks
export const useBacklogListState = () => {
    const context = useContext(BacklogListStateContext);
    if (!context) throw new Error("useBacklogListState must be used within BacklogListProvider");
    return context;
};

export const useBacklogListDispatch = () => {
    const context = useContext(BacklogListDispatchContext);
    if (!context) throw new Error("useBacklogListDispatch must be used within BacklogListProvider");
    return context;
};
