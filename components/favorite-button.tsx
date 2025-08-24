import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useFavorites } from "@/context/Favorite"

type FavoriteButtonProps = {
    channel: string;
};

export function FavoriteButton({ channel }: FavoriteButtonProps) {
    const { favorites, addFavorite, removeFavorite } = useFavorites()

    const isFavorite = favorites.includes(channel)

    const handleToggleFavorite = () => {
        if (isFavorite) removeFavorite(channel)
        else addFavorite(channel)
    }

    return (
        <Button variant="outline" size="sm" className="ml-2" onClick={handleToggleFavorite}>
            <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        </Button>
    )
}
