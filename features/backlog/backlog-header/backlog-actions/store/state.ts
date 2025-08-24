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
function backlogReducer(state: BacklogState, action: BacklogAction): BacklogState {
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
