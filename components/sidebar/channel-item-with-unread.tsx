import { memo } from "react"

import { SidebarChannelItem } from "@/components/sidebar/sidebar-channel-item"

import { useUnreadMessages } from "@/hooks/useUnreadMessages"

import type { NDKEvent } from "@nostr-dev-kit/ndk"

interface ChannelItemWithUnreadProps {
  channel: string;
  events: NDKEvent[];
  mounted: boolean;
}

export const ChannelItemWithUnread = memo(function ChannelItemWithUnread({ 
    channel, 
    events, 
    mounted, 
}: ChannelItemWithUnreadProps) {
    const { hasUnread } = useUnreadMessages({ events, channel })
  
    return (
        <SidebarChannelItem
            channel={channel}
            hasUnread={hasUnread}
            mounted={mounted}
        />
    )
})