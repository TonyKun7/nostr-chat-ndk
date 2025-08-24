import { useState, useEffect, useMemo } from "react"
import { useProfileValue } from "@nostr-dev-kit/ndk-hooks"
import type { NostrProfile, UseProfileReturn } from "@/types/nostr"

export interface UseProfileOptions {
  pubkey?: string;
  fallbackName?: string;
}

export function useProfile({ pubkey, fallbackName = "Anonymous User" }: UseProfileOptions): UseProfileReturn {
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(true)
  
    const rawProfile = useProfileValue(pubkey)

    const profile = useMemo<NostrProfile | null>(() => {
        if (!rawProfile) return null

        return {
            name: rawProfile.name,
            pubkey: rawProfile.pubkey,
            display_name: typeof rawProfile.display_name === "string" ? rawProfile.display_name : typeof rawProfile.displayName === "string" ? rawProfile.displayName : undefined,
            displayName: typeof rawProfile.displayName === "string" ? rawProfile.displayName : typeof rawProfile.display_name === "string" ? rawProfile.display_name : undefined,
            about: rawProfile.about,
            picture: rawProfile.picture,
            banner: rawProfile.banner,
            nip05: rawProfile.nip05,
            lud06: rawProfile.lud06,
            lud16: rawProfile.lud16,
            website: rawProfile.website,
        }
    }, [rawProfile])

    useEffect(() => {
        if (!pubkey) {
            setLoading(false)
            setError(undefined)
            return
        }

        setError(undefined)
        setLoading(true)

        const timeout = setTimeout(() => {
            if (!profile) {
                setError("Profile load timeout")
                setLoading(false)
            }
        }, 10000)

        return () => clearTimeout(timeout)
    }, [pubkey, profile])

    useEffect(() => {
        if (profile || !pubkey) {
            setLoading(false)
        }
    }, [profile, pubkey])

    return {
        profile,
        loading,
        error,
    }
}

export function useDisplayName(pubkey?: string, fallback = "Anonymous User"): string {
    const { profile } = useProfile({ pubkey, fallbackName: fallback })

    return useMemo(() => {
        if (!profile) return fallback
        if (profile.displayName || profile.display_name || profile.name) {
            return profile.displayName ?? profile.display_name ?? profile.name ?? fallback
        }
        return "anon#" + (pubkey?.slice(-4) ?? "")
    }, [profile, pubkey, fallback])
}