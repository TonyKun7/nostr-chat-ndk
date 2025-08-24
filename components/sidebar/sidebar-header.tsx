import Link from "next/link"
import Image from "next/image"

import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function AppSidebarHeader() {
    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" asChild>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                <Image src="/logo.png" alt="Logo" width={24} height={24} className="h-6 w-full object-contain" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Nostr Chat</span>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <div className="border-t border-muted my-2" />
        </SidebarHeader>
    )
}