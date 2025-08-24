"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { useNDK } from "@nostr-dev-kit/ndk-hooks"
import { Virtuoso } from "react-virtuoso"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleBreadcrumb } from "@/components/simple-breadcrumb"
import { MessageItem } from "@/components/message-item"
import { FavoriteButton } from "@/components/favorite-button"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useNostrEvents } from "@/context/Nostr"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useDisplayName } from "@/hooks/useProfile"

const ListWithGap = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    (props, ref) => <div {...props} ref={ref} className="flex flex-col gap-4 pr-4" />,
)
ListWithGap.displayName = "ListWithGap"

export default function Page() {
    const params = useParams()
    const channel = params.channel as string
    const { events } = useNostrEvents()
    const { ndk } = useNDK()
    const pubkey = typeof window !== "undefined" ? localStorage.getItem("pubkey") : null
    const username = useDisplayName(pubkey ?? undefined)

    const isGeoHash = channel.startsWith("bc_")

    const filterEvents = React.useCallback(
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

    const [displayedMessages, setDisplayedMessages] = useState<NDKEvent[]>([])

    useEffect(() => {
        setDisplayedMessages(events.filter(e => filterEvents(e)))
    }, [events, channel, filterEvents])

    useEffect(() => {
        if (!displayedMessages.length) return
        const lastMessage = displayedMessages[displayedMessages.length - 1]
        if (lastMessage.created_at) {
            localStorage.setItem(`lastRead-${channel}`, String(lastMessage.created_at))
        }
    }, [channel, displayedMessages])

    const [input, setInput] = useState("")

    const handleSendMessage = async () => {
        if (!input) return

        const kind = isGeoHash ? 20000 : 23333
        const tag = isGeoHash ? "g" : "d"
        const room = isGeoHash ? channel.split("bc_")[1] : channel

        const tags = [[tag, room], ["n", username]]

        if (ndk) {
            const event = new NDKEvent(ndk, { kind, content: input, tags })
            await event.publish()
        }

        setInput("")
    }

    return (
        <div className="flex flex-col h-screen p-2 overflow-hidden">
            <Card className="flex-1 flex flex-col shadow-lg min-h-0">
                <CardHeader className="pb-4 px-6 flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <SidebarTrigger variant="outline" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <div className="flex items-center gap-2">
                            <SimpleBreadcrumb channel={channel} />
                            <FavoriteButton channel={channel} />
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 px-6 py-4 min-h-0 overflow-hidden">
                    <div className="flex flex-col flex-1">
                        {displayedMessages.length === 0 ? (
                            <div className="text-muted-foreground text-center py-8 flex-1 flex items-end justify-center">
                                No messages yet
                            </div>
                        ) : (
                            <Virtuoso<NDKEvent>
                                style={{ height: "100%" }}
                                data={displayedMessages}
                                className="scrollbar-always"
                                computeItemKey={item => item}
                                itemContent={(index, event) => (
                                    <div className="flex items-start gap-3 p-3 rounded bg-muted">
                                        <MessageItem event={{ ...event, created_at: event.created_at ?? 0 }} />
                                    </div>
                                )}
                                followOutput="smooth"
                                initialTopMostItemIndex={displayedMessages.length > 0 ? displayedMessages.length - 1 : 0}
                                components={{ List: ListWithGap }}
                            />
                        )}
                    </div>

                    <form
                        className="flex gap-2 pt-2 mt-2 group"
                        onSubmit={e => {
                            e.preventDefault()
                            handleSendMessage().catch(console.error)
                        }}
                    >
                        <div className="relative flex-1 flex items-center gap-2">
                            <Input
                                className="w-full px-3 py-2"
                                placeholder="Write your message…"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                disabled={!pubkey}
                                style={!pubkey ? { opacity: 0.5, pointerEvents: "none" } : {}}
                            />
                        </div>

                        <Button variant="outline" type="submit" className="px-6 py-2" disabled={!pubkey}>
                            Send
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}