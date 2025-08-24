"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"

import { storage } from "@/lib/storage"

type FavoritesContextType = {
  favorites: string[];
  addFavorite: (channel: string) => void;
  removeFavorite: (channel: string) => void;
  isFavorite: (channel: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>(() => storage.getFavorites())

    useEffect(() => {
        setFavorites(storage.getFavorites())
    }, [])

    useEffect(() => {
        storage.setFavorites(favorites)
    }, [favorites])

    const addFavorite = useCallback((channel: string) => {
        setFavorites((prev) => (prev.includes(channel) ? prev : [...prev, channel]))
    }, [])

    const removeFavorite = useCallback((channel: string) => {
        setFavorites((prev) => prev.filter((c) => c !== channel))
    }, [])

    const isFavorite = useCallback((channel: string) => favorites.includes(channel), [favorites])

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const ctx = useContext(FavoritesContext)
    if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>")
    return ctx
}
