import { memo } from "react"

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar"
import { ChannelItemWithUnread } from "@/components/sidebar/channel-item-with-unread"

import type { NDKEvent } from "@nostr-dev-kit/ndk"

import type { ChannelGroup } from "@/types/nostr"

interface SidebarChannelGroupProps {
  group: ChannelGroup;
  events: NDKEvent[];
  mounted: boolean;
}

export const SidebarChannelGroup = memo(function SidebarChannelGroup({ 
    group, 
    events, 
    mounted, 
}: SidebarChannelGroupProps) {
    return (
        <Collapsible key={group.title} defaultOpen className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        {group.icon}
                        <span className="truncate font-semibold">{group.title}</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {group.items.map(channel => (
                            <ChannelItemWithUnread
                                key={`${group.title}-${channel}`}
                                channel={channel}
                                events={events}
                                mounted={mounted}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
})