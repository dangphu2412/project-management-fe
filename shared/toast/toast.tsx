import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ToastNotification } from "@/shared/design-system/components/toast-notification";

export type ToastType = "success" | "error" | "info";

export type Toast = {
    id: string;
    message: string;
    type: ToastType;
};

type ToastState = Toast[];

type ToastAction =
    | { type: "ADD_TOAST"; payload: Omit<Toast, "id"> }
    | { type: "REMOVE_TOAST"; payload: string }
    | { type: "CLEAR_TOASTS" };

function reducer(state: ToastState, action: ToastAction): ToastState {
    switch (action.type) {
        case "ADD_TOAST":
            const id = Date.now().toString();
            return [...state, { id, ...action.payload }];
        case "REMOVE_TOAST":
            return state.filter((toast) => toast.id !== action.payload);
        case "CLEAR_TOASTS":
            return [];
        default:
            return state;
    }
}

// State context
const ToastStateContext = createContext<ToastState | undefined>(undefined);
// Dispatch context
const ToastDispatchContext = createContext<React.Dispatch<ToastAction> | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, []);

    return (
        <ToastStateContext.Provider value={state}>
            <ToastDispatchContext.Provider value={dispatch}>
                {children}
                <ToastNotification
                    toasts={state}
                    onRemoveToast={(id) => dispatch({ type: "REMOVE_TOAST", payload: id })}
                />
            </ToastDispatchContext.Provider>
        </ToastStateContext.Provider>
    );
};

// Hooks
export const useToastState = () => {
    const context = useContext(ToastStateContext);
    if (!context) throw new Error("useToastState must be used within ToastProvider");
    return context;
};

export const useToastDispatch = () => {
    const context = useContext(ToastDispatchContext);
    if (!context) throw new Error("useToastDispatch must be used within ToastProvider");
    return context;
};

// Optional helper hook to simplify addToast
export const useToast = () => {
    const dispatch = useToastDispatch();
    const addToast = (message: string, type: ToastType = "success") => {
        dispatch({ type: "ADD_TOAST", payload: { message, type } });
    };
    const removeToast = (id: string) => {
        dispatch({ type: "REMOVE_TOAST", payload: id });
    };
    const clearToasts = () => {
        dispatch({ type: "CLEAR_TOASTS" });
    };
    return { addToast, removeToast, clearToasts };
};
