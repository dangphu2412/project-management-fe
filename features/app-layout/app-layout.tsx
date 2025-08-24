'use client'

import {PropsWithChildren, useState} from "react";
import {SidebarInset, SidebarProvider} from "@/shared/design-system/components/ui/sidebar";
import {ToastProvider} from "@/shared/toast/toast";
import {AppSidebar} from "@/features/sidebar/app-sidebar";

export function AppLayout({ children }: PropsWithChildren) {
    const [activeView, setActiveView] = useState("backlog")

    return  <SidebarProvider>
        <ToastProvider>
            <AppSidebar activeView={activeView} onViewChange={setActiveView} />
            <SidebarInset>
                <main className="flex-1 overflow-hidden">{children}</main>
            </SidebarInset>
        </ToastProvider>
    </SidebarProvider>
}