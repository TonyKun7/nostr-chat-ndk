"use client"

import { useState, useEffect, useMemo } from "react"
import { Globe, Star, Hash } from "lucide-react"
import { NDKNip07Signer, useNDK } from "@nostr-dev-kit/ndk-hooks"

import { Sidebar, SidebarContent, SidebarMenu } from "@/components/ui/sidebar"
import { AppSidebarHeader } from "@/components/sidebar/sidebar-header"
import { SidebarChannelGroup } from "@/components/sidebar/sidebar-channel-group"
import { AppSidebarFooter } from "@/components/sidebar/sidebar-footer"

import { useNostrEvents } from "@/context/Nostr"

import { useEnhancedFavorites } from "@/hooks/useFavorites"

import { storage } from "@/lib/storage"

import type { ChannelGroup } from "@/types/nostr"

export function AppSideBar() {
    const { ndk } = useNDK()
    const { events } = useNostrEvents()
    const { favorites, getNonFavoriteChannels } = useEnhancedFavorites()
    const pubkey = storage.getPubkey()
    const hasPubkey = storage.hasPubkey()

    if (hasPubkey && ndk && !ndk.signer) {
        ndk.signer = new NDKNip07Signer()
    }

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const allChannels = useMemo(() => {
        return Array.from(new Set(
            events
                .map(event => {
                    const channelTag = event.tags.find(tag => tag[0] === "g" || tag[0] === "d")?.[1]
                    if (typeof channelTag === "string") {
                        if (event.kind === 20000 && !channelTag.startsWith("bc_")) {
                            return `bc_${channelTag}`
                        }
                        return channelTag
                    }
                    return undefined
                })
                .filter((m): m is string => typeof m === "string"),
        ))
    }, [events])

    const channelGroups = useMemo<ChannelGroup[]>(() => {
        return [
            { title: "Global", icon: <Globe />, items: ["bc_21m"] },
            { title: "Favorites", icon: <Star />, items: favorites },
            { title: "Channels", icon: <Hash />, items: getNonFavoriteChannels(allChannels) },
        ]
    }, [favorites, allChannels, getNonFavoriteChannels])

    return (
        <Sidebar collapsible="offcanvas" variant="floating">
            <AppSidebarHeader />

            <SidebarContent className="pl-4">
                <SidebarMenu>
                    {channelGroups.map(group => (
                        <SidebarChannelGroup key={group.title} group={group} events={events} mounted={mounted} />
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <AppSidebarFooter hasPubkey={hasPubkey} pubkey={pubkey} />
        </Sidebar>
    )
}
