"use client"

import { useState } from "react"
import { useNDK } from "@nostr-dev-kit/ndk-hooks"
import { NDKNip07Signer } from "@nostr-dev-kit/ndk"

import { Button } from "@/components/ui/button"

import { storage } from "@/lib/storage"

export function Signin() {
    const { ndk } = useNDK()
    const [loading, setLoading] = useState(false)

    const handleSignIn = async () => {
        setLoading(true)
        try {
            if (!window.nostr) {
                throw new Error("Nostr extension not found. Please install a Nostr browser extension.")
            }

            if (ndk) {
                const nip07signer = new NDKNip07Signer()
                ndk.signer = nip07signer
            }

            const pubkey = await window.nostr.getPublicKey()
            storage.setPubkey(pubkey)
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to sign in"
            console.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant="outline" disabled={loading} onClick={handleSignIn}>
            {loading ? "Signing in..." : "Sign in with Nostr Extension"}
        </Button>
    )
}