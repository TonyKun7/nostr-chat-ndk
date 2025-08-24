import { memo } from "react"
import Link from "next/link"
import { Hash } from "lucide-react"

import { SidebarMenuButton, SidebarMenuSubItem } from "@/components/ui/sidebar"

import type { SidebarChannelItemProps } from "@/types/nostr"

export const SidebarChannelItem = memo(function SidebarChannelItem({ 
    channel,
    hasUnread, 
    mounted, 
}: SidebarChannelItemProps) {
    return (
        <SidebarMenuSubItem>
            <SidebarMenuButton asChild>
                <Link href={`/channel/${channel}`} className="flex items-center">
                    <Hash className="mr-2 h-4 w-4" />
                    <span className="truncate">{channel}</span>
                    {mounted && hasUnread && (
                        <span className="ml-auto inline-block w-2 h-2 rounded-full bg-primary/70" />
                    )}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuSubItem>
    )
})