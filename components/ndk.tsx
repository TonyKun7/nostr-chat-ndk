"use client"

import NDK from "@nostr-dev-kit/ndk"
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie"
import { NDKSessionLocalStorage, useNDKInit, useNDKSessionMonitor } from "@nostr-dev-kit/ndk-hooks"
import { useEffect } from "react"

const explicitRelayUrls = [
    "wss://relay.primal.net",
    "wss://relay.damus.io",
    "wss://nos.lol",
    "wss://relay.snort.social",
]

let cacheAdapter: NDKCacheAdapterDexie | undefined
if (typeof window !== "undefined") {
    cacheAdapter = new NDKCacheAdapterDexie({ dbName: "NOSTR_CHAT_NDK" })
}
 
const ndk = new NDK({ explicitRelayUrls, cacheAdapter })

if (typeof window !== "undefined") ndk.connect().catch(console.error)

const sessionStorage = new NDKSessionLocalStorage()

export default function NDKHeadless() {
    const initNDK = useNDKInit()

    useNDKSessionMonitor(sessionStorage, { profile: true, follows: true })

    useEffect(() => {
        if (ndk) initNDK(ndk)
    }, [initNDK])
    
    return null
}