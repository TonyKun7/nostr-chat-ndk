"use client"

import React from "react"
import { useSubscribe } from "@nostr-dev-kit/ndk-hooks"

import type { NDKKind, NDKEvent } from "@nostr-dev-kit/ndk-hooks"

type NostrEventsContextType = {
    events: NDKEvent[];
    eose: boolean;
}

const NostrEventsContext = React.createContext<NostrEventsContextType | undefined>(undefined)

export function NostrEventsProvider({ children }: { children: React.ReactNode }) {
    const { events, eose } = useSubscribe(
        [
            {
                kinds: [
                    20000 as NDKKind,
                    23333 as NDKKind,
                ],
                since: Math.floor(Date.now() / 1000) - 1,
            },
        ],
    )

    const newEvents = events.filter(event => {
        const gTags = event.tags
            .filter(tag => tag[0] === "g" || tag[0] === "d")

        return gTags.length > 0
    })

    return (
        <NostrEventsContext.Provider value={{ events: newEvents, eose }}>
            {children}
        </NostrEventsContext.Provider>
    )
}

export function useNostrEvents() {
    const context = React.useContext(NostrEventsContext)
    if (!context) {
        throw new Error("useNostrEvents must be used within a NostrEventsProvider")
    }
    return context
}