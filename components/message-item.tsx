"use client"

import { memo } from "react"
import { getDecodedToken } from "@cashu/cashu-ts"
import { useProfileValue } from "@nostr-dev-kit/ndk-hooks"
import { ClipboardPaste } from "lucide-react"
import Image from "next/image"
import { decode } from "bolt11"

import { ProfileCard } from "@/components/profile-card"
import { Button } from "@/components/ui/button"

import type { NostrEvent } from "@nostr-dev-kit/ndk"
import { useDisplayName } from "@/hooks/useProfile"

type MessageItemProps = {
    event: NostrEvent;
}

const CASHU_REGEX = /(cashu\S{10,})(?=\s|$)/i
const LIGHTNING_REGEX = /(lnbc\S{10,})(?=\s|$)/i
const LINK_REGEX = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/+&@#%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/+&@#%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/+&@#%=~_|$?!:,.]*\)|[A-Z0-9+&@#/+&@#%=~_|$])/i

function areEqual(prevProps: MessageItemProps, nextProps: MessageItemProps) {
    return prevProps.event.id === nextProps.event.id && prevProps.event.content === nextProps.event.content
}

export const MessageItem = memo(function MessageItem({ event }: MessageItemProps) {
    const profile = useProfileValue(event.pubkey)
    const username = useDisplayName(event.pubkey)

    let cashu = ""
    let lightning = ""
    for (const string of event.content.split(" ")) {
        const directMatch = string.match(CASHU_REGEX)
        if (directMatch) cashu = directMatch[1]

        const lightningMatch = string.match(LIGHTNING_REGEX)
        if (lightningMatch) lightning = lightningMatch[1]
    }

    let decodedCashu: ReturnType<typeof getDecodedToken> | undefined
    if (cashu !== "") {
        try {
            decodedCashu = getDecodedToken(cashu)
        } catch (error) {
            console.error("Failed to decode cashu token:", error)
        }
    }

    let decodedLightning: ReturnType<typeof decode> | undefined
    if (lightning !== "") {
        try {
            decodedLightning = decode(lightning)
        } catch (error) {
            console.error("Failed to decode lightning invoice:", error)
        }
    }

    function renderContentWithLinks(content: string) {
        const parts = content.split(LINK_REGEX)
        const matches = content.match(LINK_REGEX)

        let result: React.ReactNode[] = []
        for (let i = 0; i < parts.length; i++) {
            result.push(<span key={`text-${i}`}>{parts[i]}</span>)
            if (matches && matches[i]) {
                let url = matches[i]
                if (!/^https?:\/\//i.test(url)) {
                    url = "https://" + url
                }
                result.push(
                    <a
                        key={`link-${i}`}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all"
                    >
                        {matches[i]}
                    </a>,
                )
            }
        }
        return result
    }

    return (
        <div className="flex flex-col" key={event.id}>
            <div className="flex items-center gap-2 font-medium">
                <ProfileCard pubkey={event.pubkey} profile={profile}>
                    <button className="text-lg hover:underline cursor-pointer">
                        {username}
                    </button>
                </ProfileCard>
                <span className="text-xs text-muted-foreground">
                    {event.created_at && new Date(event.created_at * 1000).toLocaleTimeString()}
                </span>
            </div>

            {decodedCashu ? (
                <div className="bg-muted rounded-lg p-4 my-2 shadow flex flex-col gap-3 border border-border max-w-sm w-fit self-start">
                    <div className="flex items-center gap-2 mb-1">
                        <Image src="/cashu.png" alt="Cashu" className="h-12 w-12" style={{ objectFit: "contain" }} width={150} height={150} />
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide" style={{ fontSize: "1rem" }}>
                            Cashu Token
                        </span>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                        {decodedCashu.proofs.reduce((acc, proof) => acc + proof.amount, 0)} {decodedCashu.unit?.toString() || "sats"}
                    </span>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">
                        {decodedCashu.mint}
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Button variant="default" size="sm" onClick={() => navigator.clipboard.writeText(cashu)} >
                            <ClipboardPaste />
                            Copy Cashu Token
                        </Button>
                    </div>
                </div>
            ) : decodedLightning ? (
                <div className="bg-muted rounded-lg p-4 my-2 shadow flex flex-col gap-3 border border-border max-w-sm w-fit self-start">
                    <div className="flex items-center gap-2 mb-1">
                        <Image src="/lightning.png" alt="Lightning" className="h-12 w-12" style={{ objectFit: "contain" }} width={150} height={150} />
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide" style={{ fontSize: "1rem" }}>
                            Lightning Invoice
                        </span>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                        {decodedLightning.satoshis} sats
                    </span>
                    <div className="flex gap-2 mt-2">
                        <Button variant="default" size="sm" onClick={() => navigator.clipboard.writeText(lightning)} >
                            <ClipboardPaste />
                            Copy Lightning Invoice
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-base break-all whitespace-pre-wrap">{renderContentWithLinks(event.content)}</div>
            )}
        </div>
    )
}, areEqual)
