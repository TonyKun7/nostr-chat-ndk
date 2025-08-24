import { useCallback } from "react"

import { useFavorites as useOriginalFavorites } from "@/context/Favorite"

import type { FavoritesContextType } from "@/types/nostr"

export interface UseEnhancedFavoritesReturn extends FavoritesContextType {
  toggleFavorite: (channel: string) => void;
  addMultipleFavorites: (channels: string[]) => void;
  removeMultipleFavorites: (channels: string[]) => void;
  getFavoriteChannels: (allChannels: string[]) => string[];
  getNonFavoriteChannels: (allChannels: string[]) => string[];
}

export function useEnhancedFavorites(): UseEnhancedFavoritesReturn {
    const originalContext = useOriginalFavorites()
    const { favorites, addFavorite, removeFavorite, isFavorite } = originalContext

    const toggleFavorite = useCallback((channel: string) => {
        if (isFavorite(channel)) {
            removeFavorite(channel)
        } else {
            addFavorite(channel)
        }
    }, [isFavorite, addFavorite, removeFavorite])

    const addMultipleFavorites = useCallback((channels: string[]) => {
        channels.forEach(channel => {
            if (!isFavorite(channel)) {
                addFavorite(channel)
            }
        })
    }, [addFavorite, isFavorite])

    const removeMultipleFavorites = useCallback((channels: string[]) => {
        channels.forEach(channel => {
            if (isFavorite(channel)) {
                removeFavorite(channel)
            }
        })
    }, [removeFavorite, isFavorite])

    const getFavoriteChannels = useCallback((allChannels: string[]) => {
        return allChannels.filter(channel => favorites.includes(channel))
    }, [favorites])

    const getNonFavoriteChannels = useCallback((allChannels: string[]) => {
        return allChannels.filter(channel => !favorites.includes(channel) && channel !== "bc_21m")
    }, [favorites])

    return {
        ...originalContext,
        toggleFavorite,
        addMultipleFavorites,
        removeMultipleFavorites,
        getFavoriteChannels,
        getNonFavoriteChannels,
    }
}