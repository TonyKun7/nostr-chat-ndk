type StorageKeys = {
  pubkey: string;
  favorites: string[];
  lastRead: Record<string, number>;
};

class Storage {
    private isClient = typeof window !== "undefined"

    private getItem(key: string): string | null {
        if (!this.isClient) return null
        try {
            return localStorage.getItem(key)
        } catch (error) {
            console.warn(`Failed to get item ${key} from localStorage:`, error)
            return null
        }
    }

    private setItem(key: string, value: string): void {
        if (!this.isClient) return
        try {
            localStorage.setItem(key, value)
        } catch (error) {
            console.warn(`Failed to set item ${key} in localStorage:`, error)
        }
    }

    private removeItem(key: string): void {
        if (!this.isClient) return
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.warn(`Failed to remove item ${key} from localStorage:`, error)
        }
    }

    public getPubkey(): string | null {
        return this.getItem("pubkey")
    }

    public setPubkey(pubkey: string): void {
        this.setItem("pubkey", pubkey)
    }

    public removePubkey(): void {
        this.removeItem("pubkey")
    }

    public hasPubkey(): boolean {
        return !!this.getPubkey()
    }

    public getFavorites(): string[] {
        const stored = this.getItem("favorites")
        if (!stored) return ["bc_21m"] // Default favorites
        try {
            const parsed = JSON.parse(stored)
            return Array.isArray(parsed) ? parsed : ["21m"]
        } catch (error) {
            console.warn("Failed to parse favorites from localStorage:", error)
            return ["bc_21m"]
        }
    }

    public setFavorites(favorites: string[]): void {
        this.setItem("favorites", JSON.stringify(favorites))
    }

    public getLastRead(channel: string): number {
        const stored = this.getItem(`lastRead-${channel}`)
        return stored ? Number(stored) || 0 : 0
    }

    public setLastRead(channel: string, timestamp: number): void {
        this.setItem(`lastRead-${channel}`, String(timestamp))
    }

    public getAllLastRead(): Record<string, number> {
        if (!this.isClient) return {}
    
        const result: Record<string, number> = {}
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key?.startsWith("lastRead-")) {
                    const channel = key.replace("lastRead-", "")
                    const value = localStorage.getItem(key)
                    result[channel] = value ? Number(value) || 0 : 0
                }
            }
        } catch (error) {
            console.warn("Failed to get all lastRead values:", error)
        }
        return result
    }

    public setTheme(theme: "light" | "dark"): void {
        this.setItem("theme", theme)
    }

    public getTheme(): "light" | "dark" | null {
        return this.getItem("theme") as "light" | "dark" | null
    }

    public clearAll(): void {
        this.removePubkey()
        this.setFavorites(["bc_21m"])
    
        if (!this.isClient) return
        try {
            const keysToRemove: string[] = []
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key?.startsWith("lastRead-")) {
                    keysToRemove.push(key)
                }
            }
            keysToRemove.forEach(key => this.removeItem(key))
        } catch (error) {
            console.warn("Failed to clear all lastRead values:", error)
        }
    }
}

export const storage = new Storage()

export type { StorageKeys }