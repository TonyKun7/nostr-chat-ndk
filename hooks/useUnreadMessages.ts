import { useMemo, useCallback } from "react"
import type { NDKEvent } from "@nostr-dev-kit/ndk"
import { storage } from "@/lib/storage"

export interface UseUnreadMessagesOptions {
  events: NDKEvent[];
  channel: string;
}

export interface UseUnreadMessagesReturn {
  unreadCount: number;
  hasUnread: boolean;
  markAsRead: () => void;
  lastMessage?: NDKEvent;
}

export function useUnreadMessages({ events, channel }: UseUnreadMessagesOptions): UseUnreadMessagesReturn {
    const isGeoHash = channel.startsWith("bc_")

    const filterEvents = useCallback(
        (e: NDKEvent) => {
            if (isGeoHash) {
                const room = channel.replace(/^bc_/, "")
                return e.kind === 20000 && e.tags.some(t => t[0] === "g" && t[1] === room)
            } else {
                return e.kind === 23333 && e.tags.some(t => t[0] === "d" && t[1] === channel)
            }
        },
        [channel, isGeoHash],
    )

    const channelMessages = useMemo(() => {
        return events
            .filter(filterEvents)
            .sort((a, b) => (a.created_at || 0) - (b.created_at || 0))
    }, [events, filterEvents])

    const lastMessage = useMemo(() => {
        return channelMessages[channelMessages.length - 1]
    }, [channelMessages])

    const { unreadCount, hasUnread } = useMemo(() => {
        const lastRead = storage.getLastRead(channel)
        const unreadMessages = channelMessages.filter(msg => 
            msg.created_at && msg.created_at > lastRead,
        )
    
        return {
            unreadCount: unreadMessages.length,
            hasUnread: unreadMessages.length > 0,
        }
    }, [channelMessages, channel])

    const markAsRead = useCallback(() => {
        if (lastMessage?.created_at) {
            storage.setLastRead(channel, lastMessage.created_at)
        }
    }, [channel, lastMessage])

    return {
        unreadCount,
        hasUnread,
        markAsRead,
        lastMessage,
    }
}